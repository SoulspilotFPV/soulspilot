/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  // i vecchi indirizzi /lavori portano ai progetti
  async redirects() {
    return [
      { source: "/lavori", destination: "/progetti", permanent: true },
      ...[
        ["cultura", "langhe"],
        ["ricettivita", "residenza"],
        ["hotellerie", "noli"],
        ["natura", "forno-alpi-graie"],
      ].flatMap(([from, to]) => [
        { source: `/lavori/${from}`, destination: `/progetti/${to}`, permanent: true },
        { source: `/progetti/${from}`, destination: `/progetti/${to}`, permanent: true },
      ]),
    ];
  },
};
export default nextConfig;
