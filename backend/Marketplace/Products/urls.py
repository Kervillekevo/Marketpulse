from.import views
from django.urls import path
from.views import ProductList, CreateProduct, ProductUpdate, DeleteProduct

urlpatterns = [
    path('',views.ProductList, name='ProductList' ),
    path('create/', views.CreateProduct, name='CreateProduct'),
    path('<int:pk>/', views.ProductDetail, name='ProductDetail'), 
    path('products/<int:pk>/update', views.ProductUpdate, name='ProductUpdate'),
    path('products/<int:pk>/delete', views.DeleteProduct, name='DeleteProduct'),
    path('categories/', views.CategoryList, name='CategoryList')

]