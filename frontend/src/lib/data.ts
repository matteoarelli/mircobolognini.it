import type { Service, Testimonial, SiteContent } from "@/types";

// Servizi di fallback (corrispondono ai seed del backend)
export const defaultServices: Service[] = [
  {
    id: 1,
    title: "Progettazione Architettonica",
    slug: "progettazione-architettonica",
    shortDescription:
      "Progetti su misura per nuove costruzioni e ampliamenti, dalla villa al piccolo edificio residenziale.",
    longDescription:
      "La progettazione architettonica parte dall'ascolto: capire le esigenze del cliente, il contesto ambientale e normativo, e tradurre tutto in un progetto che unisca estetica, funzionalità e sostenibilità. Seguo ogni fase, dal concept iniziale fino alla consegna delle chiavi, garantendo un risultato che rispecchi la tua visione.",
    subServices: [
      "Progettazione nuove costruzioni",
      "Ampliamenti e sopraelevazioni",
      "Studi di fattibilità",
      "Rendering e modellazione 3D",
    ],
    sortOrder: 1,
    active: true,
  },
  {
    id: 2,
    title: "Ristrutturazioni",
    slug: "ristrutturazioni",
    shortDescription:
      "Ristrutturazioni complete di appartamenti e edifici, con gestione integrata del cantiere.",
    longDescription:
      "Ristrutturare significa dare nuova vita a uno spazio esistente. Mi occupo di ristrutturazioni complete — dall'analisi strutturale alla scelta dei materiali, dalla direzione lavori al collaudo — coordinando ogni professionista coinvolto per consegnare un risultato impeccabile nei tempi previsti.",
    subServices: [
      "Ristrutturazione completa appartamenti",
      "Ristrutturazione edifici storici",
      "Direzione lavori",
      "Computi metrici estimativi",
    ],
    sortOrder: 2,
    active: true,
  },
  {
    id: 3,
    title: "Interior Design",
    slug: "interior-design",
    shortDescription:
      "Progettazione d'interni che trasforma ambienti ordinari in spazi funzionali e di carattere.",
    longDescription:
      "L'interior design è l'arte di progettare spazi che raccontano chi li abita. Lavoro su layout, materiali, illuminazione e arredi per creare ambienti coerenti, confortevoli e con una forte identità. Ogni progetto è un percorso condiviso con il cliente, dal moodboard alla realizzazione finale.",
    subServices: [
      "Progettazione layout interni",
      "Consulenza materiali e finiture",
      "Progettazione illuminotecnica",
      "Home staging",
    ],
    sortOrder: 3,
    active: true,
  },
  {
    id: 4,
    title: "Pratiche Edilizie",
    slug: "pratiche-edilizie",
    shortDescription:
      "Gestione completa delle pratiche burocratiche: SCIA, CILA, permessi di costruire e sanatorie.",
    longDescription:
      "La burocrazia edilizia può essere un labirinto. Mi occupo di tutte le pratiche necessarie — CILA, SCIA, Permesso di Costruire, sanatorie, agibilità — interfacciandomi con gli uffici tecnici comunali e garantendo la conformità normativa di ogni intervento.",
    subServices: [
      "CILA e SCIA",
      "Permesso di Costruire",
      "Sanatorie edilizie",
      "Certificati di agibilità",
    ],
    sortOrder: 4,
    active: true,
  },
  {
    id: 5,
    title: "Certificazioni Energetiche",
    slug: "certificazioni-energetiche",
    shortDescription:
      "APE e diagnosi energetiche per compravendite, locazioni e riqualificazione degli edifici.",
    longDescription:
      "L'Attestato di Prestazione Energetica (APE) è obbligatorio per vendite e affitti. Eseguo diagnosi energetiche complete e rilascio certificazioni conformi alla normativa vigente, fornendo anche consulenza per interventi di miglioramento della classe energetica.",
    subServices: [
      "Attestato di Prestazione Energetica (APE)",
      "Diagnosi energetiche",
      "Consulenza riqualificazione energetica",
      "Pratiche Superbonus ed Ecobonus",
    ],
    sortOrder: 5,
    active: true,
  },
  {
    id: 6,
    title: "Assistenza Fornitori e Artigiani",
    slug: "assistenza-fornitori-artigiani",
    shortDescription:
      "Ti accompagno nella scelta di fornitori e artigiani qualificati, coordinando ogni fase della realizzazione.",
    longDescription:
      "Scegliere i professionisti giusti fa la differenza tra un buon progetto e un progetto eccellente. Grazie a una rete consolidata di fornitori e artigiani di fiducia, ti assisto nella selezione e nel coordinamento di tutte le figure coinvolte, assicurando qualità e rispetto dei tempi.",
    subServices: [
      "Selezione fornitori qualificati",
      "Coordinamento artigiani",
      "Supervisione qualità materiali",
      "Gestione preventivi e contratti",
    ],
    sortOrder: 6,
    active: true,
  },
];

