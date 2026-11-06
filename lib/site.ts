/** prefisso della cartella su cui è pubblicato il sito (vuoto sul dominio proprio) */
export const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Tutti i segnaposto in un unico punto: sostituisci qui i dati reali.
export const site = {
  brand: "soulspilot",
  name: "Gabriele Paschero",
  firstName: "Gabriele",
  email: "[email@dominio.it]",
  vat: "P. IVA [00000000000]",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  description:
    "Riprese aeree e voli FPV per la promozione culturale, l'immobiliare, l'hotellerie e la valorizzazione del territorio. Siti web su misura.",
  social: {
    Instagram: "https://instagram.com/",
    YouTube: "https://youtube.com/",
    Vimeo: "https://vimeo.com/",
    LinkedIn: "https://linkedin.com/",
  },
};

export const nav = [
  { label: "Progetti", href: "/progetti" },
  { label: "Chi sono", href: "/chi-sono" },
  { label: "Benefici", href: "/benefici" },
];

/** il pulsante a destra nella barra */
export const navCta = { label: "Entriamo in contatto", href: "/contatti" };

/** Indirizzo Cal.com per prenotare la chiamata (le domande si gestiscono su Cal.com). */
export const calLink = "soulspilot/30min";

export type TicketIcon = "castello" | "casa" | "mare" | "montagna";

export type WorkArea = {
  slug: string;
  /** nome del progetto (il luogo) */
  title: string;
  /** settore, usato anche come filtro nella pagina progetti */
  category: string;
  /** la promessa al cliente, grande sopra la ripresa; *parola* va in corsivo */
  claim: string;
  /** cosa ottiene il cliente, in una frase */
  line: string;
  /** a chi si rivolge questo tipo di lavoro */
  audience: string;
  /** codice da aeroporto e colori del biglietto */
  code: string;
  ticket: { paper: string; ink: string; accent: string; icon: TicketIcon };
  /** ripresa: /public{video}-d.mp4 e -m.mp4 (+ .av1.mp4); 6 fotogrammi per la galleria in /public{stills}/1..6.avif */
  video?: string;
  stills?: string;
  /** luogo e coordinate mostrati nell'OSD del drone */
  place: string;
  coords: [number, number];
  /** durata del tratto di ripresa (s) e direzione di volo per la bussola */
  shot: { seconds: number; heading: [number, number] };
  /** il racconto nella pagina del progetto, un paragrafo per voce */
  story: string[];
  /** dettagli di produzione mostrati nella pagina del progetto (storytelling, suono, ecc.) */
  production: { label: string; text: string }[];
};

