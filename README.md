# Sito portfolio pilota di droni

```bash
npm install
cp .env.example .env.local   # RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL, NEXT_PUBLIC_SITE_URL
npm run dev
```

- Segnaposto (nome, email, P. IVA, social, aree di lavoro): `lib/site.ts`
- Immagini bento: imposta `image: "/lavori/xxx.jpg"` nelle voci di `works` e metti i file in `public/lavori/`
- Video hero: `public/hero.mp4` (aggiungi `poster="/hero-poster.webp"` in `components/Hero.tsx`)
- Storia e citazione: `components/Story.tsx`, `components/CtaBanner.tsx`
- Logo clienti: array `clients` in `components/ClientLogos.tsx` (vuoto = non renderizza)
