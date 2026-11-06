# Copy completo del sito soulspilot

Documento da rivedere. Ogni blocco indica il file dove si modifica. Le parti tra [parentesi quadre] sono segnaposto da riempire.

## 1. Come è strutturato il sito

Il sito è un **unico viaggio**: sotto tutte le pagine c'è un cielo 3D (nuvole e montagna) che cambia con lo scorrimento, e ogni passaggio tra pagine è una transizione con il disco volante che porta la luce sulla scritta soulspilot.

**Pagine**
1. **Home (/)**: il viaggio. Cielo di apertura con titolo, poi quattro "capitoli" a schermo intero, uno per progetto, ognuno con un video che scorre con lo scroll, la promessa del progetto in basso a sinistra e una carta d'imbarco da cliccare. Chiude con "Dove voliamo adesso?" e quattro porte.
2. **Progetti (/progetti)**: griglia di quattro carte d'imbarco con filtro per settore. Passando il mouse parte il video.
3. **Singolo progetto (/progetti/langhe, noli, residenza, forno-alpi-graie)**: ripresa a tutto schermo con la promessa, poi il racconto con la carta d'imbarco intera (dettagli di produzione e a chi si rivolge), sei fotogrammi, invito a contattarmi e riquadro per il progetto successivo.
4. **Chi sono (/chi-sono)**: il perché, il come, il cosa (Golden Circle), con il link ad aeton.app.
5. **Benefici (/benefici)**: per ogni settore cosa fa il volo e cosa ottiene il cliente, poi tre pacchetti.
6. **Contatti (/contatti)**: calendario Cal.com per prenotare la chiamata di 30 minuti, più la citazione di un cliente.

**Elementi comuni:** barra in alto (logo, Progetti, Chi sono, Benefici, bottone "Entriamo in contatto"), footer "a tenda" verde scuro con la firma grande, schermata di caricamento con il disco volante.

**Logica del messaggio:** prima l'emozione (Home: "Fai vivere il tuo luogo"), poi la prova (Progetti, un settore ciascuno), poi il perché sono io (Chi sono), poi il vantaggio concreto e le formule (Benefici), infine l'azione (una chiamata, sempre la stessa in ogni pagina).

## 2. Elementi comuni

**Barra** (`lib/site.ts`): Progetti · Chi sono · Benefici · bottone **Entriamo in contatto**.

**Schermata di caricamento** (`components/shell/DroneLoader.tsx`): scritta soulspilot che si accende. Durante le transizioni il nome della rotta (es. "Rotta: Progetti") è usato solo per l'accessibilità.

**Footer** (`components/Footer.tsx`):
- Logo soulspilot
- Ogni luogo ha un'anima. *Io la faccio volare.*
- Link: Progetti, Chi sono, Benefici, Contatti
- [email@dominio.it], icone Instagram, YouTube, Vimeo, LinkedIn
- Firma grande: soulspilot
- © 2026 soulspilot · Built with love by myself. *Enjoy.* · P. IVA [00000000000]

**Descrizione per Google e anteprime social** (`lib/site.ts`):
> Riprese aeree e voli FPV per la promozione culturale, l'immobiliare, l'hotellerie e la valorizzazione del territorio. Siti web su misura.

Titolo della home: soulspilot · Riprese aeree con drone

## 3. Home

### Apertura (`components/Hero.tsx`)
# Fai vivere il tuo luogo *prima* ancora che arrivino.

Un volo fluido e immersivo che porta chi guarda dall'alto fin dentro il cuore del luogo. La sensazione viva di esserci già.

Bottone: **Fai un giro** (durante il volo automatico: "In volo, tocca per riprendere i comandi")
Invito a scorrere: *oppure scorri*

### I quattro capitoli (`lib/site.ts`, campi claim e line)
Ogni capitolo mostra: promessa grande in basso a sinistra, descrizione sotto, carta d'imbarco (codice, titolo, luogo, "Imbarcati").

**1. Langhe** (Langhe, Piemonte, categoria: Patrimonio e promozione culturale)

