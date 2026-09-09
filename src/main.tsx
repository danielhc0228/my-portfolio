import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import CursorGlow from "./components/CursorGlow.tsx";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
body {
  line-height: 1;
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
* {
  box-sizing: border-box;
}

/* ---- theme tokens -------------------------------------------------------
   Light is the default (bare :root); dark is opt-in via data-theme="dark" on
   <html>, set by ThemeToggle and re-applied pre-paint by the script in
   index.html. Dark values are the site's original hard-coded colours, so
   dark mode renders exactly as it did before the theme existed.

   --fg is an "r, g, b" triple rather than a colour, because the whole codebase
   tints with rgba(255, 255, 255, a) at ~40 different alphas; making the triple
   the token flips every one of them at once.                              */
:root {
  --bg: #f4f4f6;            /* page */
  --bg-grad-top: #ffffff;   /* top stop of the hero/loader gradient */
  --surface: #ffffff;       /* raised cards, panels, modals */
  --text: #16161a;
  --fg: 22, 22, 30;         /* triple behind every rgba(var(--fg), a) tint */
  --field-bg: rgba(22, 22, 30, 0.04);
  --field-bg-focus: rgba(22, 22, 30, 0.07);
  --header-bg: rgba(255, 255, 255, 0.72);
  --panel-bg: rgba(255, 255, 255, 0.94);
  --focus: #0b63c5;
  --hint: #8a6a00;          /* Projects' scroll cue */
  --hint-alt: #5f6d00;      /* Me's flip cue */
  --ok: #0f8a52;
  --warn: #a86400;
  --danger: #c62828;
  --avatar-l: 32%;          /* lightness of the comment avatar's initial */
  --glow-blend: multiply;   /* cursor trail: darkens on light, see canvas rule */

  /* The per-card --accent / per-skill --glow triples are pastels picked for a
     dark page; as *text* on white they're unreadable. How far to darken them
     lives here, but the derived --accent-ink / --glow-ink colours are declared
     next to each --accent / --glow, because a var() inside a custom property
     resolves against the element that DECLARES it — putting them here would
     resolve --accent on :root, where it doesn't exist. */
  --ink-mix: 55%;
}

[data-theme="dark"] {
  --bg: #0d0d0d;
  --bg-grad-top: #1a1a1a;
  --surface: #121218;
  --text: #ffffff;
  --fg: 255, 255, 255;
  --field-bg: rgba(0, 0, 0, 0.35);
  --field-bg-focus: rgba(0, 0, 0, 0.5);
  --header-bg: rgba(13, 13, 13, 0.72);
  --panel-bg: rgba(13, 13, 13, 0.92);
  --focus: #8ad4ff;
  --hint: rgb(255, 234, 0);
  --hint-alt: rgb(186, 214, 0);
  --ok: rgb(120, 230, 170);
  --warn: rgb(255, 196, 88);
  --danger: rgb(255, 107, 107);
  --avatar-l: 80%;
  --glow-blend: normal;
  --ink-mix: 0%; /* dark keeps the accents exactly as they were */
}

/* The only canvas on the page is CursorGlow. Its trail is drawn in bright
   hsla() tuned for a black page; multiply keeps the same hues readable on a
   light one without duplicating the paint code. */
canvas {
  mix-blend-mode: var(--glow-blend);
}

body {
  font-weight: 300;
  /* San Francisco. -apple-system / BlinkMacSystemFont are the only legal way
     to reach it on the web — Apple doesn't license SF for redistribution — so
     the named entries catch anyone who has SF Pro installed locally, and the
     rest is the platform fallback chain. */
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: var(--text);
  line-height: 1.2;
  background-color: var(--bg);
  transition: background-color 0.3s ease, color 0.3s ease;
}
html {
  /* Keeps overscroll past the top/bottom of the page on-theme. */
  background-color: var(--bg);
}
a {
  text-decoration:none;
  color:inherit;
}

::-webkit-scrollbar {
display: none;
}
`;

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <GlobalStyle />
        <CursorGlow />
        <App />
    </StrictMode>
);
