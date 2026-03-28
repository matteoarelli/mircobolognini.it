"""
Seed del database con dati iniziali per mircobolognini.it.
Eseguire con: python -m app.seed
"""

from app.auth import hash_password
from app.database import SessionLocal, engine
from app.models import Base, Service, Setting, SiteContent, Testimonial, User


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # ------------------------------------------------------------------
    # Utente admin
    # ------------------------------------------------------------------
    if not db.query(User).filter(User.username == "admin").first():
        db.add(
            User(
                username="admin",
                password_hash=hash_password("MircoBolognini2026!"),
            )
        )

    # ------------------------------------------------------------------
    # Servizi
    # ------------------------------------------------------------------
    services = [
        {
            "title": "Progettazione Architettonica",
            "slug": "progettazione-architettonica",
            "short_description": "Progettiamo edifici residenziali e commerciali partendo dalle tue esigenze, unendo estetica, funzionalità e rispetto delle normative.",
            "long_description": "Il servizio di progettazione architettonica comprende l'intero iter progettuale: dall'analisi del contesto e delle esigenze del committente fino alla redazione degli elaborati esecutivi. Ogni progetto nasce dall'ascolto attento del cliente e dalla conoscenza approfondita del territorio marchigiano, per creare spazi che siano belli, funzionali e conformi a tutte le normative vigenti.",
            "sub_services": [
                "Progettazione di nuove costruzioni",
                "Ampliamenti e sopraelevazioni",
                "Progettazione di interni",
                "Render e modellazione 3D",
                "Computi metrici estimativi",
            ],
            "sort_order": 1,
        },
        {
            "title": "Ristrutturazioni",
            "slug": "ristrutturazioni",
            "short_description": "Gestiamo la ristrutturazione completa del tuo immobile, dal progetto alla direzione lavori, con attenzione ai tempi e al budget.",
            "long_description": "Le ristrutturazioni richiedono competenza tecnica e capacità organizzativa. Mi occupo di tutto il processo: rilievo dello stato di fatto, progetto di intervento, pratiche edilizie, direzione lavori e coordinamento delle maestranze. Che si tratti di un appartamento, una villa o un locale commerciale, l'obiettivo è trasformare lo spazio esistente valorizzandone il potenziale.",
            "sub_services": [
                "Ristrutturazione completa di appartamenti",
                "Ristrutturazione di ville e villette",
                "Ristrutturazione di locali commerciali",
                "Direzione lavori e contabilità",
                "Coordinamento della sicurezza",
            ],
            "sort_order": 2,
        },
        {
            "title": "Interior Design",
            "slug": "interior-design",
            "short_description": "Creiamo ambienti su misura che riflettono la tua personalità, curando materiali, arredi, illuminazione e ogni dettaglio.",
            "long_description": "L'interior design è l'arte di dare personalità agli spazi. Attraverso la scelta accurata di materiali, colori, arredi e illuminazione, trasformo gli ambienti in luoghi che raccontano chi li abita. Ogni progetto di interni è pensato su misura, con un approccio che integra estetica e praticità per ottenere risultati armonici e funzionali.",
            "sub_services": [
                "Progettazione di interni residenziali",
                "Progettazione di interni commerciali",
                "Consulenza arredi e materiali",
                "Progettazione illuminotecnica",
                "Home staging",
            ],
            "sort_order": 3,
        },
        {
            "title": "Pratiche Edilizie",
            "slug": "pratiche-edilizie",
            "short_description": "Ci occupiamo di tutta la burocrazia edilizia: permessi, SCIA, CILA, sanatorie, condoni e pratiche catastali.",
            "long_description": "La gestione delle pratiche edilizie è un aspetto fondamentale di ogni intervento edilizio. Mi occupo della predisposizione e presentazione di tutte le pratiche necessarie presso i Comuni e gli enti competenti: CILA, SCIA, Permessi di Costruire, sanatorie, condoni, agibilità, pratiche catastali e molto altro. Un servizio puntuale che ti libera dalla complessità burocratica.",
            "sub_services": [
                "CILA e SCIA",
                "Permesso di Costruire",
                "Sanatorie e condoni",
                "Certificati di agibilità",
                "Pratiche catastali (DOCFA, PREGEO)",
                "Accesso agli atti",
            ],
            "sort_order": 4,
        },
        {
            "title": "Certificazioni Energetiche",
            "slug": "certificazioni-energetiche",
            "short_description": "Rilasciamo APE (Attestato di Prestazione Energetica) e consulenze per il miglioramento dell'efficienza energetica.",
            "long_description": "L'Attestato di Prestazione Energetica (APE) è obbligatorio per vendite, affitti e ristrutturazioni importanti. Oltre alla redazione dell'APE, offro consulenza completa sull'efficienza energetica dell'edificio, con proposte concrete di intervento per ridurre i consumi e migliorare la classe energetica, anche in ottica di accesso agli incentivi fiscali vigenti.",
            "sub_services": [
                "Redazione APE",
                "Diagnosi energetica",
                "Consulenza Superbonus e bonus edilizi",
                "Progettazione interventi di efficientamento",
                "Pratiche ENEA",
            ],
            "sort_order": 5,
        },
        {
            "title": "Assistenza Fornitori e Artigiani",
            "slug": "assistenza-fornitori-e-artigiani",
            "short_description": "Ti affianchiamo nella scelta dei fornitori e degli artigiani migliori, garantendo qualità, affidabilità e il rispetto del budget.",
            "long_description": "Scegliere i fornitori e gli artigiani giusti può fare la differenza tra un lavoro riuscito e uno deludente. Grazie alla rete di collaborazioni consolidate nel territorio, ti accompagno nella selezione dei professionisti più adatti al tuo progetto, monitorando la qualità delle lavorazioni e il rispetto dei tempi e dei costi concordati.",
            "sub_services": [
                "Selezione fornitori e artigiani",
                "Richiesta e confronto preventivi",
                "Supervisione qualità lavorazioni",
                "Gestione tempistiche di cantiere",
                "Assistenza post-lavori",
            ],
            "sort_order": 6,
        },
    ]

    if db.query(Service).count() == 0:
        for s in services:
            db.add(Service(**s))

    # ------------------------------------------------------------------
    # Testimonianze (recensioni reali da Google)
    # ------------------------------------------------------------------
    testimonials = [
        {
            "client_name": "Matteo Arelli",
            "job_type": "Ristrutturazione",
            "quote": "Mirco è un professionista serio e competente. Ha seguito la ristrutturazione del mio appartamento con grande attenzione ai dettagli e rispetto dei tempi. Consigliatissimo!",
        },
        {
            "client_name": "Marco Paolinelli",
            "job_type": "Progettazione",
            "quote": "Ottimo architetto, disponibile e preciso. Ha saputo interpretare perfettamente le nostre esigenze e tradurle in un progetto che ha superato le aspettative.",
        },
        {
            "client_name": "È Green Mobility",
            "job_type": "Pratica edilizia",
            "quote": "Collaborazione eccellente per le pratiche edilizie del nostro punto vendita. Professionalità, rapidità e grande conoscenza della normativa. Molto soddisfatti.",
        },
        {
            "client_name": "Estella Polonara",
            "job_type": "Interior Design",
            "quote": "Mirco ha curato il design degli interni della nostra casa con gusto e creatività. Ogni ambiente è stato pensato nei minimi dettagli. Risultato fantastico!",
        },
        {
            "client_name": "Federico - Giungi Guitars",
            "job_type": "Ristrutturazione locale commerciale",
            "quote": "Ha seguito la ristrutturazione del mio laboratorio con passione e competenza. Ha capito subito le esigenze di uno spazio di lavoro artigianale. Grazie Mirco!",
        },
        {
            "client_name": "Nicola Sanna",
            "job_type": "Ristrutturazione",
            "quote": "Professionista affidabile e preparato. La ristrutturazione del nostro bagno e della cucina è stata gestita in modo impeccabile, senza intoppi.",
        },
        {
            "client_name": "Cristina Ricciotti",
            "job_type": "Certificazione energetica",
            "quote": "Mi sono affidata a Mirco per l'APE del mio appartamento. Veloce, preciso e molto chiaro nelle spiegazioni. Lo raccomando a tutti.",
        },
        {
            "client_name": "Daniele Cellini",
            "job_type": "Progettazione e ristrutturazione",
            "quote": "Mirco ha progettato e seguito i lavori di ristrutturazione della nostra casa. Sempre presente in cantiere, attento alla qualità e ai costi. Un vero professionista.",
        },
        {
            "client_name": "Arianna",
            "job_type": "Ristrutturazione appartamento",
            "quote": "Esperienza molto positiva. Mirco è stato disponibile e paziente nel seguire ogni fase dei lavori, consigliandoci sempre la soluzione migliore.",
        },
        {
            "client_name": "Federica Dubbini",
            "job_type": "Pratica edilizia",
            "quote": "Ci ha aiutato con una pratica complessa di sanatoria. Competente, puntuale e sempre reperibile. Non potevamo chiedere di meglio.",
        },
        {
            "client_name": "Davide Ferrara",
            "job_type": "Progettazione",
            "quote": "Architetto giovane ma con grande esperienza. Il progetto della nostra villa è stato curato in ogni aspetto, dall'estetica alla funzionalità.",
        },
        {
            "client_name": "Marco Marzioni",
            "job_type": "Direzione lavori",
            "quote": "Mirco ha diretto i lavori della nostra ristrutturazione con serietà e competenza. Sempre puntuale negli aggiornamenti e attento al rispetto del budget.",
        },
        {
            "client_name": "King Edward Pub Ancona",
            "job_type": "Ristrutturazione locale commerciale",
            "quote": "Ha curato il restyling del nostro pub con creatività e rispetto dell'identità del locale. Il risultato è stato apprezzato da tutti i nostri clienti. Top!",
        },
    ]

    if db.query(Testimonial).count() == 0:
        for t in testimonials:
            db.add(Testimonial(**t))

    # ------------------------------------------------------------------
    # Contenuti del sito
    # ------------------------------------------------------------------
    contents = [
        # Hero
        {"section": "hero", "key": "subtitle", "value": "Studio di Architettura"},
        {
            "section": "hero",
            "key": "tagline",
            "value": "Trasformo visioni in spazi che ispirano",
        },
        {"section": "hero", "key": "cta", "value": "Scopri i servizi"},
        # About
        {"section": "about", "key": "title", "value": "Chi Sono"},
        {
            "section": "about",
            "key": "text",
            "value": (
                "Sono Mirco Bolognini, architetto con studio ad Ancona. "
                "Da anni mi occupo di progettazione architettonica, ristrutturazioni "
                "e interior design nel territorio marchigiano. Il mio approccio unisce "
                "creatività e rigore tecnico, con l'obiettivo di trasformare le idee "
                "dei miei clienti in spazi concreti, funzionali e di qualità. "
                "Ogni progetto è un percorso condiviso, dalla prima consulenza "
                "fino alla consegna delle chiavi."
            ),
        },
        # CTA
        {
            "section": "cta",
            "key": "title",
            "value": "Hai un progetto in mente?",
        },
        {
            "section": "cta",
            "key": "subtitle",
            "value": "Contattami per una consulenza senza impegno",
        },
    ]

    if db.query(SiteContent).count() == 0:
        for c in contents:
            db.add(SiteContent(**c))

    # ------------------------------------------------------------------
    # Impostazioni
    # ------------------------------------------------------------------
    if not db.query(Setting).get("portfolio_visible"):
        db.add(Setting(key="portfolio_visible", value="false"))

    db.commit()
    db.close()
    print("Seed completato con successo!")


if __name__ == "__main__":
    seed()
