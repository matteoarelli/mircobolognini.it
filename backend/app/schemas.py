from datetime import datetime
from typing import Any, List, Optional

from pydantic import BaseModel


# --- Content ---
class ContentOut(BaseModel):
    id: int
    section: str
    key: str
    value: str

    model_config = {"from_attributes": True}


# --- Service ---
class ServiceOut(BaseModel):
    id: int
    title: str
    slug: str
    short_description: str
    long_description: str
    sub_services: List[Any]
    sort_order: int
    active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ServiceCreate(BaseModel):
    title: str
    short_description: str
    long_description: str
    sub_services: List[Any] = []
    sort_order: int = 0
    active: bool = True


class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    short_description: Optional[str] = None
    long_description: Optional[str] = None
    sub_services: Optional[List[Any]] = None
    sort_order: Optional[int] = None
    active: Optional[bool] = None


# --- Testimonial ---
class TestimonialOut(BaseModel):
    id: int
    client_name: str
    job_type: str
    quote: str
    visible: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class TestimonialCreate(BaseModel):
    client_name: str
    job_type: str
    quote: str
    visible: bool = True


class TestimonialUpdate(BaseModel):
    client_name: Optional[str] = None
    job_type: Optional[str] = None
    quote: Optional[str] = None
    visible: Optional[bool] = None


# --- Portfolio ---
class PortfolioOut(BaseModel):
    id: int
    title: str
    description: str
    category: str
    images: List[Any]
    visible: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class PortfolioCreate(BaseModel):
    title: str
    description: str
    category: str
    images: List[Any] = []
    visible: bool = True


class PortfolioUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    images: Optional[List[Any]] = None
    visible: Optional[bool] = None


# --- Contact ---
class ContactOut(BaseModel):
    id: int
    channel: str
    user_agent: Optional[str] = None
    ip: Optional[str] = None
    read: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ContactCreate(BaseModel):
    channel: str


# --- Auth ---
class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
