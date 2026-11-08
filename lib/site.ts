/** prefisso della cartella su cui è pubblicato il sito (vuoto sul dominio proprio) */
export const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/*
  Tutti i dati da completare stanno qui. Quello che è vuoto non compare sul sito:
  - email, whatsapp (solo cifre con prefisso, es. "393331234567"), vat
  - social: aggiungi solo i profili veri, es. Instagram: "https://instagram.com/tuoprofilo"
  - quote: la citazione di un cliente vero; finché è null la sezione resta nascosta
*/
export const site = {
  brand: "soulspilot",
  name: "Gabriele Paschero",
  firstName: "Gabriele",
  email: "",
  whatsapp: "",
  vat: "",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  title: "soulspilot · Il desiderio comincia prima della visita",
  description:
    "Racconti video con drone e FPV per luoghi che vogliono farsi desiderare: cultura, immobili, ospitalità e natura. Voli lenti, suono registrato sul posto.",
  social: {} as Record<string, string>,
  quote: null as null | { text: string; name: string; role: string },
};

export const nav = [
  { label: "Progetti", href: "/progetti" },
  { label: "Chi sono", href: "/chi-sono" },
  { label: "Cosa faccio", href: "/cosa-faccio" },
];

/** il pulsante a destra nella barra */
export const navCta = { label: "Prenota 30 minuti", href: "/contatti" };

/** Indirizzo Cal.com per prenotare la chiamata (le domande si gestiscono su Cal.com). */
export const calLink = "soulspilot/30min";

/** Link WhatsApp con il messaggio già scritto; null finché manca il numero. */
export const whatsappHref = site.whatsapp
  ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Ciao Gabriele, ho visto il tuo sito e vorrei parlarne.")}`
  : null;

/** cartolina: luoghi da spedire a chi non c'è ancora. chiave: spazi da aprire prima di entrarci. */
export type Kind = "cartolina" | "chiave";

export type WorkArea = {
  slug: string;
  /** nome del progetto */
  title: string;
  /** settore, in una parola */
  sector: string;
  kind: Kind;
  /** "pronto" ha la sua pagina; "in-arrivo" compare solo come cartolina da attendere */
  status: "pronto" | "in-arrivo";
  /** la promessa sopra la ripresa; *parola* va in corsivo */
  claim: string;
  /** cosa ottiene chi guarda, in due frasi */
  line: string;
  /** a chi si rivolge questo tipo di lavoro */
  audience: string;
  /** testo del timbro (cartoline) */
  mark: string;
  /** luogo mostrato accanto al settore; vuoto finché non è definito */
  place: string;
  /**
   * Dicitura sotto il luogo, da mostrare solo quando il girato è quello vero.
   * Fenestrelle: lascia false finché non arrivano le riprese del Forte, poi true.
   */
  caption?: string;
  captionLive?: boolean;
  /** ripresa: /public{video}-d.mp4 e -m.mp4 (+ -d.av1.mp4); 6 fotogrammi in /public{stills}/1..6.avif */
  video?: string;
  stills?: string;
  /** il racconto nella pagina del progetto, un paragrafo per voce */
  story: string[];
  /** dettagli di lavoro mostrati sul retro della cartolina o dietro la porta */
  production: { label: string; text: string }[];
};

