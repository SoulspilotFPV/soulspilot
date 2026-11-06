"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useShell, type ExpandFrom } from "./ShellContext";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  /** nome della rotta, per il regista delle transizioni */
  label?: string;
  /** se presente, invece del drone l'elemento si allarga a tutto schermo */
  expand?: (el: HTMLElement) => ExpandFrom | undefined;
};

/** Link interno che passa dal regista delle transizioni. Cmd/Ctrl/clic centrale funzionano come sempre. */
export default function TransitionLink({ href, label, expand, onClick, ...rest }: Props) {
  const { navigate } = useShell();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate(href, { label, expandFrom: expand?.(e.currentTarget) });
  };
  return <Link href={href} onClick={handle} {...rest} />;
}
