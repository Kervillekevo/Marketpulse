from django.contrib import admin
from .models import Category, SubCategory, Product, ProductImage


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "category")
    list_filter = ("category",)
    search_fields = ("name",)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline]

    list_display = (
        "title",
        "price",
        'old_price',
        'rating',
        "category",
        "subcategory",
        "is_sold",
        "created_at",
    )
    list_filter = ("category", "subcategory", "created_at")
    search_fields = ("title", "description")
