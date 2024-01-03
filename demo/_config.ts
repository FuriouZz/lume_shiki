import lume from "lume/mod.ts";

import shikiji from "../mod.ts";
import shikijiExtra from "../extra/mod.ts";

const site = lume();

if (Deno.env.has("SINGLE")) {
  site.use(
    shikiji({
      highlighter: {
        langs: ["javascript"],
        themes: ["github-light"],
      },
      theme: "github-light"
    }),
  );
} else {
  site.use(
    shikiji({
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

site.use(shikijiExtra({ copyFiles: true }));

export default site;
