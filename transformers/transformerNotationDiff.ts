import {
  GetStylesOptions,
  OnCreateStyleHook,
  OnTransformerCSSRulesOptions,
} from "../types.ts";

export {
  transformerNotationDiff,
  type TransformerNotationDiffOptions,
} from "../deps.ts";

export const colorsDiff = {
  light: {
    "diff-add": "#3dd68c",
    "diff-add-bg": "rgba(16, 185, 129, .14)",
    "diff-remove": "#cb7676",
    "diff-remove-bg": "rgba(244, 63, 94, .14)",
  },
  dark: {
    "diff-add": "#18794e",
    "diff-add-bg": "rgba(16, 185, 129, .16)",
    "diff-remove": "#b34e52",
    "diff-remove-bg": "rgba(244, 63, 94, .16)",
  },
};

export const cssRulesDiff: OnCreateStyleHook = (
  { color, cssVariablePrefix, addColors=true }:
    & GetStylesOptions
    & Partial<OnTransformerCSSRulesOptions>,
) => {
  let css = `
.shiki.has-diff .line.diff {
  display: inline-block;
  width: 100%;
  margin: 0 -24px;
  padding: 0 24px;
  transition: background-color .5s;
}
.shiki.has-diff .line.diff:before {
  position: absolute;
  left: 10px;
}
.shiki.has-diff .line.diff.add {
  background-color: var(${cssVariablePrefix}-diff-add-bg);
}
.shiki.has-diff .line.diff.add:before {
  content: "+";
  color: var(${cssVariablePrefix}-diff-add);
}
.shiki.has-diff .line.diff.remove {
  background-color: var(${cssVariablePrefix}-diff-remove-bg);
  opacity: 0.7;
}
.shiki.has-diff .line.diff.remove:before {
  content: "-";
  color: var(${cssVariablePrefix}-diff-remove);
}`;

  if (addColors) {
    const colors = color.includes("dark") ? colorsDiff.dark : colorsDiff.light;
    const properties = Object.entries(colors).map(([key, value]) =>
      `${cssVariablePrefix}-${key}: ${value}`
    );

    css += `
.shiki.has-diff {
  ${properties.join(";\n  ")};
}`;
  }

  return css;
};
