import { Service, Testimonial, SiteContent } from "@/types";
import {
  defaultServices,
  defaultTestimonials,
  defaultContent,
} from "@/lib/data";
import ProgressBar from "@/components/ProgressBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CursorDot from "@/components/CursorDot";
import PageEntryAnimation from "@/components/PageEntryAnimation";

const BACKEND_URL = process.env.BACKEND_URL || "http://204.168.153.43:8444";

async function getData() {
  try {
    const [contentRes, servicesRes, testimonialsRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/content`, { next: { revalidate: 60 } }),
      fetch(`${BACKEND_URL}/api/services`, { next: { revalidate: 60 } }),
      fetch(`${BACKEND_URL}/api/testimonials`, { next: { revalidate: 60 } }),
    ]);

    const rawContent = contentRes.ok ? await contentRes.json() : null;
    const rawServices = servicesRes.ok ? await servicesRes.json() : null;
    const rawTestimonials = testimonialsRes.ok
      ? await testimonialsRes.json()
      : null;

    const content: SiteContent = rawContent
      ? {
          hero: {
            subtitle:
              rawContent.hero?.subtitle || defaultContent.hero.subtitle,
            tagline: rawContent.hero?.tagline || defaultContent.hero.tagline,
            cta: rawContent.hero?.cta || defaultContent.hero.cta,
          },
          about: {
            title: rawContent.about?.title || defaultContent.about.title,
            text: rawContent.about?.text || defaultContent.about.text,
          },
          cta: {
            title: rawContent.cta?.title || defaultContent.cta.title,
            subtitle:
              rawContent.cta?.subtitle || defaultContent.cta.subtitle,
          },
        }
      : defaultContent;

    const services: Service[] = rawServices
      ? rawServices.map((s: Record<string, unknown>) => ({
          id: s.id,
          title: s.title,
          slug: s.slug,
          shortDescription: s.short_description,
          longDescription: s.long_description,
          subServices: s.sub_services || [],
          sortOrder: s.sort_order,
          active: s.active,
        }))
      : defaultServices;

    const testimonials: Testimonial[] = rawTestimonials
      ? rawTestimonials.map((t: Record<string, unknown>) => ({
          id: t.id,
          clientName: t.client_name,
          jobType: t.job_type,
          quote: t.quote,
          visible: t.visible,
        }))
      : defaultTestimonials;

    return { content, services, testimonials };
  } catch {
    return {
      content: defaultContent,
      services: defaultServices,
      testimonials: defaultTestimonials,
    };
  }
}

export default async function HomePage() {
  const { content, services, testimonials } = await getData();

  return (
    <main>
      <ProgressBar />
      <CursorDot />
      <Navbar />
      <PageEntryAnimation>
        <HeroSection content={content.hero} />
        <ServicesSection services={services} />
        <AboutSection content={content.about} />
        <TestimonialsSection testimonials={testimonials} />
        <ContactSection content={content.cta} />
        <Footer />
      </PageEntryAnimation>
    </main>
  );
}
