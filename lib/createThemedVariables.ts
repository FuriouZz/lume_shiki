import { CreateThemedVariablesOptions } from "../types.ts";

const MODE_REG = /^dark|light$/;

export default function createThemedVariables(
  options?: CreateThemedVariablesOptions,
) {
  const {
    color = "",
    cssVariablePrefix = "--shiki-",
    cssThemedVariables = [],
    useColorScheme = false,
  } = options ?? {};

  const variables = cssThemedVariables.map((v) => {
    const defaultColor = color || "light";
    const [variable, defaultValue] = Array.isArray(v) ? v : [v, "inherit"];
    return `${cssVariablePrefix}${variable}: var(${cssVariablePrefix}${defaultColor}-${variable}, ${defaultValue})`;
  })

  let css = `.shiki {
  ${variables.join(";\n  ")};
}`;

  if (useColorScheme && MODE_REG.test(color)) {
    css = `@media (prefers-color-scheme: ${color}) {\n${css}\n}`;
  } else if (color) {
    css = `
.shiki {
  background-color: var(${cssVariablePrefix}${color}-bg);
}
.shiki span {
  color: var(${cssVariablePrefix}${color});
}
${css}`;

    css = css.replaceAll(".shiki", `[data-color=${color}] .shiki`);
  }

  return css;
}
