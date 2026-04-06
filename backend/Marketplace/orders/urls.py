from django.urls import path
from . import views

urlpatterns = [

    
    path('cart/', views.view_cart, name='view_cart'),
    path('cart/add/', views.add_to_cart, name='add_to_cart'),
    path('cart/remove/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('cart/clear/', views.clear_cart, name='clear_cart'),


    path('orders/', views.list_orders, name='list_orders'),
    path('orders/<int:order_id>/', views.get_order_detail, name='order_detail'),
    path('order/create/', views.create_order, name='create_order'),
    path('orders/<int:order_id>/cancel/', views.cancel_order, name='cancel_order'),
    path('orders/cancel-all/', views.cancel_all_orders, name='cancel_all_orders'),

    
    path('orders/<int:order_id>/shipment/create/', views.create_shipment, name='create_shipment'),
    path('orders/<int:order_id>/shipment/', views.get_shipment, name='get_shipment'),
    path("mpesa/test/", views.test_mpesa),
    path("mpesa/pay/",views.mpesa_stk_push),
    path("mpesa/callback/", views.mpesa_callback),

]