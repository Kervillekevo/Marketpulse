from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem
from Products.models import Product

class ProductMiniSerializer(serializers.ModelSerializer):
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



class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'total_amount', 'status', 'items', 'created_at']
