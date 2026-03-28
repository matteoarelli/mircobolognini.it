export interface Service {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  subServices: string[];
  sortOrder: number;
  active: boolean;
}

export interface Testimonial {
  id: number;
  clientName: string;
  jobType: string;
  quote: string;
  visible: boolean;
}

export interface PortfolioProject {
  id: number;
  title: string;
  description: string;
  category: string;
  images: string[];
  visible: boolean;
}

export interface Contact {
  id: number;
  channel: "call" | "whatsapp" | "email";
  userAgent: string;
  ip: string;
  read: boolean;
  createdAt: string;
}

export interface SiteContent {
  hero: {
    subtitle: string;
    tagline: string;
    cta: string;
  };
  about: {
    title: string;
    text: string;
  };
  cta: {
    title: string;
    subtitle: string;
  };
}

export interface Settings {
  portfolioVisible: boolean;
}
