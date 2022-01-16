from django.core.validators import MinValueValidator
from django.db import models
from decimal import Decimal


class Product(models.Model):
    name = models.CharField(max_length=40)
    description = models.CharField(max_length=70)
    price = models.DecimalField(decimal_places=2, max_digits=12, validators=[MinValueValidator(Decimal('0.01'))])
    image = models.ImageField(upload_to='product-images/')