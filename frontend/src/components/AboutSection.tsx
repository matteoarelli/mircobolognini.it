"use client";

import ScrollReveal from "./ScrollReveal";

interface AboutSectionProps {
  content: {
    title: string;
    text: string;
  };
}

// Statistiche per credibilita
const stats = [
  { value: "25+", label: "Anni di esperienza" },
  { value: "500+", label: "Progetti completati" },
  { value: "4.9", label: "Valutazione Google" },
];

// Sezione chi sono con layout asimmetrico testo + immagine
export default function AboutSection({ content }: AboutSectionProps) {
  const paragraphs = content.text.split("\n\n");

  return (
    <section id="chi-sono" className="py-24 sm:py-32 md:py-40 px-6 relative overflow-hidden">
      {/* Pattern griglia architetturale sullo sfondo */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,169,110,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,169,110,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 md:gap-20 relative z-10">
        {/* Colonna sinistra — testo (60%) */}
        <ScrollReveal className="md:w-[60%]">
          <h2 className="font-heading text-[clamp(2rem,4vw,3rem)] text-text-primary leading-[1.15] tracking-[-0.01em] mb-3">
            {content.title}
          </h2>
          <div className="w-12 h-[1px] bg-accent mb-10" />
          <div className="space-y-5">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-text-secondary leading-[1.8] text-[15px]">
                {p}
              </p>
            ))}
          </div>

          {/* Riga statistiche per credibilita */}
          <div className="grid grid-cols-3 gap-6 mt-14 pt-10 border-t border-accent/10">
            {stats.map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <span className="block font-heading text-[clamp(2rem,4vw,3rem)] text-accent leading-none tracking-tight">
                  {stat.value}
                </span>
                <span className="block text-text-muted text-xs uppercase tracking-[0.15em] mt-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Colonna destra — immagine (40%) con clip-path */}
        <ScrollReveal className="md:w-[40%]" delay={0.15}>
          <div className="group relative">
            <div className="overflow-hidden" style={{ clipPath: "polygon(0 0, 100% 0, 100% 92%, 8% 100%)" }}>
              <img
                src="https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Studio di architettura"
                className="w-full transition-all duration-700 group-hover:scale-105"
              />
            </div>
            {/* Cornice decorativa dorata offset */}
            <div
              className="absolute -bottom-4 -right-4 w-full h-full border border-accent/15 -z-10 transition-all duration-500 group-hover:border-accent/30"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 92%, 8% 100%)" }}
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
