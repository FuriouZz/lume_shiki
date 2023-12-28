import { GetStylesOptions, OnCreateStyleHook, OnTransformerCSSRulesOptions } from "../types.ts";

export {
  transformerNotationHighlight,
  type TransformerNotationHighlightOptions,
} from "../deps.ts";

export const colorsHighlight = {
  light: {
    "highlighted-bg": "rgba(142, 150, 170, .14)",
  },
  dark: {
    "highlighted-bg": "rgba(101, 117, 133, .16)",
  },
};

export const cssRulesHighlight: OnCreateStyleHook = (
  { color, cssVariablePrefix, addColors=true }:
    & GetStylesOptions
    & Partial<OnTransformerCSSRulesOptions>,
) => {
  let css = `
.shiki.has-highlighted .line.highlighted {
  display: inline-block;
  width: 100%;
  margin: 0 -24px;
  padding: 0 24px;
  transition: background-color .5s;
}
.shiki.has-highlighted .line.highlighted {
  background-color: var(${cssVariablePrefix}-highlighted-bg);
}`;

  if (addColors) {
    const colors = color.includes("dark")
      ? colorsHighlight.dark
      : colorsHighlight.light;

    const properties = Object.entries(colors).map(([key, value]) =>
      `${cssVariablePrefix}-${key}: ${value}`
    );
    css += `
.shiki.has-highlighted {
  ${properties.join(";\n  ")};
}`;
  }

  return css;
};
