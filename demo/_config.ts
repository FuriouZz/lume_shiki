import lume from "lume/mod.ts";

import shiki from "../mod.ts";
import shikiExtra from "../extra/mod.ts";

const site = lume();

if (Deno.env.has("SINGLE")) {
  site.use(
    shiki({
      highlighter: {
        langs: ["javascript"],
        themes: ["github-light"],
      },
      theme: "github-light"
    }),
  );
} else {
  site.use(
    shiki({
      highlighter: {
        langs: ["javascript"],
        themes: ["github-dark", "github-light"],
      },
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: "light",
      cssThemedVariables: [
        "border-color",
      ],
      extraCSS: `
:root {
  --shiki-dark-border-color: #ffaa22;
  --shiki-light-border-color: #0088ff;
}

.shiki {
  border: 5px var(--shiki-border-color) solid;
}
`
    }),
  );
}

site.use(shikiExtra({ copyFiles: true }));

export default site;
