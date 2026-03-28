"use client";

import ScrollReveal from "./ScrollReveal";

// Traccia il click sul canale di contatto (fire and forget)
function trackContact(channel: "call" | "whatsapp" | "email") {
  fetch("/api/proxy/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channel }),
  }).catch(() => {});
}

interface ContactSectionProps {
  content: {
    title: string;
    subtitle: string;
  };
}

// Sezione contatti con CTA prominente e pulsanti azione
export default function ContactSection({ content }: ContactSectionProps) {
  return (
    <section id="contatti" className="py-24 sm:py-32 md:py-40 px-6 text-center relative">
      {/* Separatore superiore */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60px] h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <ScrollReveal>
        {/* Titolo — dimensioni generose */}
        <h2 className="font-heading text-[clamp(2.5rem,6vw,4.5rem)] text-text-primary leading-[1.1] tracking-[-0.02em]">
          {content.title}
        </h2>

        {/* Sottotitolo */}
        <p className="text-text-secondary text-base md:text-lg mt-6 max-w-lg mx-auto leading-relaxed">
          {content.subtitle}
        </p>

        {/* Pulsanti CTA */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mt-14">
          {/* Chiama */}
          <a
            href="tel:+393392556785"
            onClick={() => trackContact("call")}
            className="btn-gold flex items-center justify-center gap-2.5 border border-accent text-accent px-7 py-3.5 text-sm tracking-[0.1em] uppercase hover:bg-accent hover:text-bg-primary transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          >
            <svg
              width="16"
              height="16"
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
            onClick={() => trackContact("whatsapp")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 bg-whatsapp text-white px-7 py-3.5 text-sm tracking-[0.1em] uppercase hover:bg-whatsapp/80 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>

          {/* Email */}
          <a
            href="mailto:info@mircobolognini.it"
            onClick={() => trackContact("email")}
            className="flex items-center justify-center gap-2.5 border border-border text-text-secondary px-7 py-3.5 text-sm tracking-[0.1em] uppercase hover:border-accent hover:text-accent transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            Email
          </a>
        </div>

        {/* Indirizzo e orari */}
        <div className="mt-16 space-y-3">
          <div className="w-6 h-[1px] bg-accent/30 mx-auto" />
          <div className="text-text-muted text-xs tracking-wide space-y-1.5">
            <p>Via Ascoli Piceno, 99, 60126 Ancona AN</p>
            <p>Lun-Ven 09-13 / 15-19 | Sab 10-12:30</p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
