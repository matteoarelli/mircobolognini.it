"use client";

import ScrollReveal from "./ScrollReveal";

interface AboutSectionProps {
  content: {
    title: string;
    text: string;
  };
}

// Sezione chi sono con layout asimmetrico testo + immagine
export default function AboutSection({ content }: AboutSectionProps) {
  const paragraphs = content.text.split("\n\n");

  return (
    <section id="chi-sono" className="py-24 sm:py-32 md:py-40 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 md:gap-20">
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
        </ScrollReveal>

        {/* Colonna destra — immagine (40%) */}
        <ScrollReveal className="md:w-[40%]" delay={0.15}>
          <div className="group relative">
            <img
              src="https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Studio di architettura"
              className="w-full border border-accent/20 transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(201,169,110,0.12)] group-hover:border-accent/40"
            />
            {/* Cornice decorativa dorata offset */}
            <div className="absolute -bottom-3 -right-3 w-full h-full border border-accent/15 -z-10 transition-all duration-500 group-hover:border-accent/25" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
