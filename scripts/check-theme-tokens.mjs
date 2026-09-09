/* Fails if a component uses var(--token) that nothing defines. TypeScript
   can't see inside styled-components' template literals, so a typo in a token
   name would otherwise show up only as an invisible element in one theme. */
import { readFileSync, readdirSync } from "node:fs";

const files = [
    ...readdirSync("src/components").map((f) => `src/components/${f}`),
    "src/App.tsx",
    "src/main.tsx",
];
const sources = files.map((f) => [f, readFileSync(f, "utf8")]);
const all = sources.map(([, s]) => s).join("\n");

// Anything assigned anywhere counts as defined: the :root/[data-theme] blocks
// in main.tsx plus per-component locals like --accent, --glow, --hue.
const defined = new Set([...all.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));

const missing = [];
for (const [file, src] of sources) {
    for (const m of src.matchAll(/var\((--[a-z0-9-]+)/g)) {
        if (!defined.has(m[1])) missing.push(`${file}: ${m[1]}`);
    }
}

// Both themes must define the same token set, or one of them has a hole.
const block = (re) =>
    new Set([...(all.match(re)?.[1] ?? "").matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
const light = block(/:root \{([\s\S]*?)\n\}/);
const dark = block(/\[data-theme="dark"\] \{([\s\S]*?)\n\}/);
const lopsided = [...light]
    .filter((t) => !dark.has(t))
    .concat([...dark].filter((t) => !light.has(t)));

/* A var() inside a custom property resolves against the element that DECLARES
   it, so the derived --*-ink colours must be declared in the same file that
   sets the --accent / --glow they read — never on :root, where those don't
   exist and the whole declaration would compute to invalid. */
const stranded = [];
for (const [file, src] of sources) {
    for (const m of src.matchAll(/var\((--[a-z-]+-ink)\)/g)) {
        if (!new RegExp(`${m[1]}\s*:`).test(src)) stranded.push(`${file}: ${m[1]}`);
    }
}

if (missing.length || lopsided.length || stranded.length) {
    if (missing.length) console.error("Undefined tokens:\n  " + missing.join("\n  "));
    if (lopsided.length) console.error("Defined in only one theme:\n  " + lopsided.join("\n  "));
    if (stranded.length)
        console.error("Derived ink used without a local declaration:\n  " + stranded.join("\n  "));
    process.exit(1);
}
console.log(
    `ok — ${light.size} tokens, both themes complete; ${defined.size} custom properties total`,
);