export const works: WorkArea[] = [
  {
    slug: "langhe",
    title: "Langhe",
    category: "Patrimonio e promozione culturale",
    claim: "Digitalizza la storia, *rendi immortale* la bellezza.",
    line: "Attraversiamo sale espositive, fortezze e monumenti con la delicatezza e la sensibilità del volo FPV. Creiamo racconti visivi capaci di emozionare chi guarda, valorizzare il patrimonio e attrarre nuovi visitatori.",
    audience: "Musei, fortezze, enti culturali, comuni",
    code: "LNG",
    ticket: { paper: "#f3e7d4", ink: "#2b1a17", accent: "#7a2e2a", icon: "castello" },
    video: `${base}/video/cultura`,
    stills: `${base}/stills/cultura`,
    place: "Langhe, Piemonte",
    coords: [44.62, 7.99],
    shot: { seconds: 12, heading: [312, 18] },
    story: [
      "Un territorio ricco di storia rischia di sembrare uguale a tanti altri, se lo si racconta sempre dallo stesso punto di vista. Dall'alto il castello torna a dominare la collina, i filari disegnano il paesaggio e il borgo si legge tutto in un colpo d'occhio.",
      "Il video diventa uno strumento di promozione: per i canali dell'ente, per le fiere, per i social. Mostra il patrimonio con il rispetto che merita e fa venire voglia di venirlo a vedere di persona.",
    ],
    production: [
      { label: "Riprese aeree", text: "Movimenti lenti e continui attorno al castello, per dare respiro all'architettura." },
      { label: "Montaggio", text: "Un ritmo calmo, che lascia allo sguardo il tempo di esplorare." },
    ],
  },
  {
    slug: "noli",
    title: "Noli",
    category: "Hotellerie e hospitality",
    claim: "Aumenta le *prenotazioni dirette* mostrando l'esperienza reale.",
    line: "Guida i tuoi futuri ospiti dentro la struttura prima ancora che facciano le valigie. L'impatto emotivo del volo immersivo mostra gli spazi nella loro verità, trasformando il desiderio di soggiorno in prenotazioni sul tuo sito ufficiale.",
    audience: "Hotel, resort, B&B, case vacanza",
    code: "NOL",
    ticket: { paper: "#e2ecf2", ink: "#10202e", accent: "#1f4e79", icon: "mare" },
    video: `${base}/video/hotellerie`,
    stills: `${base}/stills/hotellerie`,
    place: "Noli, Liguria",
    coords: [44.2063, 8.4155],
    shot: { seconds: 15, heading: [205, 150] },
    story: [
      "Chi prenota una vacanza sceglie con il cuore, e poi cerca le conferme. Un racconto dall'alto mette la struttura nel suo contesto: il mare, il borgo, la luce che entra in terrazza a fine giornata.",
      "Sul sito, sui social e nelle piattaforme di prenotazione, il video fa provare all'ospite il soggiorno prima ancora del check-in. È lì che la scelta si fa, ed è lì che conviene essere i più belli.",
    ],
    production: [
      { label: "Riprese aeree e FPV", text: "Dalla costa alla struttura, per far capire subito dove ci si trova." },
      { label: "Storytelling", text: "La giornata dell'ospite, dall'arrivo al tramonto." },
      { label: "Sound design", text: "Audio d'ambiente registrato in loco: mare, voci, il suono vero del luogo." },
    ],
  },
  {
    slug: "residenza",
    title: "Residenza",
    category: "Luxury real estate",
    claim: "Non mostrare solo una casa. Fai percepire *uno stile di vita*.",
    line: "Un percorso guidato e fluido per acquirenti e investitori remoti. Uniamo gli esterni agli interni in una narrazione armoniosa, restituendo la reale continuità degli ambienti e l'esclusività delle rifiniture.",
    audience: "Agenzie di pregio, ville e dimore oltre il milione",
    code: "RES",
    ticket: { paper: "#efe6da", ink: "#2a211b", accent: "#8a5a3b", icon: "casa" },
    video: `${base}/video/ricettivita`,
    stills: `${base}/stills/ricettivita`,
    place: "[Località], Piemonte",
    coords: [44.89, 7.33],
    shot: { seconds: 16, heading: [88, 176] },
    story: [
      "Le foto mostrano le stanze una alla volta, ma non dicono come si passa dall'una all'altra. Un volo FPV continuo, dall'ingresso fino all'ultima stanza, permette ai possibili acquirenti di fare un tour guidato ancor prima di venire da te.",
      "Arrivano alla visita già convinti, o non arrivano affatto: meno appuntamenti a vuoto, più trattative vere. E un annuncio così eleva l'immagine della tua agenzia, perché si fa ricordare.",
    ],
    production: [
      { label: "Riprese FPV interne", text: "Un unico volo continuo che attraversa gli spazi come farebbe una persona." },
      { label: "Storytelling", text: "Il percorso segue la casa come la vivrà chi ci abiterà." },
      { label: "Sound design", text: "Ambiente sonoro e musica che accompagnano la visita." },
    ],
  },
  {
    slug: "forno-alpi-graie",
    title: "Forno Alpi Graie",
    category: "Valorizzazione del territorio",
    claim: "Emoziona e *valorizza* ogni territorio.",
    line: "Raccontiamo ogni luogo e paesaggio in modo innovativo e immersivo. Narrazioni visive pensate per attrarre nuovi turisti, far scoprire le meraviglie del territorio e dare valore all'identità locale.",
    audience: "Parchi, comuni, enti turistici, realtà outdoor",
    code: "FAG",
    ticket: { paper: "#e3eae2", ink: "#18241d", accent: "#2f5240", icon: "montagna" },
    video: `${base}/video/natura`,
    stills: `${base}/stills/natura`,
    place: "Forno Alpi Graie, Piemonte",
    coords: [45.364, 7.221],
    shot: { seconds: 14, heading: [340, 262] },
    story: [
      "Le valli alpine hanno un patrimonio che non sta nei musei: l'acqua, i boschi, gli animali che li abitano. Raccontarlo bene significa portare persone che sanno rispettarlo.",
      "Un volo radente lungo il torrente, fino all'incontro con il camoscio: immagini che emozionano e che diventano promozione per tutta la valle, dalle strutture ai sentieri.",
    ],
    production: [
      { label: "Riprese FPV", text: "Volo radente lungo il torrente, fino all'incontro con il camoscio." },
      { label: "Montaggio", text: "Un ritmo che segue l'acqua e il respiro della montagna." },
    ],
  },
];
