type Client = { name: string; logo: string };

// Vuoto per ora: finché non ci sono realtà da mostrare il componente non renderizza nulla.
const clients: Client[] = [];

export default function ClientLogos() {
  if (clients.length === 0) return null;
  return (
    <section aria-label="Realtà con cui ho collaborato" className="container-page pt-16">
      <p className="mb-6 text-center font-mono text-xs uppercase tracking-widest text-ink3">
        Realtà con cui ho collaborato
      </p>
      <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {clients.map((c) => (
          <li key={c.name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.logo} alt={c.name} className="h-8 w-auto opacity-60" />
          </li>
        ))}
      </ul>
    </section>
  );
}
