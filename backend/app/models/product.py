import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import String, Text, Numeric, Boolean, DateTime, func, Uuid
from sqlalchemy.orm import Mapped, mapped_column

class Product(Base):
    _