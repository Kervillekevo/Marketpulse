from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class SubCategory(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="subcategories"
    )
    name = models.CharField(max_length=50)

    class Meta:
        unique_together = ('category', 'name')
        verbose_name_plural = "Sub Categories"

    def __str__(self):
        return f"{self.category.name} → {self.name}"


class Product(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='products'
    )

    title = models.CharField(max_length=30)
    description = models.CharField(max_length=200)
    price = models.DecimalField(decimal_places=2, max_digits=10)
    old_price = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)
    rating = models.FloatField(default=0)

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products"
    )

    subcategory = models.ForeignKey(
        SubCategory,
        on_delete=models.PROTECT,
        related_name="products",
        null=True,
        blank=True
    )

    is_sold = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def discount_percentage(self):
        if self.old_price and self.old_price > self.price:
            return round(
                ((self.old_price - self.price) / self.old_price) * 100,
                0
            )
        return 0

    def __str__(self):
        return self.title

    
class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        related_name="images",
        on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to="product_images/")

    def __str__(self):
        return f"Image for {self.product.title}"