- Promessa: Digitalizza la storia, **rendi immortale** la bellezza.
- Descrizione: Attraversiamo sale espositive, fortezze e monumenti con la delicatezza e la sensibilità del volo FPV. Creiamo racconti visivi capaci di emozionare chi guarda, valorizzare il patrimonio e attrarre nuovi visitatori.

**2. Noli** (Noli, Liguria, categoria: Hotellerie e hospitality)

- Promessa: Aumenta le **prenotazioni dirette** mostrando l'esperienza reale.
- Descrizione: Guida i tuoi futuri ospiti dentro la struttura prima ancora che facciano le valigie. L'impatto emotivo del volo immersivo mostra gli spazi nella loro verità, trasformando il desiderio di soggiorno in prenotazioni sul tuo sito ufficiale.

**3. Residenza** ([Località], Piemonte, categoria: Luxury real estate)

- Promessa: Non mostrare solo una casa. Fai percepire **uno stile di vita**.
- Descrizione: Un percorso guidato e fluido per acquirenti e investitori remoti. Uniamo gli esterni agli interni in una narrazione armoniosa, restituendo la reale continuità degli ambienti e l'esclusività delle rifiniture.

**4. Forno Alpi Graie** (Forno Alpi Graie, Piemonte, categoria: Valorizzazione del territorio)

- Promessa: Emoziona e **valorizza** ogni territorio.
- Descrizione: Raccontiamo ogni luogo e paesaggio in modo innovativo e immersivo. Narrazioni visive pensate per attrarre nuovi turisti, far scoprire le meraviglie del territorio e dare valore all'identità locale.


### Chiusura (`components/LandingEnd.tsx`)
# Dove voliamo *adesso?*

| Porta | Titolo | Testo |
|---|---|---|
| Gate 01 | Progetti | Quattro luoghi, quattro modi di raccontare. |
| Gate 02 | Chi sono | Chi c'è dietro il drone. |
| Gate 03 | Benefici | Cosa cambia per chi accoglie. |
| Gate 04 | Prenota una chiamata | Trenta minuti, quando vuoi tu. |

## 4. Progetti (`app/progetti/page.tsx`)

# Progetti.

Quattro luoghi, quattro settori, un solo modo di lavorare: con calma, dall'alto e da dentro. Passa sopra un progetto per vederlo prendere vita.

Filtri: Tutti · Patrimonio e promozione culturale · Hotellerie e hospitality · Luxury real estate · Valorizzazione del territorio

Le carte riprendono promessa e descrizione dei capitoli della home.

Chiusura: # Facciamo vivere il *prossimo luogo.*  Bottone: **Entriamo in contatto**

## 5. Pagina di ogni progetto (`app/progetti/[slug]/page.tsx`, testi in `lib/site.ts`)

Struttura fissa: ripresa con promessa, poi "Il progetto" con titolo *Dall'alto, [nome]*, racconto in due paragrafi e carta d'imbarco con dettagli di produzione e "Per chi"; poi *Fotogrammi dal volo*; poi *Hai un luogo da raccontare?* con bottone **Entriamo in contatto** e riquadro **Prossimo progetto**. Link in alto: ← Tutti i progetti.

### Langhe

Un territorio ricco di storia rischia di sembrare uguale a tanti altri, se lo si racconta sempre dallo stesso punto di vista. Dall'alto il castello torna a dominare la collina, i filari disegnano il paesaggio e il borgo si legge tutto in un colpo d'occhio.

Il video diventa uno strumento di promozione: per i canali dell'ente, per le fiere, per i social. Mostra il patrimonio con il rispetto che merita e fa venire voglia di venirlo a vedere di persona.

**A bordo (dettagli di produzione):**
- **Riprese aeree**: Movimenti lenti e continui attorno al castello, per dare respiro all'architettura.
- **Montaggio**: Un ritmo calmo, che lascia allo sguardo il tempo di esplorare.

**Per chi:** Musei, fortezze, enti culturali, comuni

### Noli

