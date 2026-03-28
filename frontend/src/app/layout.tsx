import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Mirco Bolognini | Architetto Ancona",
  description:
    "Studio di architettura ad Ancona. Progettazione architettonica, ristrutturazioni, interior design, pratiche edilizie e certificazioni energetiche. Arch. Mirco Bolognini.",
  keywords: [
    "architetto ancona",
    "studio architettura ancona",
    "mirco bolognini",
    "progettazione architettonica",
    "ristrutturazioni ancona",
    "interior design ancona",
  ],
  openGraph: {
    title: "Mirco Bolognini | Architetto Ancona",
    description:
      "Studio di architettura ad Ancona. Progettazione, ristrutturazioni, interior design.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Architect",
              name: "Mirco Bolognini",
              jobTitle: "Architetto",
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
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                  ],
                  opens: "09:00",
                  closes: "13:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                  ],
                  opens: "15:00",
                  closes: "19:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Saturday",
                  opens: "10:00",
                  closes: "12:30",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="font-body bg-bg-primary text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
