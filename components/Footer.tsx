import Logo from "./Logo";
import { nav, navCta, site, whatsappHref } from "@/lib/site";
import TransitionLink from "./shell/TransitionLink";

const socialIcons: Record<string, React.ReactNode> = {
  Instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.8" cy="7.2" r=".6" fill="currentColor" />
    </>
  ),
  YouTube: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="4" />
      <path d="m10.5 9.5 4 2.5-4 2.5z" fill="currentColor" />
    </>
  ),
  Vimeo: <path d="M4 9.5c2-1.6 3-2 3.6-.4l1 4.4c.5 2 1.2 3 2 3 1.2 0 3-2 4.6-5 .8-1.6.2-2.8-1.2-2.4 1.4-3.4 5.2-2.6 5 .6-.2 3.4-3.8 8.4-6.8 8.4-1.8 0-2.6-1.8-3.2-4-.5-1.8-.8-3.4-1.4-3.4-.4 0-1.2.6-2 1.2" />,
  LinkedIn: (
    <>
      <path d="M7 10v7M7 7v.01M11 17v-4.5a2.5 2.5 0 0 1 5 0V17M11 10v7" />
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
    </>
  ),
};

/** La tenda finale: verdone scuro, la chiusura del viaggio. */
export default function Footer() {
  return (
    <footer className="bg-[#1c3227] px-6 pb-6 pt-10 text-white md:rounded-t-[56px] md:px-12 md:pb-8 md:pt-20">
      <div className="mx-auto max-w-page">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:flex md:flex-row md:justify-between md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Logo light />
            <p className="mt-4 max-w-[24ch] text-[22px] md:mt-5 md:max-w-[20ch] md:text-[26px] font-medium leading-tight tracking-tight text-white/85">
              Ogni luogo ha un&apos;anima. <span className="accent">Io la faccio volare.</span>
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-col gap-1.5 md:gap-2">
              {[...nav, { label: navCta.label, href: navCta.href }].map((n) => (
                <li key={n.href}>
                  <TransitionLink href={n.href} label={`Rotta: ${n.label}`} className="text-[15px] text-white/70 transition-colors duration-300 hover:text-white">
                    {n.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-4 md:gap-5">
            {whatsappHref && (
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-[15px] font-medium text-white/90 transition-colors duration-300 hover:text-verde-chiaro">
                WhatsApp
              </a>
            )}
            {site.email && (
              <a href={`mailto:${site.email}`} className="text-[15px] font-medium text-white/90 transition-colors duration-300 hover:text-verde-chiaro">
                {site.email}
              </a>
            )}
            {Object.keys(site.social).length > 0 && (
              <ul className="grid w-fit grid-cols-2 gap-2.5 md:flex md:gap-3">
                {Object.entries(site.social).map(([name, href]) => (
                  <li key={name}>
                    <a
                      href={href}
                      aria-label={name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#1c3227]"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        {socialIcons[name]}
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* firma grande in fondo alla tenda */}
        <p aria-hidden className="mt-8 select-none md:mt-14 text-center text-[clamp(64px,15vw,220px)] font-semibold leading-[0.85] tracking-[-0.06em] text-white/[0.1]">
          souls<span className="accent">pilot</span>
        </p>
        <hr className="mb-4 mt-6 border-white/10 md:mb-6 md:mt-8" />
        <p className="flex flex-col items-center gap-1 text-center md:gap-2 font-mono text-[12px] text-white/45 sm:flex-row sm:justify-between sm:text-left">
          <span>
            © {new Date().getFullYear()} {site.brand}
          </span>
          <span className="order-last sm:order-none">
            Built with love by myself. <span className="text-verde-chiaro">Enjoy.</span>
          </span>
          {site.vat ? <span>{site.vat}</span> : <span aria-hidden className="hidden sm:inline" />}
        </p>
      </div>
    </footer>
  );
}
