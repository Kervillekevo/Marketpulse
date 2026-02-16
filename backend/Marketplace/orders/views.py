from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Cart, CartItem, Order, OrderItem
from .serializers import CartSerializer, OrderSerializer
from Products.models import Product

# Create your views here.
@api_view(['GET'])#Turns a function in to an API endpoint
#@permission_classes([IsAuthenticated])#Controls who can access it
def view_cart(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def add_to_cart(request):
    #reads the json send from the frontend
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))

    try:
        product = Product.objects.get(id=product_id)

    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)
   
    cart, created = Cart.objects.get_or_create(user=request.user)

    cart_item, item_created = CartItem.objects.get_or_create(
        cart=cart,
        product=product
    )

    if not item_created:
        cart_item.quantity += quantity
    else:
        cart_item.quantity = quantity

    cart_item.save()

    return Response({"message": "Product added to cart"})
    
@api_view(['DELETE'])
#@permission_classes([IsAuthenticated])
def remove_from_cart(request, item_id):
    try:
        cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
        cart_item.delete()
        return Response({"message": "Item removed"})
    except CartItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)
    


@api_view(['POST'])
#@permission_classes([IsAuthenticated])
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

    cart_items.delete()  # clear cart

    serializer = OrderSerializer(order)
    return Response(serializer.data, status=201)
