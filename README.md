# Shikiji plugin for [Lume](https://lume.land/) <!-- omit in toc -->

This plugin uses [shikiji](https://shikiji.netlify.app/) library to search and syntax highlight the code of any `<pre><code>` element.

It exists a [markdown-it plugin](https://shikiji.netlify.app/packages/markdown-it) for Shikiji, but we made the choice to be engine agnostic.

Moreover, this plugin adds a couple of advantages for CSS customisation:
* Add extra CSS
* Generate CSS by theme
* Generate defaults CSS for [common-transformers](https://shikiji.netlify.app/packages/transformers)
* Inject CSS into a `<style>` tag or a `cssFile`

Check the [demo](./demo/_config.ts) directory.

- [Installation](#installation)
- [Example](#example)
- [Common Options](#common-options)
- [Single theme options](#single-theme-options)
- [Multi themes options](#multi-themes-options)

## Installation

Import this plugin in your `_config.ts` file to use it:

```ts
import lume from "https://deno.land/x/lume/mod.ts";
import shikiji from "https://deno.land/x/furiouzz/lume/plugins/shikiji/mod.ts";

const site = lume();

site.use(shikiji(/* Options */));

export default site;
```

## Example

```ts
import lume from "https://deno.land/x/lume/mod.ts";
import shikiji from "https://deno.land/x/furiouzz/lume/plugins/shikiji/mod.ts";

import {
  cssRulesDiff,
  cssRulesErrorLevel,
  cssRulesFocus,
  cssRulesHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "../transformers/mod.ts";

const site = lume();

site.use(
  shikiji({
    highlighter: {
      langs: ["javascript"],
      themes: ["github-light"],
    },

    theme: "github-light",

    themeStyles: [
      cssRulesDiff,
      cssRulesErrorLevel,
      cssRulesFocus,
      cssRulesHighlight,
    ],

    transformers: [
      transformerNotationDiff(),
      transformerNotationErrorLevel(),
      transformerNotationFocus(),
      transformerNotationHighlight(),
    ],
  })
);

export default site;
```

## Common Options

```ts
type CommonOptions = {
  /**
   * The list of extensions this plugin applies to
   * @default [".html"]
   */
  extensions?: string[];

  /**
   * Set the css filename for all generated styles, Set to false to insert a style tag per page.
   * @default false
   */
  cssFile?: string | false

  /**
   * Highlighter options to configure theme and languages to load
   */
  highlighter?: BundledHighlighterOptions<BuiltinLanguage, BuiltinTheme>;

  /**
   * Inject extra
   */
  extraCSS?: string;

  /**
   * Transform the generated HAST tree.
   */
  transformers?: ShikijiTransformer[];

  /**
   * Prefix of CSS variables used to store the color of the other theme.
   * @default '--shiki-'
   */
  cssVariablePrefix?: string;

  /**
   * Hook to create CSS rules by theme color
   */
  themeStyles?: OnCreateStyleHook[];

  /**
   * Use dark/light mode
   */
  useColorScheme?: boolean;
}
```

## Single theme options

```ts
type SingleThemeOptions = CommonOptions & {
  /**
   * Single theme used
   * @default 'vitesse-light'
   */
  theme: ShikijiThemes<Themes>;
}
```

## Multi themes options

```ts
type MultiThemeOptions = CommonOptions & {
  /**
   * A map of color names to themes.
   * This allows you to specify multiple themes for the generated code.
   *
   * @see https://github.com/antfu/shikiji#lightdark-dual-themes
   */
  themes?: Record<string, ShikijiThemes<Themes>>;

  /**
   * Add [data-color] attribute to body element
   * It does not work like shikiji implementation
   *
   * @default false
   */
  defaultColor?: string | false;
}
```
