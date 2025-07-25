import type { Page } from "lume/core/file.ts";
import type Site from "lume/core/site.ts";
import type { Plugin } from "lume/core/site.ts";
import { merge } from "lume/core/utils/object.ts";

import type {
  CommonOptions,
  MultiThemesOptions,
  Options,
  SingleThemeOptions,
} from "./types.ts";

import {
  bundledLanguages,
  type CodeToHastOptions,
  createHighlighter,
  type Highlighter,
  type ShikiTransformer,
} from "./deps.ts";

import createThemedVariables from "./lib/createThemedVariables.ts";

export type { Options } from "./types.ts";

export const defaults: Required<CommonOptions> = {
  cssFile: false,
  extensions: [".html"],
  extraCSS: "",
  highlighter: {
    themes: ["vitesse-light"],
    langs: Object.keys(bundledLanguages),
  },
  transformers: [],
  cssVariablePrefix: "--shiki-",
  cssThemedVariables: [],
  useColorScheme: false,
  colorAttribute: "data-color"
};

export const singleThemeDefaults: Required<CommonOptions & SingleThemeOptions> =
  {
    ...defaults,
    highlighter: {
      themes: ["vitesse-light"],
      langs: Object.keys(bundledLanguages),
    },
    theme: "vitesse-light",
  };

export const multiThemeDefaults: Required<CommonOptions & MultiThemesOptions> =
  {
    ...defaults,
    highlighter: {
      themes: ["vitesse-light", "vitesse-dark"],
      langs: Object.keys(bundledLanguages),
    },
    themes: {
      light: "vitesse-light",
      dark: "vitesse-dark",
    },
    defaultColor: false,
  };

// Singleton
let shikiPromise: Promise<Highlighter> | null = null;

function createPlugin(options: Required<Options>): Plugin {
  /**
   * Create/Load highlighter only once
   */
  const loadHighlighter = () => {
    if (!shikiPromise) {
      shikiPromise = createHighlighter(options.highlighter);
    }
    return shikiPromise;
  };

  /**
   * Highlight code
   * Steps:
   * - We only highlight code with "pre code[class*=language-]" selector
   * - The language is extracted from css class
   * - We create a temporary `div` element and output highlighted code
   * - We replace <code> connect
   * - We transfer <pre> attributes
   */
  const highlight = async (page: Page) => {
    const { document } = page;
    if (!document) return;

    const highlighter = await loadHighlighter();
    const sources = document.querySelectorAll("pre code[class*=language-]");
    for (const sourceCode of sources) {
      if (!sourceCode.textContent) continue;

      const sourcePre = sourceCode.parentElement;
      const className = sourceCode.getAttribute("class");
      if (!className || !sourcePre) continue;

      const match = className.match(/language-(.+)/);
      if (!match) continue;

      const [, lang] = match;

      const highlighterOptions: unknown = {
        cssVariablePrefix: options.cssVariablePrefix,
        transformers: options.transformers,
        lang,
        defaultColor: false,
      };

      if ("theme" in options) {
        (highlighterOptions as { theme: unknown }).theme = options.theme;
      } else if ("themes" in options) {
        (highlighterOptions as { themes: unknown }).themes = options.themes;
      }

      const div = document.createElement("div");
      div.innerHTML = highlighter.codeToHtml(
        sourceCode.textContent,
        highlighterOptions as unknown as CodeToHastOptions,
      );

      const resultPre = div.querySelector("pre");
      const resultCode = div.querySelector("pre code");

      if (resultCode && resultPre) {
        sourceCode.innerHTML = resultCode.innerHTML;

        for (const name of resultPre.getAttributeNames()) {
          sourcePre.setAttribute(name, resultPre.getAttribute(name) ?? "");
        }
      }

      const wrapper = document.createElement("div");
      wrapper.setAttribute("class", "code-block");
      sourcePre.replaceWith(wrapper);
      wrapper.append(sourcePre);

      wrapper.prepend(document.createElement("header"));
      wrapper.append(document.createElement("footer"));
    }
  };

  /**
   * Inject CSS to the page
   * Steps:
   * - Generate CSS variables based on theme color
   * - Create a CSS file or inline CSS into a <style> tag
   */
  const injectCSS = async (page: Page, site: Site) => {
    let extraCSS = options.extraCSS;

    if ("theme" in options) {
      extraCSS += createThemedVariables({ ...options, color: undefined });
    } else if ("themes" in options) {
      for (const color of Object.keys(options.themes)) {
        extraCSS += createThemedVariables({ ...options, color });
      }
    }

    if (options.cssFile) {
      const output = await site.getOrCreatePage(options.cssFile);
      if (output.content) {
        output.content += extraCSS;
      } else {
        output.content = extraCSS;
      }
    } else {
      const style = page.document?.createElement("style");
      if (!style) return;
      style.textContent = extraCSS;
      page.document?.head.append(style);
    }
  };

  /**
   * Add data-color attribute to document body
   */
  const setDefaultColor = (page: Page) => {
    if ("defaultColor" in options && options.defaultColor) {
      const body = page.document?.querySelector("body");
      body?.setAttribute(options.colorAttribute, options.defaultColor);
    }
  };

  return (site: Site) => {
    /**
     * Hook for adding extra transformers
     */
    site.hooks.addShikiTransformers = (transformers: ShikiTransformer[]) => {
      options.transformers.push(...transformers);
    };

    /**
     * Hook for adding extra css themed variables
     */
    site.hooks.addShikiCSSThemedVariables = (
      variables: Required<CommonOptions>["cssThemedVariables"],
    ) => {
      options.cssThemedVariables.push(...variables);
    };

    /**
     * Process page which require code highlight
     */
    site.process(options.extensions, async (pages) => {
      const promises = pages.map(async (page) => {
        await highlight(page);
        await injectCSS(page, site);
        setDefaultColor(page);
      });
      await Promise.all(promises);
    });
  };
}

/**
 * Code highlight plugin using [shiki](https://shiki.style/)
 */
export default function shiki<Themes extends string = string>(
  options: Options<Themes>,
) {
  if ("themes" in options) {
    return createPlugin(merge(multiThemeDefaults, options));
  }
  return createPlugin(merge(singleThemeDefaults, options));
}
