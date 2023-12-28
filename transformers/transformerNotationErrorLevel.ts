import {
  GetStylesOptions,
  OnCreateStyleHook,
  OnTransformerCSSRulesOptions,
} from "../types.ts";

export {
  transformerNotationErrorLevel,
  type TransformerNotationErrorLevelOptions,
} from "../deps.ts";

export const colorsErrorLevel = {
  light: {
    "highlighted-error-bg": "rgba(244, 63, 94, .14)",
    "highlighted-warning-bg": "rgba(234, 179, 8, .14)",
  },
  dark: {
    "highlighted-error-bg": "rgba(244, 63, 94, .16)",
    "highlighted-warning-bg": "rgba(234, 179, 8, .16)",
  },
};

export const cssRulesErrorLevel: OnCreateStyleHook = (
  { color, cssVariablePrefix, addColors=true }:
    & GetStylesOptions
    & Partial<OnTransformerCSSRulesOptions>,
) => {
  let css = `
.shiki.has-highlighted .line.highlighted.warning {
  background-color: var(${cssVariablePrefix}-highlighted-warning-bg);
}
.shiki.has-highlighted .line.highlighted.error {
  background-color: var(${cssVariablePrefix}-highlighted-error-bg);
}`;

  if (addColors) {
    const colors = color.includes("dark")
      ? colorsErrorLevel.dark
      : colorsErrorLevel.light;

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
