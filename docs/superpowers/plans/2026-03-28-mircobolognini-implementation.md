# mircobolognini.it Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a professional architect website for Mirco Bolognini with dark/gold elegant theme, FastAPI backend on Hetzner, Next.js frontend on Vercel, and mobile-first admin panel.

**Architecture:** Same proven architecture as paolopincini.it — FastAPI + SQLAlchemy + MariaDB backend, Next.js 15+ App Router frontend with API proxy, JWT auth. Completely different design: dark theme (#1A1A1A) with gold accents (#C9A96E), Playfair Display + DM Sans fonts, split-screen hero, expandable service list, single-testimonial crossfade, full-width CTA.

**Tech Stack:** Next.js 15+ (App Router), Tailwind CSS 4, Framer Motion, FastAPI, SQLAlchemy, PyMySQL, python-jose, passlib+bcrypt

---

## File Structure

### Backend (`backend/`)

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI app setup, CORS, router mounting
│   ├── config.py         # Pydantic Settings from .env
│   ├── database.py       # SQLAlchemy engine, session, Base
│   ├── models.py         # ORM models: SiteContent, Service, Testimonial, PortfolioProject, Contact, User, Setting
│   ├── schemas.py        # Pydantic request/response schemas
│   ├── auth.py           # JWT token creation/validation, password hashing
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── public.py     # Public API endpoints
│   │   └── admin.py      # Admin CRUD + auth endpoints
│   └── seed.py           # Database seeding with initial data
├── requirements.txt
├── Dockerfile
├── .env.example
└── .env                  # (gitignored)
```

### Frontend (`frontend/`)

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, fonts, metadata, Schema.org
│   │   ├── page.tsx                # Homepage (Server Component, ISR)
│   │   ├── globals.css             # Tailwind 4 @theme + custom animations
│   │   ├── icon.tsx                # Dynamic favicon "MB"
│   │   ├── not-found.tsx           # Custom 404
│   │   ├── api/proxy/[...path]/route.ts  # HTTPS→HTTP proxy
│   │   ├── servizi/[slug]/
│   │   │   ├── page.tsx            # Service detail (Server Component)
│   │   │   └── ServiceDetailClient.tsx  # Client animations
│   │   └── admin/
│   │       ├── layout.tsx          # Admin layout with sidebar + auth guard
│   │       ├── page.tsx            # Dashboard
│   │       ├── login/
│   │       │   ├── page.tsx        # Login form
│   │       │   └── layout.tsx      # Empty layout (no sidebar)
│   │       ├── testi/page.tsx      # Hero/About content editor
│   │       ├── servizi/page.tsx    # Services CRUD
│   │       ├── testimonianze/page.tsx  # Testimonials CRUD
│   │       ├── portfolio/page.tsx  # Portfolio CRUD
│   │       └── contatti/page.tsx   # Contact log viewer
│   ├── components/
│   │   ├── Navbar.tsx              # Fixed navbar with scroll detection
│   │   ├── HeroSection.tsx         # Split-screen hero
│   │   ├── ServicesSection.tsx     # Expandable numbered list
│   │   ├── AboutSection.tsx        # Asymmetric bio layout
│   │   ├── TestimonialsSection.tsx # Single-quote crossfade
│   │   ├── ContactSection.tsx      # Full-width CTA statement
│   │   ├── Footer.tsx              # Minimal footer
│   │   ├── ScrollReveal.tsx        # Scroll-triggered animation wrapper
│   │   └── ProgressBar.tsx         # Top loading progress bar
│   ├── lib/
│   │   ├── api.ts                  # Client API with JWT management
│   │   └── data.ts                 # Static fallback data
│   └── types/
│       └── index.ts                # TypeScript interfaces
├── package.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
└── .env.local                      # (gitignored)
```

---

### Task 1: Backend — Config, Database, Models

**Files:**
- Create: `backend/app/__init__.py`
- Create: `backend/app/config.py`
- Create: `backend/app/database.py`
- Create: `backend/app/models.py`
- Create: `backend/requirements.txt`
- Create: `backend/.env.example`
- Create: `backend/Dockerfile`

- [ ] **Step 1: Create requirements.txt**

```
fastapi==0.115.0
uvicorn[standard]==0.30.0
sqlalchemy==2.0.35
pymysql==1.1.1
cryptography==43.0.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
bcrypt==4.0.1
python-dotenv==1.0.1
pydantic-settings==2.5.0
```

- [ ] **Step 2: Create .env.example**

```
DATABASE_URL=mysql+pymysql://root:password@mariadb:3306/mircobolognini
JWT_SECRET=change-me-to-a-random-string
```

- [ ] **Step 3: Create `backend/app/__init__.py`** (empty file)

- [ ] **Step 4: Create `backend/app/config.py`**

```python
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Configurazione dell'applicazione caricata da .env"""

    DATABASE_URL: str
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    model_config = {"env_file": ".env"}


settings = Settings()
```

- [ ] **Step 5: Create `backend/app/database.py`**

```python
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    """Dependency per ottenere una sessione database"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

- [ ] **Step 6: Create `backend/app/models.py`**

```python
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SiteContent(Base):
    """Contenuti testuali del sito raggruppati per sezione"""

    __tablename__ = "site_content"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    section: Mapped[str] = mapped_column(String(50), nullable=False)
    key: Mapped[str] = mapped_column(String(100), nullable=False)
    value: Mapped[str] = mapped_column(Text, nullable=False)


class Service(Base):
    """Servizi offerti dal professionista"""

    __tablename__ = "services"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    short_description: Mapped[str] = mapped_column(Text, nullable=False)
    long_description: Mapped[str] = mapped_column(Text, nullable=False)
    sub_services: Mapped[list] = mapped_column(JSON, default=list)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )


class Testimonial(Base):
    """Testimonianze dei clienti"""

    __tablename__ = "testimonials"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    client_name: Mapped[str] = mapped_column(String(200), nullable=False)
    job_type: Mapped[str] = mapped_column(String(200), nullable=False)
    quote: Mapped[str] = mapped_column(Text, nullable=False)
    visible: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )


class PortfolioProject(Base):
    """Progetti nel portfolio"""

    __tablename__ = "portfolio_projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    images: Mapped[list] = mapped_column(JSON, default=list)
    visible: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )


class Contact(Base):
    """Registrazione contatti ricevuti"""

    __tablename__ = "contacts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    channel: Mapped[str] = mapped_column(String(20), nullable=False)
    user_agent: Mapped[str | None] = mapped_column(String(500), nullable=True)
    ip: Mapped[str | None] = mapped_column(String(50), nullable=True)
    read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )


class User(Base):
    """Utenti admin"""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(200), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )


class Setting(Base):
    """Impostazioni chiave-valore"""

    __tablename__ = "settings"

    key: Mapped[str] = mapped_column(String(100), primary_key=True)
    value: Mapped[str] = mapped_column(String(500), nullable=False)
```

- [ ] **Step 7: Create Dockerfile**

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app/ ./app/
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

- [ ] **Step 8: Commit**

```bash
git add backend/
git commit -m "feat: backend config, database, and ORM models"
```

---

### Task 2: Backend — Auth, Schemas, Routers

**Files:**
- Create: `backend/app/auth.py`
- Create: `backend/app/schemas.py`
- Create: `backend/app/routers/__init__.py`
- Create: `backend/app/routers/public.py`
- Create: `backend/app/routers/admin.py`
- Create: `backend/app/main.py`

- [ ] **Step 1: Create `backend/app/auth.py`**

```python
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()


def hash_password(password: str) -> str:
    """Genera l'hash bcrypt della password"""
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    """Verifica la password in chiaro contro l'hash"""
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict) -> str:
    """Crea un JWT access token con scadenza breve"""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(data: dict) -> str:
    """Crea un JWT refresh token con scadenza lunga"""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """Dependency per ottenere l'utente corrente dal token JWT"""
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token non valido o scaduto",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
        username: str | None = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user
```

- [ ] **Step 2: Create `backend/app/schemas.py`**

```python
from datetime import datetime

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
    sub_services: list[str] = []
    sort_order: int = 0
    active: bool = True
    created_at: datetime | None = None

    model_config = {"from_attributes": True}


class ServiceCreate(BaseModel):
    title: str
    short_description: str
    long_description: str
    sub_services: list[str] = []
    sort_order: int = 0
    active: bool = True


class ServiceUpdate(BaseModel):
    title: str | None = None
    short_description: str | None = None
    long_description: str | None = None
    sub_services: list[str] | None = None
    sort_order: int | None = None
    active: bool | None = None


# --- Testimonial ---

class TestimonialOut(BaseModel):
    id: int
    client_name: str
    job_type: str
    quote: str
    visible: bool = True
    created_at: datetime | None = None

    model_config = {"from_attributes": True}


class TestimonialCreate(BaseModel):
    client_name: str
    job_type: str
    quote: str
    visible: bool = True


class TestimonialUpdate(BaseModel):
    client_name: str | None = None
    job_type: str | None = None
    quote: str | None = None
    visible: bool | None = None


# --- Portfolio ---

class PortfolioOut(BaseModel):
    id: int
    title: str
    description: str
    category: str
    images: list[str] = []
    visible: bool = True
    created_at: datetime | None = None

    model_config = {"from_attributes": True}


class PortfolioCreate(BaseModel):
    title: str
    description: str
    category: str
    images: list[str] = []
    visible: bool = True


class PortfolioUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category: str | None = None
    images: list[str] | None = None
    visible: bool | None = None


# --- Contact ---

class ContactOut(BaseModel):
    id: int
    channel: str
    user_agent: str | None = None
    ip: str | None = None
    read: bool = False
    created_at: datetime | None = None

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
```

- [ ] **Step 3: Create `backend/app/routers/__init__.py`** (empty file)

- [ ] **Step 4: Create `backend/app/routers/public.py`**

```python
from collections import defaultdict

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Contact, PortfolioProject, Service, Setting, SiteContent, Testimonial
from app.schemas import ContactCreate, PortfolioOut, ServiceOut, TestimonialOut

router = APIRouter(prefix="/api", tags=["public"])


@router.get("/content")
async def get_content(db: Session = Depends(get_db)) -> dict:
    """Restituisce tutti i contenuti del sito raggruppati per sezione"""
    rows = db.query(SiteContent).all()
    result: dict[str, dict[str, str]] = defaultdict(dict)
    for row in rows:
        result[row.section][row.key] = row.value
    return dict(result)


@router.get("/services", response_model=list[ServiceOut])
async def get_services(db: Session = Depends(get_db)) -> list[Service]:
    """Restituisce i servizi attivi ordinati per sort_order"""
    return (
        db.query(Service)
        .filter(Service.active == True)
        .order_by(Service.sort_order)
        .all()
    )


@router.get("/services/{slug}", response_model=ServiceOut)
async def get_service(slug: str, db: Session = Depends(get_db)) -> Service:
    """Restituisce un singolo servizio per slug"""
    service = db.query(Service).filter(Service.slug == slug).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Servizio non trovato",
        )
    return service


@router.get("/testimonials", response_model=list[TestimonialOut])
async def get_testimonials(db: Session = Depends(get_db)) -> list[Testimonial]:
    """Restituisce le testimonianze visibili ordinate per data"""
    return (
        db.query(Testimonial)
        .filter(Testimonial.visible == True)
        .order_by(Testimonial.created_at.desc())
        .all()
    )


@router.get("/portfolio", response_model=list[PortfolioOut])
async def get_portfolio(db: Session = Depends(get_db)) -> list[PortfolioProject]:
    """Restituisce i progetti portfolio se la visibilità è attiva"""
    setting = db.query(Setting).filter(Setting.key == "portfolio_visible").first()
    if not setting or setting.value != "true":
        return []
    return (
        db.query(PortfolioProject)
        .filter(PortfolioProject.visible == True)
        .all()
    )


@router.post("/contact")
async def create_contact(
    data: ContactCreate,
    request: Request,
    db: Session = Depends(get_db),
) -> dict:
    """Registra un nuovo contatto con user_agent e IP"""
    contact = Contact(
        channel=data.channel,
        user_agent=request.headers.get("user-agent"),
        ip=request.client.host if request.client else None,
    )
    db.add(contact)
    db.commit()
    return {"ok": True}
```

- [ ] **Step 5: Create `backend/app/routers/admin.py`**

```python
import re

from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.auth import (
    create_access_token,
    create_refresh_token,
    get_current_user,
    verify_password,
)
from app.config import settings
from app.database import get_db
from app.models import (
    Contact,
    PortfolioProject,
    Service,
    Setting,
    SiteContent,
    Testimonial,
    User,
)
from app.schemas import (
    ContactOut,
    LoginRequest,
    PortfolioCreate,
    PortfolioOut,
    PortfolioUpdate,
    ServiceCreate,
    ServiceOut,
    ServiceUpdate,
    TestimonialCreate,
    TestimonialOut,
    TestimonialUpdate,
    TokenResponse,
)

router = APIRouter(tags=["admin"])


def _slugify(text: str) -> str:
    """Genera uno slug URL-friendly dal testo"""
    slug = text.lower().strip()
    slug = re.sub(r"[àáâãäå]", "a", slug)
    slug = re.sub(r"[èéêë]", "e", slug)
    slug = re.sub(r"[ìíîï]", "i", slug)
    slug = re.sub(r"[òóôõö]", "o", slug)
    slug = re.sub(r"[ùúûü]", "u", slug)
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"[\s_]+", "-", slug)
    slug = re.sub(r"-+", "-", slug)
    return slug.strip("-")


