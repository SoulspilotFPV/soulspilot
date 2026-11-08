import FooterCurtain from "@/components/FooterCurtain";
import Reveal from "@/components/Reveal";
import TransitionLink from "@/components/shell/TransitionLink";
import { pageMeta } from "@/lib/meta";
import { navCta, site } from "@/lib/site";

export const metadata = pageMeta({
  title: `Cosa faccio · ${site.brand}`,
  description: "Quattro tipi di racconto, due pacchetti: il video, oppure il video con un'esperienza web costruita attorno. Il prezzo lo definiamo insieme.",
  path: "/cosa-faccio",
  image: "cosa-faccio",
});

// per ogni tipo di racconto: cosa fa, cosa ottieni. Nessuna promessa di prenotazioni o vendite.
const sectors = [
  {
    name: "Cultura",
    flight: "Porta chi guarda dentro sale, mura e panorami, con il ritmo di chi cammina piano.",
    gain: "Un racconto per i canali dell'ente, le fiere e i social, e un patrimonio che si può visitare anche a distanza.",
  },
  {
    name: "Immobiliare",
    flight: "Un unico volo dall'esterno agli interni, che mostra come gli ambienti si collegano tra loro.",
    gain: "Un video per annuncio e sito che fa conoscere la casa prima della visita, e che distingue la tua agenzia.",
  },
  {
    name: "Ospitalità",
    flight: "Mostra gli spazi, la luce e l'atmosfera, con l'audio registrato sul posto.",
    gain: "Un video per sito e social che fa immaginare il soggiorno e rappresenta la struttura con onestà.",
  },
  {
    name: "Natura",
    flight: "Segue l'acqua, il bosco e il cielo con voli lenti e radenti.",
    gain: "Il racconto di un paesaggio per enti, parchi e realtà outdoor, utile a farlo conoscere e rispettare.",
  },
];

const packages = [
  {
    n: "01",
    title: "Racconto",
    sub: "Il video, pensato per il tuo luogo",
    items: [
      "Riprese aeree e FPV, anche negli interni",
      "Sound design con audio registrato sul posto",
      "Master 4K per sito e schermi, più tagli verticali 9:16 per social",
    ],
  },
  {
    n: "02",
    title: "Racconto + esperienza web",
    sub: "Il video e una pagina costruita attorno",
    featured: true,
    items: [
      "Tutto quello che c'è nel Racconto",
      "Una pagina web su misura, anche con elementi 3D, con il video al centro",
      "Modulo di contatto o prenotazione diretta, con notifiche via e-mail",
    ],
  },
];

const label = "font-mono text-[11px] uppercase tracking-[0.18em]";

export default function CosaFaccio() {
  return (
    <>
      <main id="main" data-scene="sopra" className="px-5 pb-28 pt-32 sm:px-10 md:pt-40">
        <div className="mx-auto max-w-page">
          <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <h1 className="text-[clamp(48px,8vw,112px)] font-semibold leading-[0.92] tracking-[-0.05em] text-ink">
                Cosa faccio<span className="accent">.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1} className="max-w-[440px]">
              <p className="text-ink/75">Un luogo si sceglie prima con le emozioni, poi con la ragione. Io lavoro sul primo momento: quello in cui nasce il desiderio.</p>
            </Reveal>
          </div>

          <ul className="flex flex-col gap-4">
            {sectors.map((s, i) => (
              <Reveal as="li" key={s.name} delay={0.04} className="grid gap-8 rounded-[28px] border border-white/60 bg-white/60 p-7 shadow-[0_30px_80px_-40px_rgba(30,33,35,.35)] backdrop-blur-2xl sm:p-9 lg:grid-cols-[4fr_8fr] lg:gap-12">
                <div className="flex flex-col justify-between gap-6">
                  <p className={`${label} text-verde`}>{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="accent text-[clamp(32px,3.4vw,46px)] leading-[1] text-ink">{s.name}</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2 md:gap-10">
                  <div>
                    <p className={`${label} mb-3 text-ink3`}>Cosa fa il racconto</p>
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
              Due modi di <span className="accent">lavorare insieme.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.05} className="mb-8">
            <p className="max-w-[52ch] text-ink/75">Parti dal video, oppure dal video e da una pagina web costruita attorno. Il prezzo lo definiamo insieme dopo la chiamata, in base al luogo.</p>
          </Reveal>
          <ul className="grid gap-4 lg:grid-cols-2">
            {packages.map((p, i) => (
              <Reveal
                as="li"
                key={p.n}
                delay={i * 0.08}
                className={`flex flex-col justify-between gap-10 rounded-[28px] p-7 sm:p-9 ${
                  p.featured ? "bg-[#1c3227] text-white shadow-[0_30px_80px_-40px_rgba(20,24,26,.6)]" : "border border-white/60 bg-white/60 shadow-[0_30px_80px_-40px_rgba(30,33,35,.35)] backdrop-blur-2xl"
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
                <TransitionLink href={navCta.href} label="Rotta: Contatti" className={p.featured ? "btn btn-light self-start" : "btn btn-dark self-start"}>
                  {navCta.label} <span className="dot" aria-hidden />
                </TransitionLink>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.1} className="mt-6">
            <p className="text-[14px] text-ink/65">Collaborazione continuativa, su preventivo.</p>
          </Reveal>
        </div>
      </main>
      <FooterCurtain scene="sopra" />
    </>
  );
}
