# filepath: c:\Users\Tomek\source\loopstore\backend\shop\views.py
from rest_framework import viewsets, status, filters # type: ignore
from rest_framework.decorators import action # type: ignore
from rest_framework.response import Response # type: ignore
from django_filters.rest_framework import DjangoFilterBackend # type: ignore
from .models import Product, Category, Order, Tag
from .serializers import (
    ProductSerializer,
    CategorySerializer,
    OrderSerializer,
    TagSerializer,
    ProductDetailSerializer
)
from django.http import HttpResponse
from rest_framework.views import APIView # type: ignore
from django.db.models import Q

def home(request):
    return HttpResponse("Welcome to the Loopstore!")
	
class OrderView(APIView):
    def get(self, request):
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = 'slug'

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'tags', 'condition', 'size', 'is_featured']
    search_fields = ['name', 'description', 'brand', 'material']
    ordering_fields = ['price', 'created_at', 'name']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)
        
        # Filtrowanie po zakresie cen
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)
        if min_price is not None:
            queryset = queryset.filter(price__gte=min_price)
        if max_price is not None:
            queryset = queryset.filter(price__lte=max_price)

        # Filtrowanie po wielu kategoriach
        categories = self.request.query_params.getlist('categories', [])
        if categories:
            queryset = queryset.filter(category__slug__in=categories)

        # Filtrowanie po wielu tagach
        tags = self.request.query_params.getlist('tags', [])
        if tags:
            queryset = queryset.filter(tags__slug__in=tags)

        return queryset

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured = self.get_queryset().filter(is_featured=True)
        serializer = self.get_serializer(featured, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if query:
            queryset = self.get_queryset().filter(
                Q(name__icontains=query) |
                Q(description__icontains=query) |
                Q(brand__icontains=query) |
                Q(material__icontains=query) |
                Q(category__name__icontains=query) |
                Q(tags__name__icontains=query)
            ).distinct()
        else:
            queryset = self.get_queryset()
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'payment_status', 'shipping_status']
    ordering_fields = ['created_at', 'total_amount']

    def perform_create(self, serializer):
        order = serializer.save()
        # Tu możemy dodać dodatkową logikę, np. wysłanie maila z potwierdzeniem

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        status = request.data.get('status')
        if status and status in dict(Order.STATUS_CHOICES):
            order.status = status
            order.save()
            serializer = self.get_serializer(order)
            return Response(serializer.data)
        return Response(
            {'error': 'Invalid status'},
            status=status.HTTP_400_BAD_REQUEST
        )