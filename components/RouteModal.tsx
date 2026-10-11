"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export type RouteData = {
  image: string;
  width: number;
  height: number;
  points: [number, number][]; // coordenadas en píxeles sobre la imagen
  from: string;
  to: string;
};

type Props = {
  tourName: string;
  route: RouteData;
  reserveHref: string;
  onClose: () => void;
};

// Convierte los puntos en una curva suave (Catmull-Rom → Bézier)
function toSmoothPath(pts: [number, number][]) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x} ${c1y} ${c2x} ${c2y} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

export default function RouteModal({
  tourName,
  route,
  reserveHref,
  onClose,
}: Props) {
  const pathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGGElement>(null);
  const endRef = useRef<SVGGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const d = toSmoothPath(route.points);
  const start = route.points[0];
  const end = route.points[route.points.length - 1];

  // Animación de la ruta
  useEffect(() => {
    const path = pathRef.current;
    const marker = markerRef.current;
    const endPin = endRef.current;
    if (!path || !marker || !endPin) return;

    const len = path.getTotalLength();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const place = (p: number) => {
      const pt = path.getPointAtLength(p * len);
      marker.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      path.style.strokeDashoffset = String(len * (1 - p));
    };

    path.style.strokeDasharray = String(len);

    if (reduceMotion) {
      place(1);
      gsap.set(endPin, { opacity: 1 });
      return;
    }

    const state = { p: 0 };
    const ctx = gsap.context(() => {
      place(0);
      gsap.set(marker, { opacity: 0 });
      gsap.set(endPin, { opacity: 0, scale: 0.5, transformOrigin: "center" });

      tlRef.current = gsap
        .timeline({ delay: 0.5 })
        .to(marker, { opacity: 1, duration: 0.3 })
        .to(state, {
          p: 1,
          duration: 9,
          ease: "power1.inOut",
          onUpdate: () => place(state.p),
        })
        .to(endPin, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" });
    });

    return () => ctx.revert();
  }, [d]);

  // Cerrar con ESC, bloquear scroll y enfocar el botón cerrar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Ruta de ${tourName}`}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="flex items-start justify-between gap-4 px-6 py-5">
          <div>
            <h3 className="text-2xl font-black">{tourName}</h3>
            <p className="mt-1 text-sm text-gray-400">
              {route.from} hasta {route.to}
            </p>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar mapa"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-xl transition hover:bg-white hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Mapa + ruta */}
        <div
          className="relative w-full"
          style={{ aspectRatio: `${route.width} / ${route.height}` }}
        >
          <Image
            src={route.image}
            alt={`Mapa satelital de la ruta de ${route.from} a ${route.to}`}
            fill
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
          />

          <svg
            viewBox={`0 0 ${route.width} ${route.height}`}
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {/* Guía tenue de toda la ruta */}
            <path
              d={d}
              fill="none"
              stroke="white"
              strokeOpacity="0.35"
              strokeWidth="3"
              strokeDasharray="2 9"
              strokeLinecap="round"
            />

            {/* Ruta animada */}
            <path
              ref={pathRef}
              d={d}
              fill="none"
              stroke="#f97316"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: "drop-shadow(0 0 6px rgba(249,115,22,0.9))" }}
            />

            {/* Punto de salida */}
            <g transform={`translate(${start[0]} ${start[1]})`}>
              <circle r="14" fill="#22c55e" fillOpacity="0.3" />
              <circle r="7" fill="#22c55e" stroke="white" strokeWidth="2.5" />
            </g>

            {/* Punto de llegada */}
            <g ref={endRef} transform={`translate(${end[0]} ${end[1]})`}>
              <circle r="16" fill="#f97316" fillOpacity="0.3" />
              <circle r="8" fill="#f97316" stroke="white" strokeWidth="2.5" />
            </g>

            {/* Cuatrimoto en movimiento */}
            <g ref={markerRef}>
              <circle r="15" fill="#f97316" fillOpacity="0.35" />
              <circle r="8" fill="white" stroke="#f97316" strokeWidth="4" />
            </g>
          </svg>
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
          <button
            type="button"
            onClick={() => tlRef.current?.restart()}
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold transition hover:bg-white hover:text-black"
          >
            REPETIR RECORRIDO
          </button>

          <a
            href={reserveHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-orange-500 px-6 py-3 text-sm font-black text-black transition hover:scale-105 hover:bg-orange-400"
          >
            RESERVAR ESTE TOUR
          </a>
        </div>
      </div>
    </div>
  );
}
