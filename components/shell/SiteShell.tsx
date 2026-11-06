"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { ShellProvider, useShell } from "./ShellContext";
import DroneLoader from "./DroneLoader";
import ExpandOverlay from "./ExpandOverlay";
import Nav from "../Nav";

const JourneyCanvas = dynamic(() => import("../journey/JourneyCanvas"), { ssr: false });

function Sky() {
  const { setProgress, canvasReady } = useShell();
  return <JourneyCanvas onProgress={setProgress} onReady={canvasReady} />;
}

/**
 * Guscio del sito: resta montato tra una pagina e l'altra.
 * Il cielo 3D nasce una volta sola, la barra non si ricrea, le transizioni passano da un solo regista.
 */
export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <ShellProvider>
      <Sky />
      <Nav />
      <div className="relative z-10">{children}</div>
      <ExpandOverlay />
      <DroneLoader />
    </ShellProvider>
  );
}
