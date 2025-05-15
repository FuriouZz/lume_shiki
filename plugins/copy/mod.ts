import type Site from "lume/core/site.ts";
import { merge } from "lume/core/utils/object.ts";
import { insertToHead } from "../../lib/utils.ts";

export interface Options {
  /**
   * Label position
   * @default "top"
   */
  position?: "top" | "bottom";

  /**
   * Icon order position
   */
  order?: number;

  /**
   * Content of the <button>
   */
  content?: (document: Document) => Node | string | (Node | string)[];

  /**
   * Override script from copy.js
   */
  scriptPath?: string;

  /**
   * Base directory of CSS files
   * Must ends with "/"
   * @default "/scripts/shiki/"
   */
  baseDir?: string;
}

export const defaults: Required<Options> = {
  position: "top",
  order: 3,
  content: (document) => document.createTextNode(""),
  scriptPath: import.meta.resolve("./main.js"),
  baseDir: "/scripts/shiki/",
};

export default function shikiCopy(userOptions?: Options) {
  const { position, order, content, scriptPath, ...options } = merge(
    defaults,
    userOptions
  );
  const containerSelector = position.includes("top") ? "header" : "footer";

  if (!options.baseDir.startsWith("/")) {
    options.baseDir = `/${options.baseDir}`;
  }

  if (!options.baseDir.endsWith("/")) {
    options.baseDir = `${options.baseDir}/`;
  }

  return (site: Site) => {
    const path = `${options.baseDir}copy.js`;
    site.remoteFile(path, scriptPath);
    site.copy(path);

    site.process([".html"], (pages) => {
      for (const { document } of pages) {
        const sources = document.querySelectorAll("pre code[class*=language-]");

        for (const sourceCode of sources) {
          const sourcePre = sourceCode.parentElement;
          const container =
            sourcePre?.parentElement?.querySelector(containerSelector);
          if (!sourcePre || !container) return;

          const btn = document.createElement("button");
          btn.setAttribute("style", `order: ${order}`);
          btn.setAttribute("class", "copy");
          btn.append(...[content(document)].flat());
          container.append(btn);
        }

        const script = document.createElement("script");
        script.setAttribute("src", path);
        insertToHead(document, script);
      }
    });
  };
}