Chi prenota una vacanza sceglie con il cuore, e poi cerca le conferme. Un racconto dall'alto mette la struttura nel suo contesto: il mare, il borgo, la luce che entra in terrazza a fine giornata.

Sul sito, sui social e nelle piattaforme di prenotazione, il video fa provare all'ospite il soggiorno prima ancora del check-in. È lì che la scelta si fa, ed è lì che conviene essere i più belli.

**A bordo (dettagli di produzione):**
- **Riprese aeree e FPV**: Dalla costa alla struttura, per far capire subito dove ci si trova.
- **Storytelling**: La giornata dell'ospite, dall'arrivo al tramonto.
- **Sound design**: Audio d'ambiente registrato in loco: mare, voci, il suono vero del luogo.

**Per chi:** Hotel, resort, B&B, case vacanza

### Residenza

Le foto mostrano le stanze una alla volta, ma non dicono come si passa dall'una all'altra. Un volo FPV continuo, dall'ingresso fino all'ultima stanza, permette ai possibili acquirenti di fare un tour guidato ancor prima di venire da te.

Arrivano alla visita già convinti, o non arrivano affatto: meno appuntamenti a vuoto, più trattative vere. E un annuncio così eleva l'immagine della tua agenzia, perché si fa ricordare.

**A bordo (dettagli di produzione):**
- **Riprese FPV interne**: Un unico volo continuo che attraversa gli spazi come farebbe una persona.
- **Storytelling**: Il percorso segue la casa come la vivrà chi ci abiterà.
- **Sound design**: Ambiente sonoro e musica che accompagnano la visita.

**Per chi:** Agenzie di pregio, ville e dimore oltre il milione

### Forno Alpi Graie

Le valli alpine hanno un patrimonio che non sta nei musei: l'acqua, i boschi, gli animali che li abitano. Raccontarlo bene significa portare persone che sanno rispettarlo.

Un volo radente lungo il torrente, fino all'incontro con il camoscio: immagini che emozionano e che diventano promozione per tutta la valle, dalle strutture ai sentieri.

**A bordo (dettagli di produzione):**
- **Riprese FPV**: Volo radente lungo il torrente, fino all'incontro con il camoscio.
- **Montaggio**: Un ritmo che segue l'acqua e il respiro della montagna.

**Per chi:** Parchi, comuni, enti turistici, realtà outdoor

## 6. Chi sono (`components/About.tsx`)

Eyebrow: Chi sono
# Volo per far sentire *l'anima* di un luogo.

Sono Gabriele, insegnante di mindfulness, e ogni volo per me è un esercizio di presenza. Porto quella piena consapevolezza in un volo armonioso, perché chi guarda possa provare quello che provo io lassù: il contatto con l'essenza del luogo, non solo la sua immagine. È per questo che faccio questo lavoro.

**Il come**
Con calma, e *ascoltando*.
Prima di volare ascolto te e il luogo: chi lo vive, a chi vuoi arrivare, cosa deve restare a chi guarda. Poi voli lenti e morbidi, un montaggio che respira, un suono che fa sentire il posto.

**Il cosa**
1. **Riprese aeree e FPV ininterrotte**: Territori, fortezze, hotel e dimore di pregio, raccontati dall'alto e da dentro con un unico volo fluido e liscio.
2. **Esperienze web su misura**: L'esperienza non finisce con il video: la prolunghiamo sul web con siti costruiti attorno alle immagini, perché chi arriva continui a vivere il luogo fino alla visita o alla prenotazione.
3. **Presenza e suono d'ambiente**: Il filo di tutto. Prima di volare ascoltiamo il luogo, registrando i suoi suoni naturali sul posto per restituire un'atmosfera acustica e visiva viva e autentica. *Se sei curioso della mindfulness: aeton.app*

Firma a mano: Gabriele · Bottone: **Fai vivere un luogo**
Sul ritratto: "ritratto" (segnaposto per la tua foto), didascalia "presenza · tocca o muovi"

## 7. Benefici (`app/benefici/page.tsx`)

