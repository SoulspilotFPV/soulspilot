import type { Metadata } from "next";
import FooterCurtain from "@/components/FooterCurtain";
import Reveal from "@/components/Reveal";
import TransitionLink from "@/components/shell/TransitionLink";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Benefici · ${site.brand}`,
  description: "Cosa cambia per musei, hotel, agenzie immobiliari e territori con un volo immersivo, e i pacchetti tra cui scegliere.",
};

// per ogni settore: quando il cliente decide, cosa fa il volo, cosa ottieni
const sectors = [
  {
    name: "Patrimonio e cultura",
    moment: "Prima di decidere se partire.",
    flight: "Fa entrare chi guarda in sale, fortezze e monumenti, e accende la curiosità di vederli dal vivo.",
    gain: "Un racconto per i canali dell'ente, le fiere e i social. Più desiderio di visita e un patrimonio accessibile anche a chi non può venire.",
  },
  {
    name: "Hotellerie e hospitality",
    moment: "Prima di prenotare, mentre confronta le strutture.",
    flight: "Mostra gli spazi nella loro verità e fa vivere l'ospitalità prima ancora del check-in.",
    gain: "Una ragione in più per scegliere te e prenotare dal tuo sito ufficiale, senza passare dai portali.",
  },
  {
    name: "Luxury real estate",
    moment: "Prima della visita, spesso a distanza.",
    flight: "Un percorso fluido dagli esterni agli interni, che restituisce la continuità degli ambienti e la cura delle rifiniture.",
    gain: "Acquirenti e investitori che arrivano già convinti, e visite più qualificate.",
  },
  {
    name: "Valorizzazione del territorio",
    moment: "Prima di scegliere la meta.",
    flight: "Racconta paesaggio e identità locale in modo innovativo e immersivo.",
    gain: "Un contenuto che attrae nuovi visitatori, fa scoprire le meraviglie del luogo e dà valore a chi lo abita.",
  },
];

const packages = [
  {
    n: "01",
    title: "Media production",
    sub: "Video 4K per sito e social",
    items: [
      "Riprese aeree d'insieme ad alta risoluzione",
      "Sorvolo FPV immersivo indoor e outdoor",
      "Sound design foley e audio d'ambiente registrato in loco",
      "Master 4K per sito e TV, più tagli 9:16 per Reel e TikTok",
    ],
  },
  {
    n: "02",
    title: "Sito web su misura",
    sub: "Riprogettazione e sviluppo, anche in 3D",
    items: [
      "Riprogettazione del sito che hai, o uno nuovo da zero",
      "Sviluppo custom, anche con esperienze 3D",
      "Il tuo video al centro dell'esperienza",
      "Modulo di contatto e prenotazione diretta, con notifiche istantanee via e-mail",
    ],
  },
  {
    n: "03",
    title: "All-in-one",
    sub: "Video e sito, un unico progetto",
    featured: true,
    items: [
      "Produzione media completa: video aerei, FPV e audio foley",
      "Sito custom, anche 3D, costruito attorno alle immagini",
      "Contatto e prenotazione diretta con notifiche via e-mail",
      "Un solo interlocutore, dall'idea alla pubblicazione",
    ],
  },
];

const label = "font-mono text-[11px] uppercase tracking-[0.18em]";

export default function Benefici() {
  return (
    <>
      <main id="main" data-scene="sopra" className="px-5 pb-28 pt-32 sm:px-10 md:pt-40">
        <div className="mx-auto max-w-page">
          <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <h1 className="text-[clamp(56px,9vw,128px)] font-semibold leading-[0.92] tracking-[-0.05em] text-ink">
                Benefici<span className="accent">.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1} className="max-w-[440px]">
              <p className="text-ink/75">
                Un luogo si sceglie prima con le emozioni, poi con la ragione. Il volo immersivo lavora nel momento in cui chi guarda decide.
              </p>
            </Reveal>
          </div>

          <ul className="flex flex-col gap-4">
            {sectors.map((s, i) => (
              <Reveal
                as="li"
                key={s.name}
                delay={0.04}
                className="grid gap-8 rounded-[28px] border border-white/60 bg-white/60 p-7 shadow-[0_30px_80px_-40px_rgba(30,33,35,.35)] backdrop-blur-2xl sm:p-9 lg:grid-cols-[4fr_8fr] lg:gap-12"
              >
                <div className="flex flex-col justify-between gap-6">
                  <p className={`${label} text-verde`}>{String(i + 1).padStart(2, "0")}</p>
                  <div>
                    <h2 className="accent text-[clamp(32px,3.4vw,46px)] leading-[1] text-ink">{s.name}</h2>
                    <p className="mt-3 text-[15px] text-ink2">{s.moment}</p>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 md:gap-10">
                  <div>
                    <p className={`${label} mb-3 text-ink3`}>Cosa fa il volo</p>
                    <p className="text-[16px] leading-snug text-ink">{s.flight}</p>
                  </div>
                  <div>
                    <p className={`${label} mb-3 text-ink3`}>Cosa ottieni</p>
                    <p className="text-[16px] leading-snug text-ink">{s.gain}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal className="mb-3 mt-24 md:mt-32">
            <h2 className="max-w-[16ch] text-[clamp(36px,5vw,68px)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink">
              Scegli il tuo <span className="accent">pacchetto.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.05} className="mb-8">
            <p className="max-w-[52ch] text-ink/75">Tre modi di lavorare insieme: parti dal video, dal sito, o da tutto.</p>
          </Reveal>
          <ul className="grid gap-4 lg:grid-cols-3">
            {packages.map((p, i) => (
              <Reveal
                as="li"
                key={p.n}
                delay={i * 0.08}
                className={`flex flex-col justify-between gap-10 rounded-[28px] p-7 sm:p-9 ${
                  p.featured
                    ? "bg-[#1c3227] text-white shadow-[0_30px_80px_-40px_rgba(20,24,26,.6)]"
                    : "border border-white/60 bg-white/60 shadow-[0_30px_80px_-40px_rgba(30,33,35,.35)] backdrop-blur-2xl"
                }`}
              >
                <div>
                  <p className={`${label} mb-4 ${p.featured ? "text-[#9fd3ae]" : "text-verde"}`}>Pacchetto {p.n}</p>
                  <h3 className="text-[clamp(26px,2.4vw,34px)] font-semibold leading-[1.05] tracking-[-0.03em]">{p.title}</h3>
                  <p className={`mb-6 mt-2 text-[15px] ${p.featured ? "text-white/70" : "text-ink2"}`}>{p.sub}</p>
                  <ul className="flex flex-col gap-3">
                    {p.items.map((t) => (
                      <li key={t} className="flex gap-3 text-[15px] leading-snug">
                        <span className={`mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full ${p.featured ? "bg-[#9fd3ae]" : "bg-verde"}`} aria-hidden />
                        <span className={p.featured ? "text-white/85" : "text-ink2"}>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <TransitionLink href="/contatti" label="Rotta: Contatti" className={p.featured ? "btn btn-light self-start" : "btn btn-dark self-start"}>
                  Prenota una chiamata <span className="dot" aria-hidden />
                </TransitionLink>
              </Reveal>
            ))}
          </ul>
        </div>
      </main>
      <FooterCurtain scene="sopra" />
    </>
  );
}
