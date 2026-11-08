import type { Metadata } from "next";
import { base, site } from "./site";

/** Titolo, descrizione e anteprima social propri di ogni pagina. `image` è il nome del file in /public/og. */
export function pageMeta({ title, description, path, image }: { title: string; description: string; path: string; image: string }): Metadata {
  const url = `${site.url}${path}`;
  const img = `${site.url}/og/${image}.jpg`;
  void base;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", locale: "it_IT", siteName: site.brand, images: [{ url: img, width: 1200, height: 630, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [img] },
  };
}
