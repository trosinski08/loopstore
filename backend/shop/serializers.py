# filepath: c:\Users\Tomek\source\loopstore\backend\shop\serializers.py
from requests import Response
from scipy import stats
from rest_framework import serializers # type: ignore
from .models import Product, Category, Order, Tag
from rest_framework.views import APIView # type: ignore
import logging

class CategorySerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(read_only=True)
    products_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'parent', 'products_count']

    def get_products_count(self, obj):
        return obj.products.count()

class TagSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(read_only=True)

    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    slug = serializers.SlugField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price',
            'stock', 'image', 'category', 'category_name',
            'tags', 'condition', 'size', 'brand', 'material',
            'is_active', 'is_featured'
        ]

class ProductDetailSerializer(ProductSerializer):
    category = CategorySerializer(read_only=True)
    related_products = serializers.SerializerMethodField()

    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + ['created_at', 'updated_at', 'related_products']

    def get_related_products(self, obj):
        # Pobierz produkty z tej samej kategorii
        related = Product.objects.filter(
            category=obj.category,
            is_active=True
        ).exclude(id=obj.id)[:4]
        return ProductSerializer(related, many=True).data

class OrderItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    price = serializers.DecimalField(max_digits=10, decimal_places=2)

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'name', 'email', 'phone', 'address',
            'city', 'postal_code', 'country', 'items',
            'created_at', 'status', 'payment_status',
            'shipping_status', 'total_amount', 'shipping_cost',
            'tracking_number', 'notes'
        ]

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("Order must contain at least one item.")
        
        for item in items:
            try:
                product = Product.objects.get(id=item['product_id'])
                if product.stock < item['quantity']:
                    raise serializers.ValidationError(
                        f"Not enough stock for product {product.name}. "
                        f"Available: {product.stock}, requested: {item['quantity']}"
                    )
            except Product.DoesNotExist:
                raise serializers.ValidationError(
                    f"Product with id {item['product_id']} does not exist."
                )
        return items

    def create(self, validated_data):
        items = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        
        # Aktualizuj stan magazynowy
        for item in items:
            product = Product.objects.get(id=item['product_id'])
            product.stock -= item['quantity']
            product.save()
        
        order.items = items
        order.save()
        return order

logger = logging.getLogger(__name__)

class OrderView(APIView):
	def post(self, request):
		logger.info(f"Received order creation request: {request.data}")
		serializer = OrderSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			logger.info(f"Order created: {serializer.data}")
			return Response(serializer.data, status=stats.HTTP_201_CREATED)
		else:
			logger.error(f"Order creation failed: {serializer.errors}")
			return Response(serializer.errors, status=stats.HTTP_400_BAD_REQUEST)