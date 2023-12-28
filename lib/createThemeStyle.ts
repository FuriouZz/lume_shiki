import { CreateThemeStyleOptions, OnCreateStyleHook } from "../types.ts";

const MODE_REG = /^dark|light$/;

const cssRulesBase: OnCreateStyleHook = (
  { cssVariablePrefix },
) => {
  return `
.shiki {
  background-color: var(${cssVariablePrefix}-bg);
}
.shiki span {
  color: var(${cssVariablePrefix});
}`;
};

export default function createThemeStyle(
  options?: CreateThemeStyleOptions,
) {
  const {
    color = "",
    cssVariablePrefix = "--shiki-",
    themeStyles = [],
    useColorScheme = false,
  } = options ?? {};

  let _cssVariablePrefix = cssVariablePrefix;
  if (color) _cssVariablePrefix += color;

  let css = [cssRulesBase, ...themeStyles].map((createStyle) => {
    return createStyle({ color, cssVariablePrefix: _cssVariablePrefix });
  }).join("");

  if (useColorScheme && MODE_REG.test(color)) {
    css = `@media (prefers-color-scheme: ${color}) {\n${css}\n}`;
  } else if (color) {
    css = css.replaceAll(".shiki", `[data-color=${color}] .shiki`);
  }

  return css;
}
