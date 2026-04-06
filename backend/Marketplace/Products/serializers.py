from rest_framework import serializers
from .models import Product, SubCategory, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = ProductImage
        fields = ['id', 'image']
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None     

class ProductsSerializers(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    category = serializers.CharField(source="category.name")
    subcategory = serializers.CharField(
        source="subcategory.name",
        allow_null=True
    )
    discount_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id',
            'title',
            'description',
            'price',
            'old_price',
            'rating',
            'discount_percentage',
            'category',
            'subcategory',
            'images',
            'created_at',
            'is_sold',
            'user'
        ]
    def get_discount_percentage(self, obj):
        return obj.discount_percentage()    

