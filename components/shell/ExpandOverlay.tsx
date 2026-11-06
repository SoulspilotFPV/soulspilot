"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useShell } from "./ShellContext";

/**
 * Transizione "entra nella ripresa": il riquadro cliccato si allarga a tutto schermo,
 * la pagina del progetto si monta sotto e l'immagine sfuma nella sua apertura.
 */
export default function ExpandOverlay() {
  const { phase, mode, expand } = useShell();
  const reduce = useReducedMotion();
  const on = mode === "expand" && expand !== null && phase !== "idle";
  const covering = phase === "cover" || phase === "wait";

  return (
    <AnimatePresence>
      {on && expand && (
        <motion.div
          key="expand"
          className="pointer-events-none fixed z-[100] overflow-hidden bg-dusk"
          initial={
            reduce
              ? { opacity: 0, top: 0, left: 0, width: "100vw", height: "100vh", borderRadius: 0 }
              : { ...expand.rect, borderRadius: 24, opacity: 1 }
          }
          animate={
            covering
              ? { top: 0, left: 0, width: "100vw", height: "100vh", borderRadius: 0, opacity: 1 }
              : { top: 0, left: 0, width: "100vw", height: "100vh", borderRadius: 0, opacity: 0 }
          }
          exit={{ opacity: 0 }}
          transition={covering ? { duration: 0.9, ease: [0.65, 0, 0.2, 1] } : { duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
        >
          {expand.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <motion.img
              src={expand.image}
              alt=""
              className="h-full w-full object-cover"
              initial={{ scale: 1 }}
              animate={{ scale: covering ? 1.04 : 1.08 }}
              transition={{ duration: 1.6, ease: [0.2, 0.7, 0.2, 1] }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
