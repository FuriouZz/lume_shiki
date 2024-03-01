# Shiki plugin for [Lume](https://lume.land/) <!-- omit in toc -->

This plugin uses [shiki](https://shiki.style/) library to search and syntax highlight the code of any `<pre><code>` element.

It exists a [markdown-it plugin](https://shiki.style/packages/markdown-it) for Shiki, but we made the choice to be engine agnostic as [highlight.js plugin](https://lume.land/plugins/code_highlight/) and [prism.js plugin](https://lume.land/plugins/prism/).

This plugin adds a couple of advantages for CSS customisation:
* Add extra CSS
* Generate CSS variable by theme color
* Use Dark/Light theme
* Inject CSS into a `<style>` tag or a `cssFile`
* Use shikiExtra() for better CSS defaults

Check the [demo](./demo/_config.ts) directory.

- [Installation](#installation)
- [Example with a single theme](#example-with-a-single-theme)
- [Example with multiple themes](#example-with-multiple-themes)
- [Example with custom variable](#example-with-custom-variable)
- [Common Options](#common-options)
- [Single theme options](#single-theme-options)
- [Multi themes options](#multi-themes-options)
- [Use shikiExtra()](#use-shikiextra)

## Installation

Import this plugin in your `_config.ts` file to use it:

```ts
import lume from "https://deno.land/x/lume/mod.ts";
import shiki from "https://deno.land/x/lume_shiki/mod.ts";

const site = lume();

site.use(shiki(/* Options */));

export default site;
```

## Example with a single theme

```ts
import lume from "https://deno.land/x/lume/mod.ts";
import shiki from "https://deno.land/x/lume_shiki/mod.ts";

const site = lume();

site.use(
  shiki({
    highlighter: {
      langs: ["javascript"],
      themes: ["github-light"],
    },
    theme: "github-light",
  })
);

export default site;
```

## Example with multiple themes

```ts
import lume from "https://deno.land/x/lume/mod.ts";
import shikijfrom "https://deno.land/x/lume_shiki/mod.ts";

const site = lume();

site.use(
  shiki({
    highlighter: {
      langs: ["javascript"],
      themes: ["github-light", "github-dark"],
    },
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    defaultColor: "light",
  })
);

export default site;
```

## Example with custom variable

```ts
import lume from "https://deno.land/x/lume/mod.ts";
import shiki from "https://deno.land/x/lume_shiki/mod.ts";

const site = lume();

site.use(
  shiki({
    highlighter: {
      langs: ["javascript"],
      themes: ["github-light", "github-dark"],
    },
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    defaultColor: "light",
    cssThemedVariables: [
      "border-color",
    ],
    extraCSS: `
:root {
  --shiki-dark-border-color: #ffaa22;
  --shiki-light-border-color: #0088ff;
}

.shiki {
  border: 5px var(--shiki-border-color) solid;
}
`
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
  transformers?: ShikiTransformer[];

  /**
   * Prefix of CSS variables used to store the color of the other theme.
   * @default '--shiki-'
   */
  cssVariablePrefix?: string;

  /**
   * Add variables that needs to be themed
   * You can optionaly give a defaultValue
   */
  cssThemedVariables?: (string | [variableSuffix: string, defaultValue: string])[];

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
  theme: ShikiThemes<Themes>;
}
```

## Multi themes options

```ts
type MultiThemeOptions = CommonOptions & {
  /**
   * A map of color names to themes.
   * This allows you to specify multiple themes for the generated code.
   *
   * @see https://github.com/antfu/shiki#lightdark-dual-themes
   */
  themes?: Record<string, ShikiThemes<Themes>>;

  /**
   * Add [data-color] attribute to body element
   * It does not work like shiki implementation
   *
   * @default false
   */
  defaultColor?: string | false;
}
```

## Use shikiExtra()

This plugin add extra CSS, CSS variables and [shiki-transformers](https://shiki.style/packages/transformers).

```ts
import lume from "https://deno.land/x/lume/mod.ts";
import shiki from "https://deno.land/x/lume_shiki/mod.ts";
import shikiExtra from "https://deno.land/x/lume_shiki/extra/mod.ts";

const site = lume();

site.use(
  shiki({
    highlighter: {
      langs: ["javascript"],
      themes: ["github-light"],
    },
    theme: "github-light",
  })
);

site.use(
  shikiExtra({ copyFiles: true })
);

export default site;
```

You need to add these files to your layout:

```html
<link rel="stylesheet" href="styles/shiki-extra/main.css">
<link rel="stylesheet" href="styles/shiki-extra/transformerNotationDiff.css">
<link rel="stylesheet" href="styles/shiki-extra/transformerNotationErrorLevel.css">
<link rel="stylesheet" href="styles/shiki-extra/transformerNotationFocus.css">
<link rel="stylesheet" href="styles/shiki-extra/transformerNotationHighlight.css">
```

Extra options:

```ts
type ExtraOptions = {
  /**
   * Copy files to destination directory
   * @default false
   */
  copyFiles?: boolean;

  /**
   * Base directory of CSS files
   * Must ends with "/"
   * @default "styles/shiki/"
   */
  baseDir?: string;
}
```
