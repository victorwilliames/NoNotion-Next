import type { SVGProps } from "react";

/**
 * Ícones de view do Notion, extraídos de `@notion-kit/icons` 1.2.0
 * (o pacote usa exports lazy que o Turbopack não resolve em build;
 * os paths são idênticos aos do kit).
 */
function base(props: SVGProps<SVGSVGElement>, d: string) {
  return (
    <svg
      aria-hidden
      role="graphics-symbol"
      viewBox="0 0 20 20"
      fill="currentColor"
      {...props}
    >
      <path d={d} />
    </svg>
  );
}

export function ViewTableIcon(props: SVGProps<SVGSVGElement>) {
  return base(
    props,
    "M4.5 4.125A2.125 2.125 0 0 0 2.375 6.25v7.5c0 1.174.951 2.125 2.125 2.125h11a2.125 2.125 0 0 0 2.125-2.125v-7.5A2.125 2.125 0 0 0 15.5 4.125zm11.875 7h-5.75v-2.25h5.75zm-5.75 1.25h5.75v1.375a.875.875 0 0 1-.875.875h-4.875zm-1.25-1.25h-5.75v-2.25h5.75zm-5.75 1.25h5.75v2.25H4.5a.875.875 0 0 1-.875-.875zm0-4.75V6.25c0-.483.392-.875.875-.875h4.875v2.25zm7 0v-2.25H15.5c.483 0 .875.392.875.875v1.375z",
  );
}

export function ViewBoardIcon(props: SVGProps<SVGSVGElement>) {
  return base(
    props,
    "M2.375 6.25c0-1.174.951-2.125 2.125-2.125h11c1.174 0 2.125.951 2.125 2.125v7.5a2.125 2.125 0 0 1-2.125 2.125h-11a2.125 2.125 0 0 1-2.125-2.125zm10.584 8.375H15.5a.875.875 0 0 0 .875-.875v-7.5a.875.875 0 0 0-.875-.875h-2.541zm-1.25-9.25H8.292v9.25h3.417zm-7.209 0a.875.875 0 0 0-.875.875v7.5c0 .483.392.875.875.875h2.542v-9.25z",
  );
}