# Benefici.
Un luogo si sceglie prima con le emozioni, poi con la ragione. Il volo immersivo lavora nel momento in cui chi guarda decide.

Per ogni settore: quando decide il cliente · Cosa fa il volo · Cosa ottieni.

**01 Patrimonio e cultura**: *Prima di decidere se partire.*
- Cosa fa il volo: Fa entrare chi guarda in sale, fortezze e monumenti, e accende la curiosità di vederli dal vivo.
- Cosa ottieni: Un racconto per i canali dell'ente, le fiere e i social. Più desiderio di visita e un patrimonio accessibile anche a chi non può venire.

**02 Hotellerie e hospitality**: *Prima di prenotare, mentre confronta le strutture.*
- Cosa fa il volo: Mostra gli spazi nella loro verità e fa vivere l'ospitalità prima ancora del check-in.
- Cosa ottieni: Una ragione in più per scegliere te e prenotare dal tuo sito ufficiale, senza passare dai portali.

**03 Luxury real estate**: *Prima della visita, spesso a distanza.*
- Cosa fa il volo: Un percorso fluido dagli esterni agli interni, che restituisce la continuità degli ambienti e la cura delle rifiniture.
- Cosa ottieni: Acquirenti e investitori che arrivano già convinti, e visite più qualificate.

**04 Valorizzazione del territorio**: *Prima di scegliere la meta.*
- Cosa fa il volo: Racconta paesaggio e identità locale in modo innovativo e immersivo.
- Cosa ottieni: Un contenuto che attrae nuovi visitatori, fa scoprire le meraviglie del luogo e dà valore a chi lo abita.

# Scegli il tuo *pacchetto.*
Tre modi di lavorare insieme: parti dal video, dal sito, o da tutto.

**Pacchetto 01 · Media production**: Video 4K per sito e social
- Riprese aeree d'insieme ad alta risoluzione
- Sorvolo FPV immersivo indoor e outdoor
- Sound design foley e audio d'ambiente registrato in loco
- Master 4K per sito e TV, più tagli 9:16 per Reel e TikTok

**Pacchetto 02 · Sito web su misura**: Riprogettazione e sviluppo, anche in 3D
- Riprogettazione del sito che hai, o uno nuovo da zero
- Sviluppo custom, anche con esperienze 3D
- Il tuo video al centro dell'esperienza
- Modulo di contatto e prenotazione diretta, con notifiche istantanee via e-mail

**Pacchetto 03 · All-in-one** (evidenziato): Video e sito, un unico progetto
- Produzione media completa: video aerei, FPV e audio foley
- Sito custom, anche 3D, costruito attorno alle immagini
- Contatto e prenotazione diretta con notifiche via e-mail
- Un solo interlocutore, dall'idea alla pubblicazione

Ogni pacchetto ha il bottone **Prenota una chiamata**.

## 8. Contatti (`components/Contact.tsx`, `components/CtaBanner.tsx`)

Eyebrow: Contatti
# Fai vivere un *luogo*.
Scegli tu il giorno e l'ora per una chiamata di mezz'ora. Ci sentiamo con calma e ti porto qualche proposta.

Tre passi: 1. Scegli giorno e ora · 2. Raccontami il luogo · 3. Ci sentiamo su Google Meet
Calendario Cal.com (titolo, descrizione e domande si scrivono su Cal.com, non nel sito). Mentre carica: "Carico il calendario".

**Citazione del cliente (segnaposto):** «[Citazione del cliente: due o tre righe su cosa ha provato vedendo il suo luogo dall'alto.]» · [Nome del cliente], [Ruolo, struttura]

## 9. Da riempire

- Email, P. IVA, link social (`lib/site.ts`)
- Località della Residenza (oggi "[Località], Piemonte") e foto/video definitivi
- Citazione e nome del cliente
- Ritratto nella pagina Chi sono
- Titolo, descrizione e domande dell'evento su Cal.com
- Indirizzo del sito (variabile NEXT_PUBLIC_SITE_URL)
