import Link from "next/link";

// Pagina 404 personalizzata con tema scuro
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative">
      {/* Numero grande decorativo */}
      <span className="font-heading text-[120px] md:text-[180px] leading-none text-accent opacity-20 select-none">
        404
      </span>

      {/* Titolo */}
      <h1 className="font-heading text-2xl text-text-primary -mt-4">
        Pagina non trovata
      </h1>

      {/* Descrizione */}
      <p className="text-text-secondary mt-4 max-w-md">
        La pagina che stai cercando non esiste o è stata spostata.
      </p>

      {/* Pulsante ritorno */}
      <Link
        href="/"
        className="mt-8 border border-accent text-accent px-8 py-3 tracking-wide hover:bg-accent hover:text-bg-primary transition-all duration-300"
      >
        Torna alla homepage
      </Link>
    </div>
  );
}
