import {
  CommonOptions,
  MultiThemesOptions,
  Options,
  SingleThemeOptions,
} from "./types.ts";
import {
  getHighlighter,
  Highlighter,
  merge,
  Page,
  ShikijiTransformer,
  Site,
} from "./deps.ts";
import createThemedVariables from "./lib/createThemedVariables.ts";

export { type Options } from "./types.ts";

export const defaults: Required<CommonOptions> = {
  cssFile: false,
  extensions: [".html"],
  extraCSS: "",
  highlighter: {},
  transformers: [],
  cssVariablePrefix: "--shiki-",
  cssThemedVariables: [],
  useColorScheme: false,
};

export const singleThemeDefaults: Required<CommonOptions & SingleThemeOptions> =
  {
    ...defaults,
    highlighter: {
      themes: ["vitesse-light"],
    },
    theme: "vitesse-light",
  };

export const multiThemeDefaults: Required<CommonOptions & MultiThemesOptions> =
  {
    ...defaults,
    highlighter: {
      themes: ["vitesse-light", "vitesse-dark"],
    },
    themes: {
      light: "vitesse-light",
      dark: "vitesse-dark",
    },
    defaultColor: false,
  };

function createPlugin(options: Required<Options>) {
  /**
   * Load highlighter only once
   */
  let highlighter: Highlighter | undefined = undefined;
  const loadHighlighter = () => {
    if (highlighter) return highlighter;
    return getHighlighter(options.highlighter).then((h) => highlighter = h);
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
      if (!sourceCode.textContent) return;

      const sourcePre = sourceCode.parentElement!;
      const className = sourceCode.getAttribute("class")!;
      const [, lang] = className.match(/language-(.+)/)!;

      // deno-lint-ignore no-explicit-any
      const highlighterOptions: any = {
        cssVariablePrefix: options.cssVariablePrefix,
        transformers: options.transformers,
        lang,
        defaultColor: false,
      };

      if ("theme" in options) {
        highlighterOptions.theme = options.theme;
      } else if ("themes" in options) {
        highlighterOptions.themes = options.themes;
      }

      const div = document.createElement("div");
      div.innerHTML = highlighter.codeToHtml(
        sourceCode.textContent,
        highlighterOptions,
      );

      const resultPre = div.querySelector("pre")!;
      const resultCode = div.querySelector("pre code")!;

      sourceCode.innerHTML = resultCode.innerHTML;
      resultPre.getAttributeNames().forEach((name) => {
        sourcePre.setAttribute(name, resultPre.getAttribute(name)!);
      });
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
      Object.keys(options.themes).forEach((color) => {
        extraCSS += createThemedVariables({ ...options, color });
      });
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
      body?.setAttribute("data-color", options.defaultColor);
    }
  };

  return (site: Site) => {
    /**
     * Hook for adding extra transformers
     */
    site.hooks.addShikijiTransformers = (
      transformers: ShikijiTransformer[],
    ) => {
      options.transformers.push(...transformers);
    };

    /**
     * Hook for adding extra css themed variables
     */
    site.hooks.addShikijiCSSThemedVariables = (
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
 * Code highlight plugin using [shikiji](https://shikiji.netlify.app/)
 */
export default function shikiji<Themes extends string = string>(
  options: Options<Themes>,
) {
  if ("themes" in options) {
    return createPlugin(merge(multiThemeDefaults, options));
  }
  return createPlugin(merge(singleThemeDefaults, options));
}
