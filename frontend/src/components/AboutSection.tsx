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
    <section id="chi-sono" className="py-24 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 md:gap-16">
        {/* Colonna sinistra — testo (60%) */}
        <ScrollReveal className="md:w-[60%]">
          <h2 className="font-heading text-3xl text-text-primary mb-2">
            {content.title}
          </h2>
          <div className="w-10 h-[2px] bg-accent mb-8" />
          <div className="space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-text-secondary leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </ScrollReveal>

        {/* Colonna destra — immagine (40%) */}
        <ScrollReveal className="md:w-[40%]" delay={0.2}>
          <div className="group">
            <img
              src="https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Studio di architettura"
              className="w-full rounded-lg border border-accent/30 transition-shadow duration-500 group-hover:shadow-[0_0_30px_rgba(201,169,110,0.15)]"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
