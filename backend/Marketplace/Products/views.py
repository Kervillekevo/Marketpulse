from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import ProductsSerializers
from .models import Product, Category

@api_view(["GET"])
@permission_classes([AllowAny])
def ProductList(request):
    category = request.GET.get("category")
    subcategory = request.GET.get("subcategory")

    products = Product.objects.select_related(
        "category",
        "subcategory",
        "user"
    ).order_by("-created_at")


    if category:
        products = products.filter(category__name=category)

    if subcategory:
        products = products.filter(subcategory__name=subcategory)

    serializer = ProductsSerializers(products, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def CreateProduct(request):
    serializer = ProductsSerializers(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)  #attach current user
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def ProductUpdate(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if product.user != request.user:  #compare instance user
        return Response({"error": "You are not allowed to update this product"}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = ProductsSerializers(product, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([AllowAny])
def ProductDetail(request, pk):
    try:
        product = Product.objects.select_related(
            "category",
            "subcategory",
            "user"
        ).get(pk=pk)
    except Product.DoesNotExist:
        return Response(
            {"error": "Product not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ProductsSerializers(product, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def DeleteProduct(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if product.user != request.user:
        return Response({'error': 'You are not allowed to delete this product'}, status=status.HTTP_403_FORBIDDEN)
    
    product.delete()
    return Response({'message': 'Product deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

@api_view(["GET"])
@permission_classes([AllowAny])
def CategoryList(request):
    categories = Category.objects.prefetch_related("subcategories").all()
    data = [
        {
            "name": cat.name,
            "subcategories": [sub.name for sub in cat.subcategories.all()]
        }
        for cat in categories
    ]
    return Response(data, status=status.HTTP_200_OK)