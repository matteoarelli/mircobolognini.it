import Link from "next/link";

// Pagina 404 personalizzata con tema scuro
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative">
      {/* Numero grande decorativo */}
      <span className="font-heading text-[clamp(8rem,20vw,14rem)] leading-none text-accent/[0.08] select-none">
        404
      </span>

      {/* Titolo */}
      <h1 className="font-heading text-[clamp(1.5rem,3vw,2.5rem)] text-text-primary -mt-6 tracking-[-0.01em]">
        Pagina non trovata
      </h1>

      {/* Linea dorata */}
      <div className="w-12 h-[1px] bg-accent/40 mt-6 mb-6" />

      {/* Descrizione */}
      <p className="text-text-secondary text-sm md:text-base max-w-md leading-relaxed">
        La pagina che stai cercando non esiste o è stata spostata.
      </p>

      {/* Pulsante ritorno */}
      <Link
        href="/"
        className="btn-gold mt-10 border border-accent text-accent px-8 sm:px-10 py-3.5 sm:py-4 text-sm tracking-[0.15em] uppercase hover:bg-accent hover:text-bg-primary transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
      >
        Torna alla homepage
      </Link>
    </div>
  );
}
