import { merge, Site } from "../deps.ts";

import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "npm:shikiji-transformers@0.9.10";
import { ExtraOptions } from "../types.ts";

export type Options = ExtraOptions;

export const defaults: Required<ExtraOptions> = {
  copyFiles: false,
  baseDir: "styles/shikiji-extra/",
};

export default function shikijiExtra(userOptions?: ExtraOptions) {
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

    site.hooks.addShikijiTransformers([
      transformerNotationDiff(),
      transformerNotationErrorLevel(),
      transformerNotationFocus(),
      transformerNotationHighlight(),
    ]);

    site.hooks.addShikijiCSSThemedVariables([
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
