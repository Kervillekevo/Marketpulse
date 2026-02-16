from django.urls import path
from . import views

urlpatterns = [
    # CART
    path('cart/', views.view_cart, name='view_cart'),
    path('cart/add/', views.add_to_cart, name='add_to_cart'),
    path('cart/remove/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),

    # ORDER
    path('order/create/', views.create_order, name='create_order'),
]
