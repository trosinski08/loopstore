# filepath: c:\Users\Tomek\source\loopstore\backend\shop\views.py
from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to the Loopstore!")

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer