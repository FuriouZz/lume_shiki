import {
  CommonOptions,
  MultiThemesOptions,
  Options,
  SingleThemeOptions,
} from "./types.ts";
import { getHighlighter, Highlighter, merge, Page, Site } from "./deps.ts";
import createThemeStyle from "./lib/createThemeStyle.ts";

export { type Options } from "./types.ts";

export const defaults: Required<CommonOptions> = {
  cssFile: false,
  extensions: [".html"],
  extraCSS: `
.shiki {
  padding: 24px;
  border-radius: 0.25em;
  box-sizing: border-box;
  overflow-x: auto;
}`,
  highlighter: {},
  transformers: [],
  cssVariablePrefix: "--shiki-",
  themeStyles: [],
  useColorScheme: false,
};

export const singleThemeDefaults: Required<CommonOptions & SingleThemeOptions> =
  {
    theme: "vitesse-light",
    ...defaults,
  };

export const multiThemeDefaults: Required<CommonOptions & MultiThemesOptions> =
  {
    themes: {
      light: "vitesse-light",
      dark: "vitesse-dark",
    },
    defaultColor: false,
    ...defaults,
  };

function withSingleTheme<TThemes extends string = string>(
  userOptions: Required<CommonOptions & SingleThemeOptions<TThemes>>,
) {
  let extraCSS = userOptions.extraCSS ?? "";
  extraCSS += createThemeStyle({ ...userOptions, color: undefined });
  return createPlugin({ ...userOptions, extraCSS });
}

function withMultiThemes<TThemes extends string = string>(
  userOptions: Required<CommonOptions & MultiThemesOptions<TThemes>>,
) {
  let extraCSS = userOptions.extraCSS ?? "";
  Object.keys(userOptions.themes).forEach((color) => {
    extraCSS += createThemeStyle({ ...userOptions, color });
  });
  return createPlugin({ ...userOptions, extraCSS });
}

function createPlugin(options: Required<Options>) {
  return (site: Site) => {
    site.process(options.extensions, async (pages) => {
      const promises = pages.map(async (page) => {
        await highlight(page);
        await injectCSS(page);
        setDefaultColor(page);
      });
      await Promise.all(promises);
    });

    let highlighter: Highlighter | undefined = undefined;
    const loadHighlighter = () => {
      if (highlighter) return highlighter;
      return getHighlighter(options.highlighter).then((h) => highlighter = h);
    };

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

    const injectCSS = async (page: Page) => {
      if (!options.extraCSS) return;

      if (options.cssFile) {
        const output = await site.getOrCreatePage(options.cssFile);
        if (output.content) {
          output.content += options.extraCSS;
        } else {
          output.content = options.extraCSS;
        }
      } else {
        const style = page.document?.createElement("style");
        if (style) {
          style.textContent = options.extraCSS;
          page.document?.head.append(style);
        }
      }
    };

    const setDefaultColor = (page: Page) => {
      if ("defaultColor" in options && options.defaultColor) {
        const body = page.document?.querySelector("body");
        body?.setAttribute("data-color", options.defaultColor);
      }
    };
  };
}

export default function shikiji<Themes extends string = string>(
  options: Options<Themes>,
) {
  if ("themes" in options) {
    return withMultiThemes(merge(multiThemeDefaults, options));
  }

  return withSingleTheme(merge(singleThemeDefaults, options));
}
