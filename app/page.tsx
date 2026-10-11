"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import gsap from "gsap";
import RouteModal, { type RouteData } from "@/components/RouteModal";

/* ================= CONFIG ================= */
// 👉 Cambia este número (código de país 51 + celular, sin + ni espacios)
const WHATSAPP_NUMBER = "51999999999";

const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const NAV_LINKS = [
  { label: "INICIO", href: "#inicio" },
  { label: "TOURS", href: "#tours" },
  { label: "GALERÍA", href: "#galeria" },
  { label: "CONTACTO", href: "#contacto" },
];

type Tour = {
  name: string;
  description: string;
  price: number;
  image: string;
  badge: string | null;
  route: RouteData | null;
};

// 👉 Cambia cada "image" por una foto distinta de cada tour
const TOURS: Tour[] = [
  {
    name: "TOUR SONDOR",
    description:
      "Recorre los paisajes por el contorno de la laguna de Pacucha con destino el centro arqueologico de Sondor y disfruta de una experiencia diferente sobre cuatro ruedas.",
    price: 80,
    image: "/images/tours/toursondor.png",
    badge: "MÁS POPULAR",
    route: {
      image: "/images/rutas/pacucha-sondor.png",
      width: 1117,
      height: 607,
      from: "Malecón de Pacucha",
      to: "Mirador de Sondor",
      // Puntos [x, y] sobre la captura (1117 x 607 px), de salida a llegada
      points: [
        [918, 517], [936, 470], [940, 410], [928, 350], [905, 305],
        [880, 265], [850, 232], [805, 205], [748, 180], [690, 190],
        [620, 184], [560, 180], [515, 195], [470, 178], [430, 200],
        [385, 205], [340, 175], [290, 148], [235, 140], [185, 150],
      ],
    },
  },
  {
    name: "RUTA ANDINA",
    description:
      "Aventúrate por caminos de montaña y descubre increíbles paisajes de los Andes de Apurímac.",
    price: 120,
    image: "/images/pacucha-hero.jpg",
    badge: null,
    route: null,
  },
  {
    name: "EXPERIENCIA AVENTURA",
    description:
      "Una experiencia pensada para quienes buscan caminos más exigentes, adrenalina y naturaleza.",
    price: 160,
    image: "/images/pacucha-hero.jpg",
    badge: null,
    route: null,
  },
];

