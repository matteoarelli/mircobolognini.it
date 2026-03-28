import re
import unicodedata

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


# ---------------------------------------------------------------------------
# Helper: genera slug da titolo italiano
# ---------------------------------------------------------------------------
def _slugify(text: str) -> str:
    """Converte un testo in slug URL-safe, gestendo accenti italiani."""
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------
@router.post("/api/auth/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    """Autenticazione utente, restituisce access e refresh token."""
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenziali non valide",
        )
    return TokenResponse(
        access_token=create_access_token(user.username),
        refresh_token=create_refresh_token(user.username),
    )


@router.post("/api/auth/refresh", response_model=TokenResponse)
def refresh_token(token: str, db: Session = Depends(get_db)):
    """Rinnova l'access token tramite refresh token."""
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
        username: str = payload.get("sub")
        token_type: str = payload.get("type")
        if username is None or token_type != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token non valido",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token non valido",
        )

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Utente non trovato",
        )

    return TokenResponse(
        access_token=create_access_token(user.username),
        refresh_token=create_refresh_token(user.username),
    )


# ---------------------------------------------------------------------------
# Content
# ---------------------------------------------------------------------------
@router.get("/api/admin/content")
def list_content(
    db: Session = Depends(get_db), _user: User = Depends(get_current_user)
):
    """Elenco completo dei contenuti del sito."""
    rows = db.query(SiteContent).all()
    from collections import defaultdict

    grouped: dict = defaultdict(dict)
    for row in rows:
        grouped[row.section][row.key] = {"id": row.id, "value": row.value}
    return grouped


@router.put("/api/admin/content/{section}")
def update_content(
    section: str,
    payload: dict,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    """Aggiorna i contenuti di una sezione specifica."""
    for key, value in payload.items():
        row = (
            db.query(SiteContent)
            .filter(SiteContent.section == section, SiteContent.key == key)
            .first()
        )
        if row:
            row.value = value
        else:
            db.add(SiteContent(section=section, key=key, value=value))
    db.commit()
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# Services
# ---------------------------------------------------------------------------
@router.get("/api/admin/services", response_model=list[ServiceOut])
def admin_list_services(
    db: Session = Depends(get_db), _user: User = Depends(get_current_user)
):
    """Elenco di tutti i servizi (anche inattivi)."""
    return db.query(Service).order_by(Service.sort_order).all()


@router.post(
    "/api/admin/services",
    response_model=ServiceOut,
    status_code=status.HTTP_201_CREATED,
)
def admin_create_service(
    data: ServiceCreate,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    """Crea un nuovo servizio con slug auto-generato."""
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
def admin_update_service(
    service_id: int,
    data: ServiceUpdate,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    """Aggiorna un servizio esistente."""
    service = db.query(Service).get(service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Servizio non trovato")
    update_data = data.model_dump(exclude_unset=True)
    if "title" in update_data:
        update_data["slug"] = _slugify(update_data["title"])
    for k, v in update_data.items():
        setattr(service, k, v)
    db.commit()
    db.refresh(service)
    return service


@router.delete("/api/admin/services/{service_id}")
def admin_delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    """Elimina un servizio."""
    service = db.query(Service).get(service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Servizio non trovato")
    db.delete(service)
    db.commit()
    return {"status": "deleted"}


# ---------------------------------------------------------------------------
# Testimonials
# ---------------------------------------------------------------------------
@router.get("/api/admin/testimonials", response_model=list[TestimonialOut])
def admin_list_testimonials(
    db: Session = Depends(get_db), _user: User = Depends(get_current_user)
):
    """Elenco di tutte le testimonianze."""
    return db.query(Testimonial).order_by(Testimonial.created_at.desc()).all()


@router.post(
    "/api/admin/testimonials",
    response_model=TestimonialOut,
    status_code=status.HTTP_201_CREATED,
)
def admin_create_testimonial(
    data: TestimonialCreate,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    """Crea una nuova testimonianza."""
    testimonial = Testimonial(**data.model_dump())
    db.add(testimonial)
    db.commit()
    db.refresh(testimonial)
    return testimonial


@router.put("/api/admin/testimonials/{testimonial_id}", response_model=TestimonialOut)
def admin_update_testimonial(
    testimonial_id: int,
    data: TestimonialUpdate,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    """Aggiorna una testimonianza esistente."""
    testimonial = db.query(Testimonial).get(testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonianza non trovata")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(testimonial, k, v)
    db.commit()
    db.refresh(testimonial)
    return testimonial


@router.delete("/api/admin/testimonials/{testimonial_id}")
def admin_delete_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    """Elimina una testimonianza."""
    testimonial = db.query(Testimonial).get(testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonianza non trovata")
    db.delete(testimonial)
    db.commit()
    return {"status": "deleted"}


# ---------------------------------------------------------------------------
# Portfolio
# ---------------------------------------------------------------------------
@router.get("/api/admin/portfolio", response_model=list[PortfolioOut])
def admin_list_portfolio(
    db: Session = Depends(get_db), _user: User = Depends(get_current_user)
):
    """Elenco di tutti i progetti portfolio."""
    return (
        db.query(PortfolioProject)
        .order_by(PortfolioProject.created_at.desc())
        .all()
    )


@router.post(
    "/api/admin/portfolio",
    response_model=PortfolioOut,
    status_code=status.HTTP_201_CREATED,
)
def admin_create_portfolio(
    data: PortfolioCreate,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    """Crea un nuovo progetto portfolio."""
    project = PortfolioProject(**data.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.put("/api/admin/portfolio/{project_id}", response_model=PortfolioOut)
def admin_update_portfolio(
    project_id: int,
    data: PortfolioUpdate,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    """Aggiorna un progetto portfolio esistente."""
    project = db.query(PortfolioProject).get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Progetto non trovato")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(project, k, v)
    db.commit()
    db.refresh(project)
    return project


@router.delete("/api/admin/portfolio/{project_id}")
def admin_delete_portfolio(
    project_id: int,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    """Elimina un progetto portfolio."""
    project = db.query(PortfolioProject).get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Progetto non trovato")
    db.delete(project)
    db.commit()
    return {"status": "deleted"}


# ---------------------------------------------------------------------------
# Contacts
# ---------------------------------------------------------------------------
@router.get("/api/admin/contacts", response_model=list[ContactOut])
def admin_list_contacts(
    db: Session = Depends(get_db), _user: User = Depends(get_current_user)
):
    """Elenco di tutti i contatti ricevuti."""
    return db.query(Contact).order_by(Contact.created_at.desc()).all()


@router.patch("/api/admin/contacts/{contact_id}", response_model=ContactOut)
def admin_toggle_contact_read(
    contact_id: int,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    """Segna un contatto come letto/non letto (toggle)."""
    contact = db.query(Contact).get(contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contatto non trovato")
    contact.read = not contact.read
    db.commit()
    db.refresh(contact)
    return contact


# ---------------------------------------------------------------------------
# Settings
# ---------------------------------------------------------------------------
@router.get("/api/admin/settings")
def admin_get_settings(
    db: Session = Depends(get_db), _user: User = Depends(get_current_user)
):
    """Restituisce tutte le impostazioni come dizionario."""
    rows = db.query(Setting).all()
    return {row.key: row.value for row in rows}


@router.patch("/api/admin/settings")
def admin_update_settings(
    payload: dict,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    """Aggiorna le impostazioni (merge)."""
    for key, value in payload.items():
        row = db.query(Setting).get(key)
        if row:
            row.value = str(value)
        else:
            db.add(Setting(key=key, value=str(value)))
    db.commit()
    return {"status": "ok"}
