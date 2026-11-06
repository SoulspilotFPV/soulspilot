/** @type {import('next').NextConfig} */
// sito statico: la cartella "out" si pubblica su Cloudflare Pages (i reindirizzamenti stanno in public/_redirects)
const nextConfig = {
  output: "export",
  // su GitHub Pages il sito sta in una sottocartella (es. /soulspilot); sul dominio proprio resta vuoto
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: { unoptimized: true },
};
export default nextConfig;