// 👉 Agrega aquí las fotos de la galería
const GALLERY = [
  "/images/pacucha-hero.jpg",
  "/images/pacucha-hero.jpg",
  "/images/pacucha-hero.jpg",
  "/images/pacucha-hero.jpg",
  "/images/pacucha-hero.jpg",
  "/images/pacucha-hero.jpg",
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTour, setActiveTour] = useState<Tour | null>(null);
  const rootRef = useRef<HTMLElement>(null);

  // Al cargar o refrescar: siempre empieza arriba (sin saltar a #tours)
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
    window.scrollTo(0, 0);
  }, []);

  // Scroll suave a una sección SIN dejar el # en la URL
  const goTo = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    if (href === "#inicio") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline();

      timeline
        .fromTo(
          "#hero-background",
          { scale: 1.12 },
          { scale: 1, duration: 4, ease: "power2.out" }
        )
        .fromTo(
          "#hero-content",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
          0.2
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef} className="bg-black text-white">
      {/* ================= NAVBAR ================= */}
      <nav className="absolute left-0 top-0 z-50 w-full px-4 pt-4">
        <div className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-black/45 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            {/* LOGO + NOMBRE */}
            <a
              href="#inicio"
              onClick={(e) => goTo(e, "#inicio")}
              className="flex items-center gap-3"
            >
              <Image
                src="/images/logo.png"
                alt="Rutas de Pacucha 4Full"
                width={320}
                height={170}
                priority
                style={{ width: "auto" }}
                className="h-20 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] sm:h-24 md:h-28"
              />

              <div className="hidden leading-none sm:flex sm:flex-col">
                <span className="text-lg font-black uppercase tracking-[0.15em] text-white">
                  RUTAS DE
                </span>
                <span className="text-2xl font-black uppercase italic tracking-[0.12em] text-orange-500">
                  PACUCHA
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/80">
                  4FULL · AVENTURA
                </span>
              </div>
            </a>

            {/* MENÚ ESCRITORIO */}
            <div className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => goTo(e, link.href)}
                  className="text-sm font-bold tracking-wide text-white transition hover:text-orange-500"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* BOTÓN RESERVAR */}
              <a
                href={whatsappLink("Hola, quiero reservar un tour en cuatrimoto en Pacucha.")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-orange-500 px-4 py-2.5 text-xs font-black tracking-wide text-black shadow-lg transition duration-300 hover:scale-105 hover:bg-orange-400 sm:px-5 sm:py-3 sm:text-sm"
              >
                RESERVAR
              </a>

              {/* HAMBURGUESA (solo móvil) */}
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={menuOpen}
                className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-white/20 md:hidden"
              >
                <span
                  className={`h-0.5 w-5 bg-white transition ${
                    menuOpen ? "translate-y-2 rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-5 bg-white transition ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-5 bg-white transition ${
                    menuOpen ? "-translate-y-2 -rotate-45" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* MENÚ MÓVIL */}
          {menuOpen && (
            <div className="flex flex-col gap-1 border-t border-white/10 px-4 pb-4 pt-2 md:hidden">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => goTo(e, link.href)}
                  className="rounded-lg px-3 py-3 text-sm font-bold tracking-wide transition hover:bg-white/10 hover:text-orange-500"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section
        id="inicio"
        className="relative flex min-h-[100svh] items-center overflow-hidden"
      >
        {/* Fondo */}
        <div id="hero-background" className="absolute inset-0">
          <Image
            src="/images/pacucha-hero.jpg"
            alt="Laguna de Pacucha, Andahuaylas"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Oscurecimiento */}
        <div className="absolute inset-0 bg-black/55 md:bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        {/* Contenido */}
        <div
          id="hero-content"
          className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-36 md:px-8 md:pb-0 md:pt-44"
        >
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-bold tracking-[0.25em] text-orange-400 sm:text-sm sm:tracking-[0.35em]">
              PACUCHA · ANDAHUAYLAS · APURÍMAC
            </p>

            <h1 className="text-5xl font-black leading-none sm:text-6xl tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] md:text-8xl">
              VIVE LA
              <br />
              <span className="text-orange-500 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                AVENTURA
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-200 sm:text-lg md:mt-8">
              Descubre los paisajes de Pacucha sobre cuatro ruedas. Una
              experiencia de aventura entre montañas, caminos y naturaleza en
              el corazón de Apurímac.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={whatsappLink("Hola, quiero reservar un tour en cuatrimoto en Pacucha.")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-orange-500 px-8 py-4 font-bold text-black transition hover:scale-105 hover:bg-orange-400"
              >
                RESERVAR AHORA
              </a>

              <a
                href="#tours"
                onClick={(e) => goTo(e, "#tours")}
                className="rounded-full border border-white/40 px-8 py-4 font-bold backdrop-blur-sm transition hover:bg-white hover:text-black"
              >
                VER TOURS
              </a>
            </div>
          </div>
        </div>

      </section>

      {/* ================= TOURS ================= */}
      <section id="tours" className="scroll-mt-4 bg-zinc-950 px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-sm font-bold tracking-[0.3em] text-orange-500">
              DESCUBRE PACUCHA
            </p>

            <h2 className="text-3xl font-black sm:text-4xl md:text-6xl">
              ELIGE TU
              <span className="text-orange-500"> AVENTURA</span>
            </h2>

            <p className="mt-5 text-gray-400">
              Explora Pacucha y sus paisajes de una forma diferente. Elige la
              experiencia que más se adapte a ti.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {TOURS.map((tour) => (
              <article
                key={tour.name}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 transition duration-300 hover:-translate-y-2 hover:border-orange-500/50"
              >
                <button
                  type="button"
                  onClick={() => tour.route && setActiveTour(tour)}
                  disabled={!tour.route}
                  aria-label={
                    tour.route ? `Ver ruta de ${tour.name} en el mapa` : undefined
                  }
                  className="relative block h-64 w-full cursor-pointer overflow-hidden text-left disabled:cursor-default"
                >
                  <Image
                    src={tour.image}
                    alt={tour.name}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                  {tour.badge && (
                    <span className="absolute bottom-5 left-5 rounded-full bg-orange-500 px-4 py-2 text-xs font-black text-black">
                      {tour.badge}
                    </span>
                  )}

                  {tour.route && (
                    <span className="absolute bottom-5 right-5 rounded-full border border-white/30 bg-black/70 px-4 py-2 text-xs font-bold backdrop-blur-sm transition group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-black">
                      VER RUTA EN MAPA
                    </span>
                  )}
                </button>

                <div className="p-7">
                  <h3 className="text-2xl font-black">{tour.name}</h3>

                  <p className="mt-3 text-sm leading-relaxed text-gray-400">
                    {tour.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">DESDE</p>
                      <p className="text-2xl font-black text-orange-500">
                        S/ {tour.price}
                      </p>
                    </div>

                    <a
                      href={whatsappLink(
                        `Hola, quiero reservar el ${tour.name}. ¿Qué fechas tienen disponibles?`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-white/20 px-5 py-3 text-sm font-bold transition hover:bg-orange-500 hover:text-black"
                    >
                      RESERVAR
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GALERÍA ================= */}
      <section id="galeria" className="scroll-mt-4 bg-black px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-sm font-bold tracking-[0.3em] text-orange-500">
              MOMENTOS REALES
            </p>

            <h2 className="text-3xl font-black sm:text-4xl md:text-6xl">
              GALERÍA
              <span className="text-orange-500"> 4FULL</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {GALLERY.map((src, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-xl"
              >
                <Image
                  src={src}
                  alt={`Foto ${index + 1} de nuestros tours en Pacucha`}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative overflow-hidden px-5 py-16 md:px-8 md:py-24">
        <div className="absolute inset-0 bg-orange-500" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="font-bold tracking-[0.3em] text-black/60">
            ¿ESTÁS LISTO?
          </p>

          <h2 className="mt-4 text-4xl font-black text-black sm:text-5xl md:text-7xl">
            TU AVENTURA
            <br />
            COMIENZA AQUÍ
          </h2>

          <a
            href={whatsappLink("Hola, quiero reservar mi tour en Pacucha.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-block rounded-full bg-black px-10 py-5 font-black text-white transition hover:scale-105"
          >
            RESERVAR MI TOUR
          </a>
        </div>
      </section>

      {/* ================= CONTACTO ================= */}
      <section id="contacto" className="scroll-mt-4 bg-zinc-950 px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-bold tracking-[0.3em] text-orange-500">
              HABLEMOS
            </p>

            <h2 className="text-3xl font-black sm:text-4xl md:text-6xl">
              CONTACTO
            </h2>

            <p className="mt-5 max-w-md text-gray-400">
              Escríbenos por WhatsApp para reservar, consultar fechas o armar
              un tour para tu grupo.
            </p>

            <a
              href={whatsappLink("Hola, tengo una consulta sobre los tours en Pacucha.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-full bg-green-500 px-8 py-4 font-black text-black transition hover:scale-105 hover:bg-green-400"
            >
              ESCRIBIR POR WHATSAPP
            </a>
          </div>

          <div className="space-y-6 text-gray-300">
            <div>
              <p className="text-xs font-bold tracking-widest text-gray-500">
                UBICACIÓN
              </p>
              <p className="mt-1">Pacucha, Andahuaylas, Apurímac</p>
            </div>

            <div>
              <p className="text-xs font-bold tracking-widest text-gray-500">
                HORARIO
              </p>
              {/* 👉 Ajusta el horario real */}
              <p className="mt-1">Todos los días, 8:00 a. m. – 5:00 p. m.</p>
            </div>

            {/* 👉 Reemplaza con el iframe de Google Maps de tu local */}
            <div className="flex h-56 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-sm text-gray-500">
              Aquí va el mapa de Google Maps
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 bg-black px-8 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row">
          <div>
            <p className="text-xl font-black tracking-widest">PACUCHA</p>
            <p className="mt-2 text-sm text-gray-500">
              Aventura sobre cuatro ruedas.
            </p>
          </div>

          <p className="text-sm text-gray-600">
            © 2026 Rutas de Pacucha 4Full
          </p>
        </div>
      </footer>

      {/* ================= MODAL DE RUTA ================= */}
      {activeTour?.route && (
        <RouteModal
          tourName={activeTour.name}
          route={activeTour.route}
          reserveHref={whatsappLink(
            `Hola, quiero reservar el ${activeTour.name}. ¿Qué fechas tienen disponibles?`
          )}
          onClose={() => setActiveTour(null)}
        />
      )}
    </main>
  );
}