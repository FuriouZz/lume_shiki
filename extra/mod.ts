import { merge } from "lume/core/utils/object.ts";
import Site from "lume/core/site.ts";

import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "./deps.ts";
import { ExtraOptions } from "../types.ts";

export type Options = ExtraOptions;

export const defaults: Required<ExtraOptions> = {
  copyFiles: false,
  baseDir: "styles/shiki-extra/",
};

export default function shikiExtra(userOptions?: ExtraOptions) {
  const options = merge(defaults, userOptions);

  if (!options.baseDir.endsWith("/")) {
    throw new Error(`baseDir must ends with "/"`);
  }

  return (site: Site) => {
    const files = [
      "styles/main.css",
      "styles/transformerNotationDiff.css",
      "styles/transformerNotationErrorLevel.css",
      "styles/transformerNotationFocus.css",
      "styles/transformerNotationHighlight.css",
    ];

    for (const file of files) {
      site.remoteFile(
        file.replace("styles/", defaults.baseDir),
        import.meta.resolve(`./${file}`),
      );
    }

    if (options.copyFiles) {
      site.copy(defaults.baseDir);
    }

    site.hooks.addShikiTransformers([
      transformerNotationDiff(),
      transformerNotationErrorLevel(),
      transformerNotationFocus(),
      transformerNotationHighlight(),
    ]);

    site.hooks.addShikiCSSThemedVariables([
      "diff-add",
      "diff-add-bg",
      "diff-remove",
      "diff-remove-bg",
      "highlighted-bg",
      "highlighted-warning-bg",
      "highlighted-error-bg",
    ]);
  };
}
