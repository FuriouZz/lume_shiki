import type Site from "lume/core/site.ts";
import { merge } from "lume/core/utils/object.ts";

export interface Options {
  /**
   * HTML attribute to use for labeling
   * @default "label"
   */
  attribute?: string;

  /**
   * Label format
   */
  format?: (
    value: string,
    document: Document,
  ) => Node | string | (Node | string)[];

  /**
   * Label position
   * @default "top"
   */
  position?: "top" | "bottom";

  /**
   * Get default attribute value when not specified
   */
  getDefaultValue?: (el: Element, document: Document) => string | undefined;

  /**
   * attribre order position
   */
  order?: number;
}

export const defaults: Required<Options> = {
  attribute: "label",
  format: (v, document) => document.createTextNode(v),
  position: "top",
  order: 2,
  getDefaultValue: () => undefined,
};

export default function shikiAttribute(userOptions?: Options) {
  const { attribute, format, position, order, getDefaultValue } = merge(
    defaults,
    userOptions,
  );
  const containerSelector = position.includes("top") ? "header" : "footer";

  return (site: Site) => {
    site.process([".html"], (pages) => {
      for (const page of pages) {
        const document = page.document;
        if (!document) continue;

        const sources = document.querySelectorAll("pre code[class*=language-]");

        for (const sourceCode of sources) {
          const sourcePre = sourceCode.parentElement;
          const className = sourceCode.getAttribute("class");
          const container = sourcePre?.parentElement?.querySelector(
            containerSelector,
          );
          if (!className || !sourcePre || !container) return;

          const value = sourceCode.getAttribute(attribute) ||
            getDefaultValue(sourceCode, document);
          if (!value) continue;

          sourceCode.removeAttribute(attribute);

          const el = document.createElement("div");
          el.setAttribute("style", `order: ${order}`);
          el.setAttribute("class", `attribute-${attribute}`);
          el.append(...[format(value, document)].flat());

          container.append(el);
        }
      }
    });
  };
}
