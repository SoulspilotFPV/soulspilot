/** @type {import('next').NextConfig} */
// sito statico: la cartella "out" si pubblica su Cloudflare Pages (i reindirizzamenti stanno in public/_redirects)
const nextConfig = {
  output: "export",
  // le pagine diventano cartelle (/progetti/index.html): con una sottocartella come /soulspilot, Next chiede così il file giusto per la home
  trailingSlash: true,
  // su GitHub Pages il sito sta in una sottocartella (es. /soulspilot); sul dominio proprio resta vuoto
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: { unoptimized: true },
};
export default nextConfig;
