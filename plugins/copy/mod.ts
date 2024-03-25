import type Site from "lume/core/site.ts";
import { merge } from "lume/core/utils/object.ts";
import { fromFileUrl } from "lume/deps/path.ts";

export interface Options {
  /**
   * Label position
   * @default "top-right"
   */
  position: "top" | "bottom";

  order?: number;

  /**
   * Content of the <button>
   */
  content?: (document: Document) => Node;
}

export const defaults: Required<Options> = {
  position: "top",
  order: 3,
  content: (document) => document.createTextNode(""),
};

export default function shikiCopy(userOptions?: Options) {
  const { position, order, content } = merge(defaults, userOptions);
  const containerSelector = position.includes("top") ? "header" : "footer";

  return (site: Site) => {
    const path = import.meta.resolve("./main.js");
    const scriptContent = Deno.readTextFileSync(fromFileUrl(path));

    site.process([".html"], (pages) => {
      for (const page of pages) {
        const document = page.document;
        if (!document) continue;

        const sources = document.querySelectorAll("pre code[class*=language-]");

        for (const sourceCode of sources) {
          const sourcePre = sourceCode.parentElement;
          const container = sourcePre?.parentElement?.querySelector(containerSelector);
          if (!sourcePre || !container) return;

          const btn = document.createElement("button");
          btn.setAttribute("style", `order: ${order}`);
          btn.setAttribute("class", "copy");
          btn.append(content(document));
          container.append(btn);
        }

        const script = document.createElement("script");
        script.textContent = scriptContent;
        document.head.append(script);
      }
    });
  };
}
