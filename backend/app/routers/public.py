from collections import defaultdict

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Contact, PortfolioProject, Service, Setting, SiteContent, Testimonial
from app.schemas import ContactCreate, ContactOut, PortfolioOut, ServiceOut, TestimonialOut

router = APIRouter(prefix="/api", tags=["public"])


@router.get("/content")
def get_content(db: Session = Depends(get_db)):
    """Restituisce i contenuti del sito raggruppati per sezione."""
    rows = db.query(SiteContent).all()
    grouped: dict = defaultdict(dict)
    for row in rows:
        grouped[row.section][row.key] = row.value
    return grouped


@router.get("/services", response_model=list[ServiceOut])
def get_services(db: Session = Depends(get_db)):
    """Restituisce i servizi attivi ordinati per sort_order."""
    return (
        db.query(Service)
        .filter(Service.active.is_(True))
        .order_by(Service.sort_order)
        .all()
    )


@router.get("/services/{slug}", response_model=ServiceOut)
def get_service(slug: str, db: Session = Depends(get_db)):
    """Restituisce un singolo servizio tramite slug."""
    service = db.query(Service).filter(Service.slug == slug).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Servizio non trovato",
        )
    return service


@router.get("/testimonials", response_model=list[TestimonialOut])
def get_testimonials(db: Session = Depends(get_db)):
    """Restituisce le testimonianze visibili ordinate per data."""
    return (
        db.query(Testimonial)
        .filter(Testimonial.visible.is_(True))
        .order_by(Testimonial.created_at.desc())
        .all()
    )


@router.get("/portfolio", response_model=list[PortfolioOut])
def get_portfolio(db: Session = Depends(get_db)):
    """Restituisce i progetti portfolio se il setting e' attivo."""
    setting = db.query(Setting).filter(Setting.key == "portfolio_visible").first()
    if not setting or setting.value != "true":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio non disponibile",
        )
    return (
        db.query(PortfolioProject)
        .filter(PortfolioProject.visible.is_(True))
        .order_by(PortfolioProject.created_at.desc())
        .all()
    )


@router.post("/contact", response_model=ContactOut, status_code=status.HTTP_201_CREATED)
def create_contact(
    data: ContactCreate, request: Request, db: Session = Depends(get_db)
):
    """Registra un nuovo contatto con user_agent e IP."""
    contact = Contact(
        channel=data.channel,
        user_agent=request.headers.get("user-agent"),
        ip=request.client.host if request.client else None,
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact
