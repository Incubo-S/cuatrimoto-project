"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AtvHero() {
  const atvRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!atvRef.current) return;

    const timeline = gsap.timeline();

    timeline.fromTo(
      atvRef.current,
      {
        x: 600,
        opacity: 0,
        scale: 0.75,
        rotation: 3,
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.8,
        ease: "power3.out",
      }
    );

    timeline.to(atvRef.current, {
      y: -10,
      duration: 0.5,
      repeat: 3,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div
      ref={atvRef}
      className="absolute bottom-8 right-5 z-20 md:right-16"
    >
      <div className="text-8xl md:text-9xl">
        🏍️
      </div>
    </div>
  );
}