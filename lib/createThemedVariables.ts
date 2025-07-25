import type { CreateThemedVariablesOptions } from "../types.ts";

const MODE_REG = /^dark|light$/;

export default function createThemedVariables(
  options?: CreateThemedVariablesOptions,
) {
  const {
    color = "",
    colorAttribute = "data-color",
    cssVariablePrefix = "--shiki-",
    cssThemedVariables = [],
    useColorScheme = false,
  } = options ?? {};

  const variables = cssThemedVariables.map((v) => {
    const defaultColor = color || "light";
    const [variable, defaultValue] = Array.isArray(v) ? v : [v, "inherit"];
    return `${cssVariablePrefix}${variable}: var(${cssVariablePrefix}${defaultColor}-${variable}, ${defaultValue})`;
  });

  let css = `.shiki {
  ${variables.join(";\n  ")};
}`;

  if (color) {
    css = `
.shiki {
  background-color: var(${cssVariablePrefix}${color}-bg);
}
.shiki span {
  color: var(${cssVariablePrefix}${color});
}
${css}`;
  }

  if (useColorScheme && MODE_REG.test(color)) {
    css = `@media (prefers-color-scheme: ${color}) {\n${css}\n}`;
  } else if (color) {
    css = css.replaceAll(".shiki", `[${colorAttribute}=${color}] .shiki`);
  }

  return css;
}