// Testimonianze di fallback (recensioni Google reali)
export const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    clientName: "Matteo Arelli",
    jobType: "Ristrutturazione",
    quote:
      "Mirco ci ha seguito nella ristrutturazione del nostro appartamento con grande professionalità e disponibilità. Sempre presente in cantiere, attento ad ogni dettaglio e pronto a risolvere qualsiasi problema. Il risultato ha superato le nostre aspettative. Consigliatissimo!",
    visible: true,
  },
  {
    id: 2,
    clientName: "Marco Paolinelli",
    jobType: "Ristrutturazione",
    quote:
      "Abbiamo affidato a Mirco la ristrutturazione completa del nostro appartamento e siamo rimasti molto soddisfatti. Professionale, preciso e sempre disponibile. Ha saputo interpretare le nostre esigenze e trasformarle in realtà. Lo consiglio vivamente.",
    visible: true,
  },
  {
    id: 3,
    clientName: "È Green Mobility",
    jobType: "Progettazione",
    quote:
      "Ci siamo rivolti all'Arch. Bolognini per la progettazione del nostro nuovo showroom. Competenza, creatività e rispetto dei tempi. Un professionista serio e affidabile.",
    visible: true,
  },
  {
    id: 4,
    clientName: "Estella Polonara",
    jobType: "Interior Design",
    quote:
      "Mirco ha curato l'interior design del mio appartamento con gusto e sensibilità. Ha saputo ascoltare le mie idee e propormi soluzioni a cui non avrei mai pensato. Ogni stanza racconta qualcosa di me. Grazie!",
    visible: true,
  },
  {
    id: 5,
    clientName: "Federico - Giungi Guitars",
    jobType: "Ristrutturazione locale commerciale",
    quote:
      "Mirco ha seguito la ristrutturazione del mio laboratorio di liuteria. Un lavoro impeccabile: ha capito subito le esigenze acustiche e funzionali dello spazio e ha trovato soluzioni brillanti. Professionalità al top.",
    visible: true,
  },
  {
    id: 6,
    clientName: "Nicola Sanna",
    jobType: "Pratiche edilizie",
    quote:
      "Mi sono affidato a Mirco per una pratica edilizia complessa. Ha gestito tutto con competenza e rapidità, tenendomi sempre aggiornato. Un professionista preparato e disponibile.",
    visible: true,
  },
  {
    id: 7,
    clientName: "Cristina Ricciotti",
    jobType: "Ristrutturazione",
    quote:
      "Ristrutturazione completa del bagno e della cucina. Mirco è stato impeccabile nella gestione del cantiere e nella scelta dei materiali. Risultato eccellente e nei tempi previsti.",
    visible: true,
  },
  {
    id: 8,
    clientName: "Daniele Cellini",
    jobType: "Progettazione",
    quote:
      "Ho commissionato a Mirco il progetto per un ampliamento della mia casa. Professionale, creativo e sempre disponibile al confronto. Il progetto ha superato ogni aspettativa.",
    visible: true,
  },
  {
    id: 9,
    clientName: "Arianna",
    jobType: "Interior Design",
    quote:
      "Mirco ha trasformato il mio monolocale in uno spazio funzionale e bellissimo. Non pensavo fosse possibile ottenere così tanto da pochi metri quadri. Bravissimo!",
    visible: true,
  },
  {
    id: 10,
    clientName: "Federica Dubbini",
    jobType: "Certificazione energetica",
    quote:
      "Mi serviva un APE per la vendita del mio appartamento. Mirco è stato veloce, preciso e molto professionale. Consigliato per chi cerca serietà e competenza.",
    visible: true,
  },
  {
    id: 11,
    clientName: "Davide Ferrara",
    jobType: "Ristrutturazione",
    quote:
      "Mirco ha curato la ristrutturazione della nostra casa al mare. Nonostante la distanza, ha gestito tutto alla perfezione. Risultato fantastico, lo ricontatteremo sicuramente.",
    visible: true,
  },
  {
    id: 12,
    clientName: "Marco Marzioni",
    jobType: "Progettazione",
    quote:
      "Professionalità e competenza. Mirco ha progettato la nostra nuova casa seguendo ogni nostra richiesta con attenzione. Un architetto che sa ascoltare e proporre. Consigliatissimo.",
    visible: true,
  },
  {
    id: 13,
    clientName: "King Edward Pub Ancona",
    jobType: "Ristrutturazione locale commerciale",
    quote:
      "Mirco ha curato il restyling del nostro pub. Ha saputo mantenere l'identità del locale rinnovandolo completamente. Lavoro eccellente, clienti entusiasti del nuovo look!",
    visible: true,
  },
];

// Contenuti testuali di fallback
export const defaultContent: SiteContent = {
  hero: {
    subtitle: "Studio di Architettura",
    tagline: "Trasformo visioni in spazi che ispirano",
    cta: "Scopri i servizi",
  },
  about: {
    title: "Chi Sono",
    text: "Sono Mirco Bolognini, architetto con sede ad Ancona. Da anni mi occupo di progettazione architettonica, ristrutturazioni, interior design e pratiche edilizie, accompagnando privati e aziende in ogni fase del progetto. Il mio approccio combina ascolto, creatività e rigore tecnico per trasformare ogni spazio in un luogo che rispecchi chi lo vive.",
  },
  cta: {
    title: "Hai un progetto in mente?",
    subtitle: "Contattami per una consulenza senza impegno",
  },
};

// Informazioni di contatto
export const contactInfo = {
  phone: "339 255 6785",
  phoneFormatted: "+393392556785",
  whatsapp: "+393392556785",
  address: "Via Ascoli Piceno, 99, 60126 Ancona AN",
  hours: [
    { day: "Lunedì", time: "9:00 – 13:00, 15:00 – 19:00" },
    { day: "Martedì", time: "9:00 – 13:00, 15:00 – 19:00" },
    { day: "Mercoledì", time: "9:00 – 13:00, 15:00 – 19:00" },
    { day: "Giovedì", time: "9:00 – 13:00, 15:00 – 19:00" },
    { day: "Venerdì", time: "9:00 – 13:00, 15:00 – 19:00" },
    { day: "Sabato", time: "Su appuntamento" },
    { day: "Domenica", time: "Chiuso" },
  ],
};
