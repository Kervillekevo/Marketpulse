from rest_framework import serializers
from .models import Product, SubCategory

class ProductsSerializers(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    images = serializers.SerializerMethodField()
    category = serializers.CharField(source="category.name")
    subcategory = serializers.CharField(
        source="subcategory.name",
        allow_null=True
    )

    class Meta:
        model = Product
        fields = [
            'id',
            'title',
            'description',
            'price',
            'category',
            'subcategory',
            'images',
            'created_at',
            'is_sold',
            'user'
        ]

    def get_images(self, obj):
        request = self.context.get('request')
        if obj.images:
            return request.build_absolute_uri(obj.images.url)
        return None
