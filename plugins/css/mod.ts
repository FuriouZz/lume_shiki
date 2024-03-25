import type Site from "lume/core/site.ts";
import { merge } from "lume/core/utils/object.ts";

const files = [
  "main",
  "transformerNotationDiff",
  "transformerNotationErrorLevel",
  "transformerNotationFocus",
  "transformerNotationHighlight",
  "transformerRenderWhitespace",
] as const;

export type Options = {
  includes?: Partial<Record<(typeof files)[number], boolean>>;

  /**
   * Base directory of CSS files
   * Must ends with "/"
   * @default "styles/shiki/"
   */
  baseDir?: string;
};

export const defaults: Required<Options> = {
  includes: Object.fromEntries(files.map((v) => [v, true])) as Required<Options>['includes'],
  baseDir: "styles/shiki/",
};

export default function shikiCSS(userOptions?: Options) {
  const options = merge(defaults, userOptions);

  if (!options.baseDir.endsWith("/")) {
    options.baseDir = `${options.baseDir}/`;
  }

  return (site: Site) => {
    const files = Object.entries(options.includes)
      .filter(([, enabled]) => enabled)
      .map(([file]) => {
        const path = `${defaults.baseDir}${file}.css`;
        site.remoteFile(path, import.meta.resolve(`./styles/${file}.css`));
        site.copy(path);
        return path;
      });

    site.hooks.addShikiCSSThemedVariables([
      "diff-add",
      "diff-add-bg",
      "diff-remove",
      "diff-remove-bg",
      "highlighted-bg",
      "highlighted-warning-bg",
      "highlighted-error-bg",
    ]);

    site.process([".html"], (pages) => {
      for (const page of pages) {
        const style = page.document?.createElement("style");
        if (!style) continue;
        style.textContent = files.map((v) => `@import "${v}";`).join("\n");
        page.document?.head.append(style);
      }
    });
  };
}
