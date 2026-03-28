import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Service } from "@/types";
import { defaultServices } from "@/lib/data";
import { ServiceReveal, BreadcrumbReveal, ServiceNumber } from "./ServiceDetailClient";

const BACKEND_URL = process.env.BACKEND_URL || "http://204.168.153.43:8444";

// Mappa la risposta API (snake_case) nel tipo Service (camelCase)
function mapService(s: Record<string, unknown>): Service {
  return {
    id: s.id as number,
    title: s.title as string,
    slug: s.slug as string,
    shortDescription: (s.short_description || s.shortDescription) as string,
    longDescription: (s.long_description || s.longDescription) as string,
    subServices: (s.sub_services || s.subServices || []) as string[],
    sortOrder: (s.sort_order ?? s.sortOrder) as number,
    active: s.active as boolean,
  };
}

// Recupera tutti i servizi dal backend con fallback statico
async function getAllServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/services`, { next: { revalidate: 60 } });
    if (!res.ok) return defaultServices;
    const raw = await res.json();
    return raw.map(mapService);
  } catch {
    return defaultServices;
  }
}

// Recupera un servizio singolo per slug
async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/services/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) {
      // Fallback ai dati statici
      return defaultServices.find((s) => s.slug === slug) || null;
    }
    const raw = await res.json();
    return mapService(raw);
  } catch {
    return defaultServices.find((s) => s.slug === slug) || null;
  }
}

// Genera i parametri statici per tutte le pagine servizio
export async function generateStaticParams() {
  const services = await getAllServices();
  return services
    .filter((s) => s.active)
    .map((s) => ({ slug: s.slug }));
}

// Genera metadata SEO dinamici per ogni servizio
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return { title: "Servizio non trovato | Mirco Bolognini Architetto" };
  }

  return {
    title: `${service.title} | Mirco Bolognini Architetto`,
    description: service.shortDescription,
    openGraph: {
      title: `${service.title} | Mirco Bolognini Architetto`,
      description: service.shortDescription,
      type: "website",
    },
  };
}

// Traccia il click sul canale di contatto (componente client inline non serve, usiamo link diretti)
export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [service, allServices] = await Promise.all([
    getServiceBySlug(slug),
    getAllServices(),
  ]);

  if (!service) {
    notFound();
  }

  // Filtra solo servizi attivi e ordina per sortOrder
  const activeServices = allServices
    .filter((s) => s.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Trova indice del servizio corrente per navigazione prev/next
  const currentIndex = activeServices.findIndex((s) => s.slug === service.slug);
  const prevService = currentIndex > 0 ? activeServices[currentIndex - 1] : null;
  const nextService = currentIndex < activeServices.length - 1 ? activeServices[currentIndex + 1] : null;

  // Numero decorativo
  const serviceNumber = `0${service.sortOrder}`;

  // Paragrafi della descrizione lunga
  const paragraphs = service.longDescription.split("\n\n").filter(Boolean);

  // Schema.org JSON-LD
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.shortDescription,
    provider: {
      "@type": "Architect",
      name: "Mirco Bolognini",
      url: "https://mircobolognini.it",
      telephone: "+393392556785",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Via Ascoli Piceno, 99",
        addressLocality: "Ancona",
        postalCode: "60126",
        addressRegion: "AN",
        addressCountry: "IT",
      },
    },
    areaServed: {
      "@type": "City",
      name: "Ancona",
    },
  };

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      <main className="max-w-4xl mx-auto px-6 py-32">
        <div className="relative">
          {/* Numero decorativo */}
          <ServiceNumber number={serviceNumber} />

          {/* Breadcrumb */}
          <BreadcrumbReveal>
            <ol className="flex items-center gap-2 text-sm text-text-muted">
              <li>
                <Link href="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/#servizi" className="hover:text-accent transition-colors">
                  Servizi
                </Link>
              </li>
              <li>/</li>
              <li className="text-text-secondary">{service.title}</li>
            </ol>
          </BreadcrumbReveal>

          {/* Contenuto principale */}
          <ServiceReveal>
            {/* Titolo */}
            <h1 className="font-heading text-4xl md:text-5xl text-text-primary">
              {service.title}
            </h1>
            <div className="w-10 h-[2px] bg-accent mt-4" />

            {/* Descrizione lunga */}
            <div className="mt-8 space-y-4">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-text-secondary leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            {/* Lista sotto-servizi */}
            {service.subServices.length > 0 && (
              <div className="mt-8">
                <ul className="space-y-3">
                  {service.subServices.map((sub, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                      <span className="text-text-secondary">{sub}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="mt-16">
              <h2 className="font-heading text-2xl text-text-primary">
                Interessato a questo servizio?
              </h2>
              <div className="flex flex-wrap gap-4 mt-6">
                {/* Chiama */}
                <a
                  href="tel:+393392556785"
                  className="flex items-center gap-2 border border-accent text-accent px-6 py-3 rounded hover:bg-accent hover:text-bg-primary transition-all duration-300"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Chiama
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/393392556785"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-whatsapp text-white px-6 py-3 rounded hover:bg-whatsapp/80 transition-all duration-300"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </ServiceReveal>

          {/* Navigazione prev/next */}
          <div className="mt-16 border-t border-border pt-8 flex justify-between">
            {prevService ? (
              <Link
                href={`/servizi/${prevService.slug}`}
                className="group text-left"
              >
                <span className="text-text-muted text-sm group-hover:text-accent transition-colors">
                  &larr; Servizio precedente
                </span>
                <span className="block text-text-secondary group-hover:text-text-primary transition-colors mt-1">
                  {prevService.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextService ? (
              <Link
                href={`/servizi/${nextService.slug}`}
                className="group text-right"
              >
                <span className="text-text-muted text-sm group-hover:text-accent transition-colors">
                  Servizio successivo &rarr;
                </span>
                <span className="block text-text-secondary group-hover:text-text-primary transition-colors mt-1">
                  {nextService.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
