import lume from "https://deno.land/x/lume@v2.0.1/mod.ts";
import shikiji from "../mod.ts";

import {
  cssRulesDiff,
  cssRulesErrorLevel,
  cssRulesFocus,
  cssRulesHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "../transformers/mod.ts";

const site = lume();

if (Deno.env.has("SINGLE")) {
  site.use(
    shikiji({
      highlighter: {
        langs: ["javascript"],
        themes: ["github-light"],
      },

      theme: "github-light",

      themeStyles: [
        cssRulesDiff,
        cssRulesErrorLevel,
        cssRulesFocus,
        cssRulesHighlight,
      ],

      transformers: [
        transformerNotationDiff(),
        transformerNotationErrorLevel(),
        transformerNotationFocus(),
        transformerNotationHighlight(),
      ],
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

      cssFile: "/shikiji.css",

      themeStyles: [
        cssRulesDiff,
        cssRulesErrorLevel,
        cssRulesFocus,
        cssRulesHighlight,
      ],

      transformers: [
        transformerNotationDiff(),
        transformerNotationErrorLevel(),
        transformerNotationFocus(),
        transformerNotationHighlight(),
      ],
    }),
  );
}

export default site;
