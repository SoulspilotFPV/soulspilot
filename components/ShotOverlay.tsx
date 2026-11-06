"use client";

import { motion, type MotionValue } from "framer-motion";
import type { ReactNode } from "react";

/** Veli scuri sopra la ripresa, per leggere i testi che arrivano come children. */
export default function ShotOverlay({ show, children }: { show: MotionValue<number>; children?: ReactNode }) {
  return (
    <motion.div style={{ opacity: show }} className="pointer-events-none absolute inset-0 text-white">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
      {children}
    </motion.div>
  );
}
