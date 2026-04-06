from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem, Shipment
from Products.models import Product
from Products.serializers import ProductImageSerializer


class ProductMiniSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'images']


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductMiniSerializer(read_only=True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'total_price']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'created_at']


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductMiniSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price']



class ShipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = '__all__'
        read_only_fields = ['order', 'status', 'tracking_number']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    shipment = ShipmentSerializer(read_only=True)  # lowercase & matches related_name

    class Meta:
        model = Order
        fields = ['id', 'user', 'total_amount', 'shipment', 'status', 'items', 'created_at']