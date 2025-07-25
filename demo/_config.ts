import lume from "lume/mod.ts";

import shiki from "../mod.ts";

import attribute from "../plugins/attribute/mod.ts";
import copy from "../plugins/copy/mod.ts";
import css from "../plugins/css/mod.ts";
import lang from "../plugins/lang/mod.ts";

import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerRenderWhitespace,
} from "npm:@shikijs/transformers@3.8.1";

const site = lume();

if (Deno.env.has("SINGLE")) {
  site.use(
    shiki({
      highlighter: {
        langs: ["javascript"],
        themes: ["github-light"],
      },
      theme: "github-light",
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
      cssThemedVariables: ["border-color"],
      extraCSS: `
:root {
  --shiki-dark-border-color: #ffaa22;
  --shiki-light-border-color: #0088ff;
}

.shiki {
  border: 5px var(--shiki-border-color) solid;
}
`,
    }),
  );
}

site
  .use((site) => {
    site.hooks.addShikiTransformers([
      transformerNotationDiff(),
      transformerNotationErrorLevel(),
      transformerNotationFocus(),
      transformerNotationHighlight(),
      transformerRenderWhitespace(),
    ]);
  })
  .use(css())
  .use(
    attribute({
      attribute: "label",
      format: (value, d) => {
        const b = d.createElement("b");
        b.textContent = "title:";

        const span = d.createElement("span");
        span.setAttribute("style", "display: inline-block; padding-left: 2px;");
        span.textContent = value;

        return [b, span];
      },
    }),
  )
  .use(lang())
  .use(copy());

export default site;
