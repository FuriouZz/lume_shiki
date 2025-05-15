import { merge } from "lume/core/utils/object.ts";

import { bundledLanguagesInfo } from "../../deps.ts";

import shikiAttribute from "../attribute/mod.ts";

export interface Options {
  /**
   * Label position
   * @default "top"
   */
  position?: "top" | "bottom";

  /**
   * Set lang order position
   */
  order?: number;
}

export const defaults: Required<Options> = {
  position: "top",
  order: 1,
};

export default function shikiLang(userOptions?: Options) {
  const options = merge(defaults, userOptions);

  return shikiAttribute({
    ...options,
    attribute: "lang",
    getDefaultValue(el) {
      const className = el.getAttribute("class");
      const match = className?.match(/language-(.+)/);
      if (!match) return;

      const [, lang] = match;

      const info = bundledLanguagesInfo.find(
        (v) => v.id === lang || v.aliases?.includes(lang),
      );
      if (!info) return;

      const names = [info.id, ...(info?.aliases ?? [])].sort(
        (a, b) => a.length - b.length,
      );

      return names[0];
    },
  });
}