# --- Auth ---

@router.post("/api/auth/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: Session = Depends(get_db)) -> dict:
    """Autenticazione con username e password"""
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenziali non valide",
        )
    token_data = {"sub": user.username}
    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
        "token_type": "bearer",
    }


@router.post("/api/auth/refresh")
async def refresh_token(body: dict, db: Session = Depends(get_db)) -> dict:
    """Rinnova l'access token usando il refresh token"""
    token = body.get("refresh_token", "")
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token non valido",
            )
        username: str | None = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token non valido",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token non valido o scaduto",
        )

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Utente non trovato",
        )
    return {
        "access_token": create_access_token({"sub": user.username}),
        "token_type": "bearer",
    }


# --- Content ---

@router.get("/api/admin/content")
async def get_all_content(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> dict:
    """Restituisce tutti i contenuti raggruppati per sezione"""
    rows = db.query(SiteContent).all()
    result: dict[str, dict[str, str]] = {}
    for row in rows:
        if row.section not in result:
            result[row.section] = {}
        result[row.section][row.key] = row.value
    return result


@router.put("/api/admin/content/{section}")
async def update_content(
    section: str,
    data: dict,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> dict:
    """Aggiorna i contenuti di una sezione"""
    for key, value in data.items():
        row = (
            db.query(SiteContent)
            .filter(SiteContent.section == section, SiteContent.key == key)
            .first()
        )
        if row:
            row.value = str(value)
        else:
            db.add(SiteContent(section=section, key=key, value=str(value)))
    db.commit()
    return {"ok": True}


# --- Services ---

@router.get("/api/admin/services", response_model=list[ServiceOut])
async def get_all_services(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> list[Service]:
    """Restituisce tutti i servizi inclusi quelli inattivi"""
    return db.query(Service).order_by(Service.sort_order).all()


@router.post("/api/admin/services", response_model=ServiceOut, status_code=201)
async def create_service(
    data: ServiceCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> Service:
    """Crea un nuovo servizio con slug auto-generato"""
    service = Service(
        title=data.title,
        slug=_slugify(data.title),
        short_description=data.short_description,
        long_description=data.long_description,
        sub_services=data.sub_services,
        sort_order=data.sort_order,
        active=data.active,
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.put("/api/admin/services/{service_id}", response_model=ServiceOut)
async def update_service(
    service_id: int,
    data: ServiceUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> Service:
    """Aggiorna un servizio esistente"""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Servizio non trovato")
    update_data = data.model_dump(exclude_unset=True)
    if "title" in update_data:
        update_data["slug"] = _slugify(update_data["title"])
    for field, value in update_data.items():
        setattr(service, field, value)
    db.commit()
    db.refresh(service)
    return service


@router.delete("/api/admin/services/{service_id}")
async def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> dict:
    """Elimina un servizio"""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Servizio non trovato")
    db.delete(service)
    db.commit()
    return {"ok": True}


# --- Testimonials ---

@router.get("/api/admin/testimonials", response_model=list[TestimonialOut])
async def get_all_testimonials(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> list[Testimonial]:
    """Restituisce tutte le testimonianze"""
    return db.query(Testimonial).order_by(Testimonial.created_at.desc()).all()


@router.post("/api/admin/testimonials", response_model=TestimonialOut, status_code=201)
async def create_testimonial(
    data: TestimonialCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> Testimonial:
    """Crea una nuova testimonianza"""
    testimonial = Testimonial(**data.model_dump())
    db.add(testimonial)
    db.commit()
    db.refresh(testimonial)
    return testimonial


@router.put("/api/admin/testimonials/{testimonial_id}", response_model=TestimonialOut)
async def update_testimonial(
    testimonial_id: int,
    data: TestimonialUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> Testimonial:
    """Aggiorna una testimonianza"""
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonianza non trovata")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(testimonial, field, value)
    db.commit()
    db.refresh(testimonial)
    return testimonial


@router.delete("/api/admin/testimonials/{testimonial_id}")
async def delete_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> dict:
    """Elimina una testimonianza"""
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonianza non trovata")
    db.delete(testimonial)
    db.commit()
    return {"ok": True}


# --- Portfolio ---

@router.get("/api/admin/portfolio", response_model=list[PortfolioOut])
async def get_all_portfolio(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> list[PortfolioProject]:
    """Restituisce tutti i progetti portfolio"""
    return db.query(PortfolioProject).order_by(PortfolioProject.created_at.desc()).all()


@router.post("/api/admin/portfolio", response_model=PortfolioOut, status_code=201)
async def create_portfolio(
    data: PortfolioCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> PortfolioProject:
    """Crea un nuovo progetto portfolio"""
    project = PortfolioProject(**data.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.put("/api/admin/portfolio/{project_id}", response_model=PortfolioOut)
async def update_portfolio(
    project_id: int,
    data: PortfolioUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> PortfolioProject:
    """Aggiorna un progetto portfolio"""
    project = db.query(PortfolioProject).filter(PortfolioProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Progetto non trovato")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(project, field, value)
    db.commit()
    db.refresh(project)
    return project


@router.delete("/api/admin/portfolio/{project_id}")
async def delete_portfolio(
    project_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> dict:
    """Elimina un progetto portfolio"""
    project = db.query(PortfolioProject).filter(PortfolioProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Progetto non trovato")
    db.delete(project)
    db.commit()
    return {"ok": True}


# --- Contacts ---

@router.get("/api/admin/contacts", response_model=list[ContactOut])
async def get_contacts(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> list[Contact]:
    """Restituisce tutti i contatti ordinati per data"""
    return db.query(Contact).order_by(Contact.created_at.desc()).all()


@router.patch("/api/admin/contacts/{contact_id}")
async def toggle_contact_read(
    contact_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> dict:
    """Inverte lo stato di lettura di un contatto"""
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contatto non trovato")
    contact.read = not contact.read
    db.commit()
    return {"ok": True, "read": contact.read}


# --- Settings ---

@router.get("/api/admin/settings")
async def get_settings(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> dict:
    """Restituisce tutte le impostazioni come dizionario"""
    rows = db.query(Setting).all()
    return {row.key: row.value for row in rows}


@router.patch("/api/admin/settings")
async def update_settings(
    data: dict,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> dict:
    """Aggiorna le impostazioni"""
    for key, value in data.items():
        row = db.query(Setting).filter(Setting.key == key).first()
        if row:
            row.value = str(value)
        else:
            db.add(Setting(key=key, value=str(value)))
    db.commit()
    return {"ok": True}
```

- [ ] **Step 6: Create `backend/app/main.py`**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models
from app.database import engine
from app.routers import admin, public

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Mirco Bolognini API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(public.router)
app.include_router(admin.router)
```

- [ ] **Step 7: Commit**

```bash
git add backend/
git commit -m "feat: backend auth, schemas, routers, and main app"
```

---

### Task 3: Backend — Seed Script with Real Data

**Files:**
- Create: `backend/app/seed.py`

- [ ] **Step 1: Create `backend/app/seed.py`**

```python
"""
Script di seed per popolare il database con i dati iniziali.
Eseguire con: python -m app.seed
"""

from app.auth import hash_password
from app.database import SessionLocal
from app.models import Service, Setting, SiteContent, Testimonial, User


def seed() -> None:
    db = SessionLocal()
    try:
        # --- Utente admin ---
        if not db.query(User).filter(User.username == "admin").first():
            db.add(User(
                username="admin",
                password_hash=hash_password("MircoBolognini2026!"),
            ))
            print("Utente admin creato")

        # --- Servizi ---
        if db.query(Service).count() == 0:
            services = [
                Service(
                    title="Progettazione Architettonica",
                    slug="progettazione-architettonica",
                    short_description="Progettazione residenziale e commerciale a 360°, dal concept alla realizzazione completa del progetto.",
                    long_description="Offro un servizio completo di progettazione architettonica che parte dall'ascolto delle esigenze del cliente fino alla realizzazione finale del progetto. Mi occupo di progettazione residenziale e commerciale, curando ogni aspetto: dall'analisi del sito all'ideazione del concept, dalla stesura dei disegni esecutivi al coordinamento con le imprese. Ogni progetto è pensato per unire funzionalità, estetica e sostenibilità, creando spazi che riflettono la personalità di chi li abita.",
                    sub_services=["Progettazione residenziale", "Progettazione commerciale", "Concept e studi di fattibilità", "Disegni esecutivi", "Direzione artistica"],
                    sort_order=1,
                    active=True,
                ),
                Service(
                    title="Ristrutturazioni",
                    slug="ristrutturazioni",
                    short_description="Rinnovo e ammodernamento di spazi esistenti con soluzioni moderne e funzionali.",
                    long_description="Le ristrutturazioni rappresentano una delle attività principali del mio studio. Seguo il cliente dalla fase di progettazione alla consegna finale, occupandomi di tutti gli aspetti: rilievo dello stato di fatto, progetto di ristrutturazione, pratiche edilizie, direzione lavori e coordinamento delle maestranze. L'obiettivo è trasformare gli spazi esistenti in ambienti moderni, funzionali e su misura, rispettando tempi e budget concordati.",
                    sub_services=["Ristrutturazione completa", "Rinnovo ambienti", "Recupero edilizio", "Direzione lavori", "Coordinamento imprese"],
                    sort_order=2,
                    active=True,
                ),
                Service(
                    title="Interior Design",
                    slug="interior-design",
                    short_description="Progettazione di interni, scelta materiali, arredi e illuminazione per spazi su misura.",
                    long_description="L'interior design è l'arte di trasformare uno spazio in un ambiente che racconta chi lo vive. Mi occupo della progettazione completa degli interni: dalla scelta dei materiali e delle finiture alla selezione degli arredi e dell'illuminazione. Ogni progetto è un percorso creativo condiviso con il cliente, dove le idee prendono forma attraverso render fotorealistici e moodboard prima della realizzazione. Il risultato sono spazi armonici, funzionali e dal carattere unico.",
                    sub_services=["Progettazione interni", "Scelta materiali e finiture", "Selezione arredi", "Progetto illuminotecnico", "Render fotorealistici"],
                    sort_order=3,
                    active=True,
                ),
                Service(
                    title="Pratiche Edilizie",
                    slug="pratiche-edilizie",
                    short_description="Gestione completa della documentazione edilizia: CILA, SCIA, permessi e sanatorie.",
                    long_description="Mi occupo della gestione completa dell'iter burocratico edilizio, dalla consulenza iniziale alla presentazione delle pratiche presso gli enti competenti. Seguo ogni tipo di pratica: CILA per manutenzione straordinaria, SCIA per interventi più significativi, Permessi di Costruire per nuove edificazioni, sanatorie e accertamenti di conformità. Mi interfaccio direttamente con gli uffici tecnici comunali per garantire tempi rapidi e documentazione corretta, sollevando il cliente da ogni complessità burocratica.",
                    sub_services=["CILA", "SCIA", "Permesso di Costruire", "Sanatorie edilizie", "Agibilità e conformità"],
                    sort_order=4,
                    active=True,
                ),
                Service(
                    title="Certificazioni Energetiche",
                    slug="certificazioni-energetiche",
                    short_description="Attestati di Prestazione Energetica (APE) per compravendite, locazioni e ristrutturazioni.",
                    long_description="Sono certificatore energetico abilitato e redigo Attestati di Prestazione Energetica (APE) obbligatori per compravendite, locazioni e ristrutturazioni significative. L'APE classifica l'immobile in base al consumo energetico dalla classe A4 (più efficiente) alla classe G. Fornisco anche consulenza per il miglioramento della classe energetica dell'edificio, individuando gli interventi più efficaci in rapporto costo-beneficio per ottimizzare comfort e risparmio.",
                    sub_services=["APE per compravendita", "APE per locazione", "APE per ristrutturazione", "Consulenza efficientamento", "Diagnosi energetica"],
                    sort_order=5,
                    active=True,
                ),
                Service(
                    title="Assistenza Fornitori e Artigiani",
                    slug="assistenza-fornitori-artigiani",
                    short_description="Coordinamento e selezione di fornitori e artigiani qualificati della zona.",
                    long_description="Uno degli aspetti più apprezzati del mio servizio è l'assistenza nella selezione e nel coordinamento dei fornitori e artigiani. Grazie alla mia rete di collaboratori qualificati nella zona di Ancona e nelle Marche, posso guidare il cliente nella scelta delle migliori maestranze per ogni esigenza: dall'impresa edile all'elettricista, dall'idraulico al falegname. Mi occupo di richiedere preventivi, confrontare offerte e coordinare i tempi di intervento per garantire un risultato impeccabile.",
                    sub_services=["Selezione imprese edili", "Coordinamento artigiani", "Richiesta preventivi", "Confronto offerte", "Supervisione lavori"],
                    sort_order=6,
                    active=True,
                ),
            ]
            db.add_all(services)
            print("Servizi creati")

        # --- Testimonianze (recensioni Google reali) ---
        if db.query(Testimonial).count() == 0:
            testimonials = [
                Testimonial(
                    client_name="Matteo Arelli",
                    job_type="Progettazione a 360°",
                    quote="Ho avuto il piacere di collaborare con questo architetto e posso solo dire che l'esperienza è stata eccezionale. Si occupa di progettazione a 360 gradi, gestendo tutto con grande professionalità e attenzione al dettaglio.",
                    visible=True,
                ),
                Testimonial(
                    client_name="Marco Paolinelli",
                    job_type="Progettazione architettonica",
                    quote="L'architetto Mirco Bolognini è una vera e propria stella emergente nel mondo dell'architettura. Le sue creazioni sono un perfetto equilibrio tra forma e funzione.",
                    visible=True,
                ),
                Testimonial(
                    client_name="È Green Mobility",
                    job_type="Ristrutturazione",
                    quote="L'architetto Bolognini mi ha seguito per una ristrutturazione e sono estremamente soddisfatto del risultato. La sua capacità di ascoltare e interpretare le mie richieste è stata eccezionale. Il progetto è stato realizzato nei tempi previsti e con un occhio di riguardo per ogni dettaglio.",
                    visible=True,
                ),
                Testimonial(
                    client_name="Estella Polonara",
                    job_type="Progettazione e assistenza",
                    quote="L'Arch. Bolognini è un professionista serio ed affidabile. Si è dimostrato sempre disponibile e capace di soddisfare ogni esigenza, anche con tempi molto stretti. Ha un ottimo gusto ed è anche stato in grado di assistermi con i fornitori e artigiani della zona.",
                    visible=True,
                ),
                Testimonial(
                    client_name="Federico (Giungi Guitars)",
                    job_type="Pratiche edilizie",
                    quote="Ottima esperienza, professionalità e cortesia. Mi sono trovato molto bene con l'architetto Bolognini, il quale mi ha aiutato con i documenti per la casa!",
                    visible=True,
                ),
                Testimonial(
                    client_name="Nicola Sanna",
                    job_type="Progettazione",
                    quote="Eccellente professionista, sempre disponibile a soddisfare qualsiasi esigenza ed estremamente competente. Super puntuale sulla consegna di progetti e soprattutto persona veramente simpatica, giovane e creativa.",
                    visible=True,
                ),
                Testimonial(
                    client_name="Cristina Ricciotti",
                    job_type="Ristrutturazione",
                    quote="Consiglio a chi debba ristrutturare la propria abitazione l'Architetto Mirco Bolognini. Competente, rapido e preciso nella consegna dei progetti e sempre disponibile.",
                    visible=True,
                ),
                Testimonial(
                    client_name="Daniele Cellini",
                    job_type="Progettazione",
                    quote="Arch. Bolognini, che dire un professionista! A livello lavorativo è serio preciso e puntuale e con tante idee moderne e innovative; a livello umano è una bravissima persona super disponibile.",
                    visible=True,
                ),
                Testimonial(
                    client_name="Arianna",
                    job_type="Consulenza architettonica",
                    quote="Un giovane architetto competente e preciso nel suo lavoro. Lo consiglio a chi voglia affidarsi ad un vero e proprio professionista.",
                    visible=True,
                ),
                Testimonial(
                    client_name="Federica Dubbini",
                    job_type="Progettazione",
                    quote="L'Architetto Mirco Bolognini si è dimostrato un professionista serio affidabile paziente e soprattutto sa mantenere le promesse.",
                    visible=True,
                ),
                Testimonial(
                    client_name="Davide Ferrara",
                    job_type="Consulenza",
                    quote="Ottimo professionista, veloce ed affidabile, una garanzia affidarsi a lui, lo consiglio vivamente.",
                    visible=True,
                ),
                Testimonial(
                    client_name="Marco Marzioni",
                    job_type="Progettazione",
                    quote="Competente e professionale, ha sempre idee interessanti e realizzabili.",
                    visible=True,
                ),
                Testimonial(
                    client_name="King Edward Pub Ancona",
                    job_type="Progettazione commerciale",
                    quote="Professionale e preciso, consigliato!",
                    visible=True,
                ),
            ]
            db.add_all(testimonials)
            print("Testimonianze create")

        # --- Contenuti sito ---
        if db.query(SiteContent).count() == 0:
            contents = [
                SiteContent(section="hero", key="subtitle", value="Studio di Architettura"),
                SiteContent(section="hero", key="tagline", value="Trasformo visioni in spazi che ispirano"),
                SiteContent(section="hero", key="cta", value="Scopri i servizi"),
                SiteContent(section="about", key="title", value="Chi Sono"),
                SiteContent(section="about", key="text", value="Sono Mirco Bolognini, architetto con studio ad Ancona. Mi occupo di progettazione architettonica, ristrutturazioni, interior design e consulenza tecnica per privati e aziende.\n\nIl mio approccio unisce creatività e rigore tecnico: ogni progetto nasce dall'ascolto del cliente e si sviluppa con attenzione al dettaglio, rispetto dei tempi e cura per ogni aspetto, dalla prima idea alla consegna finale. Collaboro con una rete di fornitori e artigiani qualificati del territorio per garantire risultati di qualità."),
                SiteContent(section="cta", key="title", value="Hai un progetto in mente?"),
                SiteContent(section="cta", key="subtitle", value="Contattami per una consulenza senza impegno"),
            ]
            db.add_all(contents)
            print("Contenuti sito creati")

        # --- Impostazioni ---
        if not db.query(Setting).filter(Setting.key == "portfolio_visible").first():
            db.add(Setting(key="portfolio_visible", value="false"))
            print("Impostazioni create")

        db.commit()
        print("Seed completato con successo!")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
```

- [ ] **Step 2: Commit**

```bash
git add backend/app/seed.py
git commit -m "feat: database seed with Mirco's real testimonials and services"
```

---

### Task 4: Frontend — Project Setup and Base Configuration

**Files:**
- Create: `frontend/` (via npx create-next-app)
- Modify: `frontend/package.json` (add framer-motion)
- Create: `frontend/src/app/globals.css`
- Modify: `frontend/next.config.ts`
- Create: `frontend/postcss.config.mjs`

- [ ] **Step 1: Create Next.js project**

```bash
cd C:/Users/Matteo/Desktop/Progetti/conerogarage/mircobolognini.it
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --no-import-alias --yes
```

- [ ] **Step 2: Install framer-motion**

```bash
cd frontend && npm install framer-motion
```

- [ ] **Step 3: Create `frontend/src/app/globals.css`** — Full Tailwind 4 theme with dark/gold palette

Write the complete globals.css with `@import "tailwindcss"`, `@theme` block defining all custom colors (--color-bg-primary: #1A1A1A, --color-bg-secondary: #2C2C2C, --color-text-primary: #F5F0E8, --color-accent: #C9A96E, etc.), custom animations for split-screen hero opening, scale-on-scroll, mask reveal, progress bar, and crossfade. Include Playfair Display + DM Sans via @font-face or Google Fonts import.

- [ ] **Step 4: Update `frontend/next.config.ts`**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 5: Commit**

```bash
git add frontend/
git commit -m "feat: Next.js 15+ project setup with dark/gold theme"
```

---

### Task 5: Frontend — Types, API Client, Static Data

**Files:**
- Create: `frontend/src/types/index.ts`
- Create: `frontend/src/lib/api.ts`
- Create: `frontend/src/lib/data.ts`
- Create: `frontend/src/app/api/proxy/[...path]/route.ts`

- [ ] **Step 1: Create `frontend/src/types/index.ts`**

```typescript
export interface Service {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  subServices: string[];
  sortOrder: number;
  active: boolean;
}

export interface Testimonial {
  id: number;
  clientName: string;
  jobType: string;
  quote: string;
  visible: boolean;
}

export interface PortfolioProject {
  id: number;
  title: string;
  description: string;
  category: string;
  images: string[];
  visible: boolean;
}

export interface Contact {
  id: number;
  channel: "call" | "whatsapp" | "email";
  userAgent: string;
  ip: string;
  read: boolean;
  createdAt: string;
}

export interface SiteContent {
  hero: {
    subtitle: string;
    tagline: string;
    cta: string;
  };
  about: {
    title: string;
    text: string;
  };
  cta: {
    title: string;
    subtitle: string;
  };
}

export interface Settings {
  portfolioVisible: boolean;
}
```

- [ ] **Step 2: Create `frontend/src/lib/api.ts`**

Same pattern as paolopincini.it: API_URL = "/api/proxy", token management in localStorage, fetchPublic, fetchAdmin with auto-redirect on 401, login function.

- [ ] **Step 3: Create `frontend/src/lib/data.ts`**

Static fallback data with all 6 services (matching seed.py data), 13 testimonials, default hero/about/cta content, and contact info (phone: "339 255 6785", address: "Via Ascoli Piceno, 99, 60126 Ancona AN", whatsapp: "+393392556785").

- [ ] **Step 4: Create `frontend/src/app/api/proxy/[...path]/route.ts`**

Same HTTPS→HTTP proxy as paolopincini.it. Handles GET, POST, PUT, PATCH, DELETE. Uses `BACKEND_URL` env var.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/types/ frontend/src/lib/ frontend/src/app/api/
git commit -m "feat: TypeScript types, API client, static fallback data, proxy route"
```

---

### Task 6: Frontend — Homepage Components (Navbar, Hero, ScrollReveal, ProgressBar)

**Files:**
- Create: `frontend/src/components/Navbar.tsx`
- Create: `frontend/src/components/HeroSection.tsx`
- Create: `frontend/src/components/ScrollReveal.tsx`
- Create: `frontend/src/components/ProgressBar.tsx`

- [ ] **Step 1: Create `ScrollReveal.tsx`**

Framer Motion wrapper using `whileInView`. Props: children, className, delay. Uses `initial={{ opacity: 0, y: 30 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true, margin: "-50px" }}`. Animation: scale-on-scroll feel with 0.6s duration.

- [ ] **Step 2: Create `ProgressBar.tsx`**

Thin gold (#C9A96E) progress bar at the very top of the page. Tracks page load and shows for 1.5s, then slides out. Purely CSS animation on mount, no scroll tracking. This replaces paolopincini's overlay loader.

- [ ] **Step 3: Create `Navbar.tsx`**

Fixed navbar, transparent at top, becomes `bg-[#1A1A1A]/90 backdrop-blur-md` after 50px scroll. Left: "MB" monogram in gold + "Mirco Bolognini" text. Center: navigation links (Servizi, Chi Sono, Testimonianze, Contatti) using smooth scroll to section IDs. Right: "Contattami" button with gold border. Mobile: hamburger icon that opens fullscreen dark overlay with links. Uses `useState` for scroll detection and mobile menu state.

- [ ] **Step 4: Create `HeroSection.tsx`**

Split-screen hero (100vh). Left 50% (dark bg): subtitle "Studio di Architettura" in gold uppercase letterspacing, name "Mirco Bolognini" in Playfair Display large, tagline below, gold divider line, CTA button. Right 50%: Pexels architecture image via `next/image` fill. Animation: Framer Motion — both halves start centered (translateX) and animate to their final positions like doors opening (1.2s ease-out). Text staggers in after doors open. Mobile: stacked vertically, image 40vh on top, text below.

Uses Pexels image URL: `https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750` (modern architecture building).

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/
git commit -m "feat: navbar, hero split-screen, scroll reveal, progress bar components"
```

---

### Task 7: Frontend — Homepage Components (Services, About, Testimonials, Contact, Footer)

**Files:**
- Create: `frontend/src/components/ServicesSection.tsx`
- Create: `frontend/src/components/AboutSection.tsx`
- Create: `frontend/src/components/TestimonialsSection.tsx`
- Create: `frontend/src/components/ContactSection.tsx`
- Create: `frontend/src/components/Footer.tsx`

- [ ] **Step 1: Create `ServicesSection.tsx`**

Expandable numbered list. Props: `services: Service[]`. Renders section title "Servizi" with gold underline. Each service row: number (01-06) in gold Playfair Display, title in cream with letterspacing, arrow → in gold, separated by 1px line. Click/tap: row expands with Framer Motion `AnimatePresence` + `motion.div` (height auto, opacity) showing short_description in secondary text + "Approfondisci →" link to `/servizi/${slug}`. Only one expanded at a time. Scroll animation: rows stagger in with 100ms delay each using ScrollReveal.

- [ ] **Step 2: Create `AboutSection.tsx`**

Asymmetric layout. Props: `content: SiteContent['about']`. Left 60%: "Chi Sono" title in Playfair Display, bio text with line-height 1.8, text-secondary color. Right 40%: Pexels image with subtle gold border (1px) and 8px offset shadow. NO diamond clip-path (that's paolopincini). Image uses rounded corners and a soft gold glow on hover. Scroll animation: text reveals with mask from left, image scales from 0.9 to 1.

Pexels image: `https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg?auto=compress&cs=tinysrgb&w=800` (architecture workspace).

- [ ] **Step 3: Create `TestimonialsSection.tsx`**

Single large quote crossfade. Props: `testimonials: Testimonial[]`. Large decorative quotation mark (") in gold, opacity 0.2, font-size 120px, positioned top-left. Current quote centered in Playfair Display italic, clamp(1.1rem, 2vw, 1.4rem). Author name below in DM Sans, text-secondary. Auto-advances every 6 seconds. Transition: crossfade using Framer Motion AnimatePresence with opacity 0→1 (0.8s). Small dot indicators at bottom, active dot in gold. Clicking dots changes testimonial. State: `useState` for currentIndex, `useEffect` with setInterval for auto-advance.

- [ ] **Step 4: Create `ContactSection.tsx`**

Full-width statement. Props: `content: SiteContent['cta']`. Title "Hai un progetto in mente?" in Playfair Display, clamp(2rem, 4vw, 3.5rem). Subtitle below in text-secondary. 3 CTA buttons in a row: Chiama (phone icon, `tel:+393392556785`), WhatsApp (WA icon, green bg, `https://wa.me/393392556785`), Email (mail icon, `mailto:` or disabled if not set). Below: address + hours in text-muted small. Buttons have gold border, hover: gold bg with dark text. Each button click also POSTs to `/api/proxy/api/contact` to log the CTA click.

- [ ] **Step 5: Create `Footer.tsx`**

Dark footer (#111111). Three columns on desktop, stacked on mobile. Col 1: "MB" monogram + "Mirco Bolognini Architetto". Col 2: Quick links (Servizi, Chi Sono, Contatti). Col 3: address, phone, hours. Bottom: "© 2026 Mirco Bolognini Architetto" + P.IVA placeholder. Back-to-top button (appears after scrolling past hero).

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/
git commit -m "feat: services list, about, testimonials crossfade, contact CTA, footer"
```

---

### Task 8: Frontend — Homepage, Layout, Icon, 404

**Files:**
- Create: `frontend/src/app/layout.tsx`
- Create: `frontend/src/app/page.tsx`
- Create: `frontend/src/app/icon.tsx`
- Create: `frontend/src/app/not-found.tsx`

- [ ] **Step 1: Create `frontend/src/app/layout.tsx`**

Root layout with Playfair Display + DM Sans from `next/font/google`. Metadata: title "Mirco Bolognini | Architetto Ancona", description with SEO keywords. Schema.org JSON-LD for `LocalBusiness` (architect, address Via Ascoli Piceno 99, Ancona, phone). Set `className` with font CSS variables. Body with dark background.

- [ ] **Step 2: Create `frontend/src/app/page.tsx`**

Server Component. Fetches from backend with ISR (revalidate: 60): `/api/content`, `/api/services`, `/api/testimonials`. Maps snake_case to camelCase. Falls back to static data from `lib/data.ts`. Renders: ProgressBar, Navbar, HeroSection, ServicesSection, AboutSection, TestimonialsSection, ContactSection, Footer. Uses `BACKEND_URL` env var for server-side fetch (direct to backend, not through proxy).

- [ ] **Step 3: Create `frontend/src/app/icon.tsx`**

Dynamic favicon using `ImageResponse`. 32x32. Dark background (#1A1A1A), "MB" text in gold (#C9A96E), bold, centered.

- [ ] **Step 4: Create `frontend/src/app/not-found.tsx`**

Dark page with large "404" in Playfair Display, gold, semi-transparent. "Pagina non trovata" heading. "La pagina che cerchi non esiste o è stata spostata." Description. "Torna alla homepage" button with gold border.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/
git commit -m "feat: homepage with ISR, root layout with SEO, favicon, 404 page"
```

---

### Task 9: Frontend — Service Detail Pages

**Files:**
- Create: `frontend/src/app/servizi/[slug]/page.tsx`
- Create: `frontend/src/app/servizi/[slug]/ServiceDetailClient.tsx`

- [ ] **Step 1: Create `ServiceDetailClient.tsx`**

Client component with Framer Motion animations for the service detail page. Exports: `ServiceReveal` (scroll-triggered fade-in wrapper), `BreadcrumbReveal` (slide-in from left for breadcrumb), `ServiceNumber` (large decorative number that fades in).

- [ ] **Step 2: Create `page.tsx`**

Server Component. `generateStaticParams` fetches all service slugs. `generateMetadata` creates title/description from service data. Page fetches single service by slug, renders: breadcrumb (Home > Servizi > Title), large decorative number (01-06) in gold semi-transparent, title in Playfair Display, long description, sub-services as list with gold bullet points, CTA section "Interessato a questo servizio?" with contact buttons, navigation to prev/next service. Schema.org `Service` structured data.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/servizi/
git commit -m "feat: service detail pages with SEO, Schema.org, and navigation"
```

---

### Task 10: Frontend — Admin Panel

**Files:**
- Create: `frontend/src/app/admin/layout.tsx`
- Create: `frontend/src/app/admin/page.tsx`
- Create: `frontend/src/app/admin/login/layout.tsx`
- Create: `frontend/src/app/admin/login/page.tsx`
- Create: `frontend/src/app/admin/testi/page.tsx`
- Create: `frontend/src/app/admin/servizi/page.tsx`
- Create: `frontend/src/app/admin/testimonianze/page.tsx`
- Create: `frontend/src/app/admin/portfolio/page.tsx`
- Create: `frontend/src/app/admin/contatti/page.tsx`

- [ ] **Step 1: Create admin `layout.tsx`**

Dark theme admin layout. Sidebar on desktop (left, 240px) with navigation: Dashboard, Testi, Servizi, Testimonianze, Portfolio, Contatti. Logout button at bottom. Mobile: bottom navigation bar with icons. Auth guard: checks `isAuthenticated()` on mount, redirects to `/admin/login` if not. Shows unread contacts badge on Contatti link.

- [ ] **Step 2: Create admin login `layout.tsx`** (empty, bypasses sidebar)

```typescript
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 3: Create admin `login/page.tsx`**

Login form: username + password fields, "Accedi" button. Dark theme matching site. Uses `login()` from api.ts. Shows error on invalid credentials. Redirects to `/admin` on success. If already authenticated, redirect immediately.

- [ ] **Step 4: Create admin `page.tsx` (Dashboard)**

Dashboard with quick action cards: Testi, Servizi, Testimonianze, Portfolio, Contatti. Each card shows count (fetched via fetchAdmin). Contatti card shows unread count with gold badge. Cards are clickable, navigate to respective section.

- [ ] **Step 5: Create admin `testi/page.tsx`**

Content editor for Hero section (subtitle, tagline, CTA text) and About section (title, bio text) and CTA section (title, subtitle). Fetches current content via `fetchAdmin('/api/admin/content')`. Save button per section calls `PUT /api/admin/content/{section}`. Toast notification on save. Uses textarea for long text, input for short text.

- [ ] **Step 6: Create admin `servizi/page.tsx`**

Services CRUD. List all services with sort order, active/inactive toggle. Add new service form (title, short desc, long desc, sub-services comma-separated). Edit inline. Delete with confirmation. Reorder with up/down buttons (calls PUT to update sort_order). Active toggle calls PUT to update.

- [ ] **Step 7: Create admin `testimonianze/page.tsx`**

Testimonials CRUD. List all testimonials. Toggle visibility per testimonial. Add/edit form (client_name, job_type, quote). Delete with confirmation.

- [ ] **Step 8: Create admin `portfolio/page.tsx`**

Portfolio CRUD with global visibility toggle at top ("Portfolio visibile sul sito: ON/OFF" using settings endpoint). CRUD for projects (title, description, category, images as comma-separated URLs). Visible/hidden per project.

- [ ] **Step 9: Create admin `contatti/page.tsx`**

Contact log viewer. Lists all CTA clicks (channel icon, timestamp, relative date, user agent excerpt). Unread highlighted with gold left border. Click to toggle read status. Filter: All / Non letti.

- [ ] **Step 10: Commit**

```bash
git add frontend/src/app/admin/
git commit -m "feat: complete mobile-first admin panel with CRUD for all entities"
```

---

### Task 11: Deploy Backend to Hetzner

**Files:**
- Modify: `/opt/services/docker-compose.yml` (on server)
- Modify: `/opt/services/caddy/Caddyfile` (on server)
- Create: `/opt/services/mircobolognini/` (on server)

- [ ] **Step 1: Get MariaDB root password from server**

```bash
ssh -i "C:/Users/Matteo/Desktop/Progetti/Hetzner Server/hetzner_production" -o StrictHostKeyChecking=no root@204.168.153.43 'grep MYSQL_ROOT_PASSWORD /opt/services/.env'
```

- [ ] **Step 2: Create database on MariaDB**

```bash
ssh -i "C:/Users/Matteo/Desktop/Progetti/Hetzner Server/hetzner_production" -o StrictHostKeyChecking=no root@204.168.153.43 'docker exec mariadb mysql -uroot -p<PASSWORD> -e "CREATE DATABASE IF NOT EXISTS mircobolognini CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"'
```

- [ ] **Step 3: Initialize git repo and push to GitHub**

```bash
cd C:/Users/Matteo/Desktop/Progetti/conerogarage/mircobolognini.it
git init
git add .
git commit -m "feat: initial project setup"
# Create GitHub repo and push
```

- [ ] **Step 4: Copy backend files to server**

```bash
ssh -i "C:/Users/Matteo/Desktop/Progetti/Hetzner Server/hetzner_production" -o StrictHostKeyChecking=no root@204.168.153.43 'mkdir -p /opt/services/mircobolognini'
# SCP or git clone backend on server
```

- [ ] **Step 5: Create .env on server**

```bash
ssh -i "..." root@204.168.153.43 'cat > /opt/services/mircobolognini/.env << EOF
DATABASE_URL=mysql+pymysql://root:<PASSWORD>@mariadb:3306/mircobolognini
JWT_SECRET=<GENERATE_RANDOM_64_CHAR_SECRET>
EOF'
```

- [ ] **Step 6: Add mircobolognini-api service to docker-compose.yml**

Add under services:
```yaml
  mircobolognini-api:
    build: ./mircobolognini
    container_name: mircobolognini-api
    restart: unless-stopped
    env_file: ./mircobolognini/.env
    networks:
      - web
      - internal
    depends_on:
      - mariadb
```

- [ ] **Step 7: Add Caddy reverse proxy entry**

Add to Caddyfile a port (e.g. `:8444`) that reverse proxies to `mircobolognini-api:8000`. Also add port `8444` to caddy container ports in docker-compose.yml.

- [ ] **Step 8: Build, start, and seed**

```bash
ssh -i "..." root@204.168.153.43 'cd /opt/services && docker compose up -d --build mircobolognini-api && docker compose exec mircobolognini-api python -m app.seed'
```

- [ ] **Step 9: Verify API is working**

```bash
curl http://204.168.153.43:8444/api/services
```

- [ ] **Step 10: Commit any docker-compose/Caddy changes**

---

### Task 12: Deploy Frontend to Vercel

**Files:**
- Modify: `frontend/.env.local` (for local dev)

- [ ] **Step 1: Set environment variable on Vercel**

```bash
cd frontend
npx vercel env add BACKEND_URL production
# Value: http://204.168.153.43:8444
```

- [ ] **Step 2: Deploy to Vercel**

```bash
cd frontend && npx vercel --prod --yes
```

- [ ] **Step 3: Verify deployment**

Open the Vercel URL and verify:
- Homepage loads with all sections
- Services list works
- Testimonials rotate
- CTA buttons work (Chiama, WhatsApp)
- Admin login works at /admin/login
- Service detail pages load at /servizi/[slug]

- [ ] **Step 4: Commit deploy config**

---

### Task 13: Aesthetic Refinement — 5 Rounds

Each round: analyze the deployed site critically, compare with inspiration sites, improve, redeploy.

- [ ] **Round 1: Typography & Spacing**
- Check font sizes across all breakpoints
- Verify Playfair Display renders correctly for headings
- Adjust line-heights, letter-spacing, margins
- Ensure consistent spacing scale

- [ ] **Round 2: Animations & Transitions**
- Verify split-screen hero opening animation feels smooth
- Check scroll reveal timing and easing curves
- Test testimonial crossfade timing
- Verify service list expand/collapse is smooth
- Test progress bar load animation

- [ ] **Round 3: Color & Contrast**
- Verify gold (#C9A96E) contrast against dark backgrounds
- Check text readability (cream on dark)
- Verify hover states are visible but subtle
- Test CTA button visibility and appeal

- [ ] **Round 4: Mobile & Responsive**
- Test all breakpoints (320px, 375px, 768px, 1024px, 1440px)
- Verify hero stacks correctly on mobile
- Check admin panel is usable on phone
- Test touch targets (min 44px)
- Verify navbar hamburger menu works

- [ ] **Round 5: Final Polish**
- Compare with awwwards inspiration sites
- Add any missing microinteractions
- Verify all animations respect prefers-reduced-motion
- Performance: check Lighthouse score
- Verify all links work (tel, whatsapp, email, navigation)

- [ ] **Redeploy after each round**

```bash
cd frontend && npx vercel --prod --yes
```

---

### Task 14: End-to-End Verification

- [ ] **Step 1: Test admin login**

Navigate to /admin/login, login with admin/MircoBolognini2026!

- [ ] **Step 2: Modify content from admin**

Change hero tagline from admin panel, wait 60s, verify it appears on the public site.

- [ ] **Step 3: Test all CTA buttons**

Click Chiama, WhatsApp, Email. Verify contacts appear in admin panel.

- [ ] **Step 4: Test service pages**

Navigate to each /servizi/[slug] page, verify content and SEO meta tags.

- [ ] **Step 5: Test 404 page**

Navigate to /nonexistent, verify custom 404 renders.

- [ ] **Step 6: Test mobile**

Use Chrome DevTools device emulator for iPhone SE, iPhone 14, iPad.

- [ ] **Step 7: Final sign-off**

Verify the site looks WOW — at least as good as paolopincini.it but with completely different aesthetic.
