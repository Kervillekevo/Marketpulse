from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.core.mail import send_mail
from rest_framework import status
from django.db import transaction
from .mpesa import get_access_token
from .mpesa import stk_push
from django.conf import settings
from .models import Cart, CartItem, Order, OrderItem, Shipment, MpesaTransaction
from .serializers import CartSerializer, OrderSerializer, ShipmentSerializer
from Products.models import Product


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_cart(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart, context={"request": request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))

    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

    cart, created = Cart.objects.get_or_create(user=request.user)
    cart_item, item_created = CartItem.objects.get_or_create(cart=cart, product=product)

    if not item_created:
        cart_item.quantity += quantity
    else:
        cart_item.quantity = quantity

    cart_item.save()
    return Response({"message": "Product added to cart"})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, item_id):
    try:
        cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
        cart_item.delete()
        return Response({"message": "Item removed"})
    except CartItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    try:
        cart = Cart.objects.get(user=request.user)
        cart.items.all().delete()
        return Response('Cart cleared successfully')
    except Cart.DoesNotExist:
        return Response({"error": "Cart does not exist"}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        cart = Cart.objects.get(user=request.user)
    except Cart.DoesNotExist:
        return Response({"error": "Cart is empty"}, status=400)

    cart_items = cart.items.all()
    if not cart_items:
        return Response({"error": "Cart is empty"}, status=400)

    total_amount = sum(item.total_price for item in cart_items)

    order = Order.objects.create(
        user=request.user,
        total_amount=total_amount,
        status='pending'
    )

    for item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price
        )

    cart_items.delete()

    # Send order confirmation email
    try:
        if request.user.email:
            items_summary = "\n".join([
                f"  - {item.product.title} x{item.quantity} @ Ksh {item.price}"
                for item in order.items.all()
            ])
            send_mail(
                subject=f"Order #{order.id} Confirmed — Big Five Technologies",
                message=f"""
Hi {request.user.username},

Thank you for your order!

Your Order #{order.id} has been received and is now being processed.

ORDER SUMMARY
{items_summary}

ORDER TOTAL: Ksh {order.total_amount}

Next Steps:
1. Add your delivery details in My Orders
2. Complete payment via M-Pesa
3. We'll process and ship your order

Track your order at: {settings.FRONTEND_URL}/orders

Need help? Contact us:
📞 0790 240220
📧 kelvinngui00@gmail.com

Thank you for shopping with Big Five Technologies! 💻
                """,
                from_email='kelvinngui00@gmail.com',
                recipient_list=[request.user.email],
                fail_silently=False,
            )
    except Exception:
        pass

    serializer = OrderSerializer(order, context={"request": request})
    return Response(serializer.data, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_orders(request):
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True, context={"request": request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_detail(request, order_id):
    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = OrderSerializer(order, context={"request": request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_order(request, order_id):
    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    if order.status in ['shipped', 'completed']:
        return Response({"error": "Order cannot be cancelled"}, status=status.HTTP_400_BAD_REQUEST)

    order.status = 'cancelled'
    order.save()

    if hasattr(order, 'shipment'):
        order.shipment.status = 'cancelled'
        order.shipment.save()

    # Send cancellation email
    try:
        if request.user.email:
            send_mail(
                subject=f"Order #{order.id} Cancelled — Big Five Technologies",
                message=f"""
Hi {request.user.username},

Your Order #{order.id} has been cancelled as requested.

If this was a mistake, please place a new order at:
{settings.FRONTEND_URL}/products

Need help? Contact us:
📞 0790 240220
📧 kelvinngui00@gmail.com

Big Five Technologies 💻
                """,
                from_email='kelvinngui00@gmail.com',
                recipient_list=[request.user.email],
                fail_silently=True,
            )
    except Exception:
        pass

    return Response({"message": "Order cancelled successfully"}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_all_orders(request):
    with transaction.atomic():
        orders = Order.objects.filter(
            user=request.user
        ).exclude(
            status__in=['shipped', 'completed', 'cancelled']
        )
        orders.update(status='cancelled')
        Shipment.objects.filter(order__in=orders).update(status='cancelled')

    return Response({"message": "All eligible orders cancelled"})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_shipment(request, order_id):
    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({"error": "Order cannot be found"}, status=status.HTTP_404_NOT_FOUND)

    if hasattr(order, 'shipment'):
        return Response({"error": "Shipment already exists"}, status=status.HTTP_400_BAD_REQUEST)

    serializer = ShipmentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(order=order)

        # Send shipment confirmation email
        try:
            if request.user.email:
                send_mail(
                    subject=f"Delivery Details Added — Order #{order.id}",
                    message=f"""
Hi {request.user.username},

Your delivery details for Order #{order.id} have been saved successfully.

NEXT STEP: Complete your M-Pesa payment

Go to My Orders to pay:
{settings.FRONTEND_URL}/orders

Need help? Contact us:
📞 0790 240220
📧 kelvinngui00@gmail.com

Big Five Technologies 💻
                    """,
                    from_email='kelvinngui00@gmail.com',
                    recipient_list=[request.user.email],
                    fail_silently=True,
                )
        except Exception:
            pass

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_shipment(request, order_id):
    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        shipment = order.shipment
    except Shipment.DoesNotExist:
        return Response({"error": "Shipment not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ShipmentSerializer(shipment)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([AllowAny])
def test_mpesa(request):
    token = get_access_token()
    return Response({"access_token": token})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mpesa_stk_push(request):
    phone = request.data.get("phone")
    order_id = request.data.get("order_id")

    if not phone or not order_id:
        return Response({"error": "Phone and order_id required"}, status=400)

    phone = str(phone).strip()
    if phone.startswith("+254"):
        phone = phone[1:]
    elif phone.startswith("0"):
        phone = "254" + phone[1:]
    elif not phone.startswith("254"):
        phone = "254" + phone

    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)

    amount = int(order.total_amount)

    try:
        response = stk_push(phone, amount)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

    if "errorCode" in response:
        return Response({"error": response.get("errorMessage", "M-Pesa error")}, status=400)

    MpesaTransaction.objects.create(
        order=order,
        merchant_request_id=response.get("MerchantRequestID", ""),
        checkout_request_id=response.get("CheckoutRequestID", ""),
        result_code=0,
        result_desc="STK Sent",
        amount=amount,
        phone_number=phone,
        status="PENDING"
    )

    return Response(response)


@api_view(["POST"])
@permission_classes([AllowAny])
def mpesa_callback(request):
    data = request.data

    print("\n===== MPESA CALLBACK RECEIVED =====")
    print(data)
    print("===================================\n")

    try:
        callback = data["Body"]["stkCallback"]
        checkout_request_id = callback.get("CheckoutRequestID")
        result_code = callback.get("ResultCode")
        result_desc = callback.get("ResultDesc")

        mpesa_tx = MpesaTransaction.objects.filter(
            checkout_request_id=checkout_request_id
        ).first()

        if not mpesa_tx:
            print("NO TRANSACTION FOUND — checkout_request_id mismatch")
            return Response({"ResultCode": 0, "ResultDesc": "Accepted"})

        amount = None
        mpesa_receipt_number = None
        phone_number = None

        if result_code == 0:
            items = callback["CallbackMetadata"]["Item"]
            for item in items:
                name = item["Name"]
                if name == "Amount":
                    amount = item["Value"]
                elif name == "MpesaReceiptNumber":
                    mpesa_receipt_number = item["Value"]
                elif name == "PhoneNumber":
                    phone_number = item["Value"]

        mpesa_tx.result_code = result_code
        mpesa_tx.result_desc = result_desc
        mpesa_tx.amount = amount
        mpesa_tx.mpesa_receipt_number = mpesa_receipt_number
        mpesa_tx.phone_number = phone_number
        mpesa_tx.status = "SUCCESS" if result_code == 0 else "FAILED"
        mpesa_tx.save()

        if result_code == 0 and mpesa_tx.order:
            order = mpesa_tx.order
            order.status = "paid"
            order.save()
            print(f"Order {order.id} marked as PAID")

            # Send payment confirmation email
            try:
                if order.user.email:
                    send_mail(
                        subject=f"Payment Confirmed — Order #{order.id}",
                        message=f"""
Hi {order.user.username},

Your M-Pesa payment has been received successfully! 

━━━━━━━━━━━━━━━━━━━━━━━
PAYMENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━
Order #: {order.id}
Amount Paid: Ksh {amount}
M-Pesa Receipt: {mpesa_receipt_number}
━━━━━━━━━━━━━━━━━━━━━━━

Your order is now being processed and will be
delivered to your provided address.

Track your order at:
{settings.FRONTEND_URL}/orders

Need help? Contact us:
📞 0790 240220
📧 kelvinngui00@gmail.com

Thank you for shopping with Big Five Technologies! 💻
                        """,
                        from_email='kelvinngui00@gmail.com',
                        recipient_list=[order.user.email],
                        fail_silently=True,
                    )
            except Exception:
                pass

    except Exception as e:
        print(f"CALLBACK ERROR: {str(e)}")
        import traceback
        traceback.print_exc()

    return Response({"ResultCode": 0, "ResultDesc": "Accepted"})