export const works: WorkArea[] = [
  {
    slug: "fenestrelle",
    title: "Fenestrelle",
    sector: "Cultura",
    kind: "cartolina",
    status: "pronto",
    claim: "Un patrimonio che *si fa desiderare* prima della visita.",
    line: "Un racconto lento dentro mura, scale e panorami, che fa venire voglia di vedere il luogo dal vivo.",
    audience: "Musei, forti, enti culturali, comuni",
    mark: "Fenestrelle",
    place: "Forte di Fenestrelle",
    caption: "Girato al Forte di Fenestrelle · Anteprima",
    captionLive: false,
    // provvisorio: le riprese del Forte arrivano dopo; per ora resta il girato delle Langhe, senza didascalia
    video: `${base}/video/cultura`,
    stills: `${base}/stills/cultura`,
    story: [
      "Un luogo ricco di storia rischia di sembrare uguale a tanti altri, se lo si racconta sempre dallo stesso punto di vista. Dall'alto le mura tornano a dominare il paesaggio, e da dentro si capisce quanto è grande quello che si ha davanti.",
      "Il video diventa un invito: per i canali dell'ente, per le fiere, per i social. Mostra il patrimonio con il rispetto che merita e fa venire voglia di andarlo a vedere di persona.",
    ],
    production: [
      { label: "Riprese aeree e FPV", text: "Movimenti lenti e continui, per dare respiro all'architettura." },
      { label: "Montaggio", text: "Un ritmo calmo, che lascia allo sguardo il tempo di esplorare." },
      { label: "Suono", text: "Registrato sul posto: passi, vento, il silenzio del luogo." },
    ],
  },
  {
    slug: "residenza",
    title: "Residenza",
    sector: "Immobiliare",
    kind: "chiave",
    status: "pronto",
    claim: "Fai vivere un ambiente *ancor prima* di visitarlo dal vivo.",
    line: "Un volo continuo dall'ingresso all'ultima stanza: chi guarda capisce come si vive la casa, non solo com'è fatta.",
    audience: "Agenzie e proprietari di immobili di pregio",
    mark: "Residenza",
    place: "",
    video: `${base}/video/residenza`,
    stills: `${base}/stills/residenza`,
    story: [
      "Le foto mostrano le stanze una alla volta, ma non dicono come si passa dall'una all'altra. Un volo FPV continuo, dall'ingresso fino all'ultima stanza, permette a chi guarda di fare un tour guidato ancor prima di venire a visitare.",
      "Chi arriva alla visita conosce già la casa, e può concentrarsi su quello che conta davvero. Per l'agenzia è anche un modo per farsi ricordare.",
    ],
    production: [
      { label: "Riprese FPV interne", text: "Un unico volo continuo che attraversa gli spazi come farebbe una persona." },
      { label: "Montaggio", text: "Il percorso segue la casa nell'ordine in cui la vivrà chi ci abiterà." },
      { label: "Suono", text: "Ambiente sonoro e musica che accompagnano la visita." },
    ],
  },
  {
    slug: "ospitalita",
    title: "Ospitalità",
    sector: "Ospitalità",
    kind: "chiave",
    status: "pronto",
    claim: "La fuga comincia *prima del check-in*.",
    line: "Lo spazio, la luce e il suono del posto, raccontati prima che l'ospite faccia la valigia.",
    audience: "Hotel, B&B, case vacanza, strutture di accoglienza",
    mark: "Ospitalità",
    place: "Noli, Liguria",
    video: `${base}/video/ospitalita`,
    stills: `${base}/stills/ospitalita`,
    story: [
      "Chi sceglie dove dormire sceglie con il cuore, e poi cerca le conferme. Un racconto dall'alto mette la struttura nel suo contesto: il mare, il borgo, la luce che entra in terrazza a fine giornata.",
      "Sul sito e sui social il video fa immaginare il soggiorno prima ancora del check-in, e rappresenta la struttura per quello che è.",
    ],
    production: [
      { label: "Riprese aeree e FPV", text: "Dalla costa alla struttura, per far capire subito dove ci si trova." },
      { label: "Montaggio", text: "La giornata dell'ospite, dall'arrivo al tramonto." },
      { label: "Suono", text: "Audio d'ambiente registrato sul posto: mare, voci, il suono vero del luogo." },
    ],
  },
  {
    slug: "tenerife",
    title: "Tenerife",
    sector: "Natura",
    kind: "cartolina",
    status: "in-arrivo",
    claim: "Una cartolina dalla natura, *in arrivo* da Tenerife.",
    line: "Sto preparando il prossimo racconto: il paesaggio dell'isola, con voli lenti e il suono registrato sul posto.",
    audience: "Parchi, enti turistici, realtà outdoor",
    mark: "Tenerife",
    place: "",
    // il girato alpino resta come sfondo generico del capitolo, senza nome di luogo
    video: `${base}/video/natura`,
    stills: `${base}/stills/natura`,
    story: [],
    production: [],
  },
];

/** progetti che hanno una pagina propria */
export const readyWorks = works.filter((w) => w.status === "pronto");

/** riga sopra la promessa: "Cultura · Forte di Fenestrelle" */
export function eyebrow(w: WorkArea) {
  const tail = w.status === "in-arrivo" ? "cartolina in arrivo" : w.captionLive && w.caption ? w.caption : w.place;
  return [w.sector, tail].filter(Boolean).join(" · ");
}
