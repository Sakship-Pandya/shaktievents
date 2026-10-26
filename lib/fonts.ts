import { Fraunces, Manrope, Noto_Sans_Gujarati } from 'next/font/google';

/**
 * Static 400 and 500 instances rather than the variable face.
 *
 * The variable Fraunces with its opsz and SOFT axes is a 118 KB download and
 * it is the LCP element on every page — on 4G that was costing more than the
 * optical-size refinement was worth. Only these two weights are used anywhere
 * in the design.
 */
export const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-fraunces',
  display: 'swap',
  // Not preloaded: the headline is the LCP element, and with display: swap it
  // paints immediately in the size-adjusted fallback. Preloading the real face
  // only puts it in front of the HTML on a slow connection.
  preload: false,
});

export const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

// Gujarati faces are only referenced by CSS when <html lang="gu">, so they are
// never downloaded on English pages. preload is off to avoid preloading them
// on every route.
/**
 * The single Gujarati face, used for both headings and body on /gu.
 *
 * The design originally paired Mukta Vaani for display with Noto for body.
 * Two Gujarati families came to 343 KB across eight files, which on 4G cost
 * far more than the typographic distinction was worth. One variable family
 * covers every weight the design uses in a single request.
 *
 * Latin characters on a Gujarati page — numerals, "WhatsApp", "DJ" — fall
 * through to Fraunces and Manrope, which are already loaded.
 */
export const notoSansGujarati = Noto_Sans_Gujarati({
  subsets: ['gujarati'],
  variable: '--font-noto-gujarati',
  display: 'swap',
  preload: false,
});

export const fontVariables = [fraunces.variable, manrope.variable, notoSansGujarati.variable].join(
  ' ',
);
