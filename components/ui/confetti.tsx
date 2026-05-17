"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const COLORS = ["#4F8EF7", "#34C759", "#FF9500", "#FF3B30", "#AF52DE", "#FFCC00"];

function ConfettiPiece({ x, color, delay }: { x: number; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ y: -20, x, opacity: 1, rotate: 0, scale: 1 }}
      animate={{
        y: window.innerHeight + 100,
        x: x + (Math.random() - 0.5) * 200,
        opacity: 0,
        rotate: Math.random() * 720 - 360,
        scale: 0,
      }}
      transition={{ duration: 2 + Math.random(), delay, ease: "easeIn" }}
      className="fixed top-0 w-3 h-3 rounded-sm pointer-events-none z-50"
      style={{ backgroundColor: color, left: 0 }}
    />
  );
}

export function ConfettiEffect() {
  const [pieces] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 400),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.5,
    }))
  );

  return (
    <>
      {pieces.map((p) => (
        <ConfettiPiece key={p.id} x={p.x} color={p.color} delay={p.delay} />
      ))}
    </>
  );
}
