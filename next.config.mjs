/** @type {import('next').NextConfig} */
// sito statico: la cartella "out" si pubblica su Cloudflare Pages (i reindirizzamenti stanno in public/_redirects)
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
};
export default nextConfig;
