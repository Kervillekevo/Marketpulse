from django import forms
from.models import Product

class ProductForm(forms.ModelForm):
    class meta:
        model = Product
        fields = ['title', 'description', 'price', 'category', 'subcategory', 'images']