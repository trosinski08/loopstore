# filepath: c:\Users\Tomek\source\loopstore\backend\shop\views.py
from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import Product, Order, Category, ProductSize, OrderStatus
from .serializers import (
    ProductSerializer, 
    OrderSerializer, 
    CategorySerializer,
    ProductSizeSerializer,
    OrderStatusSerializer
)

def home(request):
    return HttpResponse("Welcome to the Loopstore!")

@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint for Docker container health monitoring
    """
    return Response({"status": "healthy"}, status=status.HTTP_200_OK)
	
class OrderView(APIView):
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

    @action(detail=True)
    def products(self, request, slug=None):
        category = self.get_object()
        products = Product.objects.filter(category=category)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class ProductSizeViewSet(viewsets.ModelViewSet):
    queryset = ProductSize.objects.all()
    serializer_class = ProductSizeSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = Product.objects.all()
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__slug=category)
        
        # Filter by size
        size = self.request.query_params.get('size', None)
        if size:
            queryset = queryset.filter(sizes__name=size)
        
        # Filter by status
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        
        # Search by name or description
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(description__icontains=search)
            )
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Sort
        sort_by = self.request.query_params.get('sort', None)
        if sort_by:
            if sort_by == 'price_asc':
                queryset = queryset.order_by('price')
            elif sort_by == 'price_desc':
                queryset = queryset.order_by('-price')
            elif sort_by == 'newest':
                queryset = queryset.order_by('-created_at')
            elif sort_by == 'name':
                queryset = queryset.order_by('name')
        
        return queryset

    @action(detail=True, methods=['post'])
    def update_stock(self, request, slug=None):
        product = self.get_object()
        new_stock = request.data.get('stock', None)
        
        if new_stock is None:
            return Response(
                {'error': 'Stock value is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            new_stock = int(new_stock)
            if new_stock < 0:
                raise ValueError
        except ValueError:
            return Response(
                {'error': 'Invalid stock value'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        product.stock = new_stock
        if new_stock == 0:
            product.status = 'out_of_stock'
        product.save()
        
        serializer = self.get_serializer(product)
        return Response(serializer.data)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    lookup_field = 'order_number'

    @action(detail=True, methods=['post'])
    def update_status(self, request, order_number=None):
        order = self.get_object()
        new_status = request.data.get('status', None)
        notes = request.data.get('notes', '')
        
        if not new_status:
            return Response(
                {'error': 'Status is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create order status history entry
        OrderStatus.objects.create(
            order=order,
            status=new_status,
            notes=notes
        )
        
        # Update order status
        order.status = new_status
        order.save()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def update_payment_status(self, request, order_number=None):
        order = self.get_object()
        new_status = request.data.get('payment_status', None)
        
        if not new_status:
            return Response(
                {'error': 'Payment status is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if new_status not in dict(Order.PAYMENT_STATUS_CHOICES):
            return Response(
                {'error': 'Invalid payment status'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.payment_status = new_status
        order.save()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)