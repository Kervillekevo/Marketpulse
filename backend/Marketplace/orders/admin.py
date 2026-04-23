from django.contrib import admin
from .models import Cart, CartItem, Order, OrderItem, Shipment, MpesaTransaction


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'price']


class ShipmentInline(admin.StackedInline):
    model = Shipment
    extra = 0
    readonly_fields = [
        'name', 'email', 'phone_number',
        'county', 'town', 'street_address',
        'delivery_instructions', 'shipping_method',
        'tracking_number', 'estimated_delivery_date',
        'shipping_fee'
    ]
    verbose_name = "Delivery Details"


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    inlines = [CartItemInline]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline, ShipmentInline]
    list_display = (
        'id',
        'user',
        'get_customer_phone',
        'get_customer_email',
        'get_delivery_address',
        'total_amount',
        'status',
        'created_at'
    )
    list_filter = ('status', 'created_at')
    list_editable = ['status']
    search_fields = ['user__username', 'user__email', 'shipment__phone_number', 'shipment__name']
    readonly_fields = ['user', 'total_amount', 'created_at']

    def get_customer_phone(self, obj):
        if hasattr(obj, 'shipment') and obj.shipment:
            return obj.shipment.phone_number
        return '-'
    get_customer_phone.short_description = 'Phone'

    def get_customer_email(self, obj):
        if hasattr(obj, 'shipment') and obj.shipment:
            return obj.shipment.email
        return obj.user.email or '-'
    get_customer_email.short_description = 'Email'

    def get_delivery_address(self, obj):
        if hasattr(obj, 'shipment') and obj.shipment:
            s = obj.shipment
            return f"{s.street_address}, {s.town}, {s.county}"
        return '-'
    get_delivery_address.short_description = 'Delivery Address'


@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = [
        'order',
        'name',
        'phone_number',
        'email',
        'town',
        'county',
        'street_address',
        'shipping_method',
        'status'
    ]
    list_filter = ['status', 'shipping_method', 'county']
    search_fields = ['name', 'phone_number', 'email', 'order__id']
    readonly_fields = [
        'name', 'email', 'phone_number',
        'county', 'town', 'street_address',
        'delivery_instructions', 'shipping_method',
    ]


@admin.register(MpesaTransaction)
class MpesaTransactionAdmin(admin.ModelAdmin):
    list_display = (
        'order',
        'phone_number',
        'amount',
        'mpesa_receipt_number',
        'status',
        'created_at',
    )
    list_filter = ['status']
    search_fields = ['phone_number', 'mpesa_receipt_number', 'order__id']