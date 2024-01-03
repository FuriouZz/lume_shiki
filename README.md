# Shikiji plugin for [Lume](https://lume.land/) <!-- omit in toc -->

This plugin uses [shikiji](https://shikiji.netlify.app/) library to search and syntax highlight the code of any `<pre><code>` element.

It exists a [markdown-it plugin](https://shikiji.netlify.app/packages/markdown-it) for Shikiji, but we made the choice to be engine agnostic as [highlight.js plugin](https://lume.land/plugins/code_highlight/) and [prism.js plugin](https://lume.land/plugins/prism/).

This plugin adds a couple of advantages for CSS customisation:
* Add extra CSS
* Generate CSS variable by theme color
* Use Dark/Light theme
* Inject CSS into a `<style>` tag or a `cssFile`
* Use shikijiExtra() for better CSS defaults

Check the [demo](./demo/_config.ts) directory.

- [Installation](#installation)
- [Example with a single theme](#example-with-a-single-theme)
- [Example with multiple themes](#example-with-multiple-themes)
- [Example with custom variable](#example-with-custom-variable)
- [Common Options](#common-options)
- [Single theme options](#single-theme-options)
- [Multi themes options](#multi-themes-options)
- [Use shikijiExtra()](#use-shikijiextra)

## Installation

Import this plugin in your `_config.ts` file to use it:

```ts
import lume from "https://deno.land/x/lume/mod.ts";
import shikiji from "https://deno.land/x/furiouzz/lume/plugins/shikiji/mod.ts";

const site = lume();

site.use(shikiji(/* Options */));

export default site;
```

## Example with a single theme

```ts
import lume from "https://deno.land/x/lume/mod.ts";
import shikiji from "https://deno.land/x/lume_shikiji/mod.ts";

const site = lume();

site.use(
  shikiji({
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
import shikiji from "https://deno.land/x/lume_shikiji/mod.ts";

const site = lume();

site.use(
  shikiji({
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
import shikiji from "https://deno.land/x/lume_shikiji/mod.ts";

const site = lume();

site.use(
  shikiji({
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
  transformers?: ShikijiTransformer[];

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

## Use shikijiExtra()

This plugin add extra CSS, CSS variables and [shikiji-transformers](https://shikiji.netlify.app/packages/transformers).

```ts
import lume from "https://deno.land/x/lume/mod.ts";
import shikiji from "https://deno.land/x/lume_shikiji/mod.ts";
import shikijiExtra from "https://deno.land/x/lume_shikiji/extra/mod.ts";

const site = lume();

site.use(
  shikiji({
    highlighter: {
      langs: ["javascript"],
      themes: ["github-light"],
    },
    theme: "github-light",
  })
);

site.use(
  shikijiExtra({ copyFiles: true })
);

export default site;
```

You need to add these files to your layout:

```html
<link rel="stylesheet" href="styles/shikiji-extra/main.css">
<link rel="stylesheet" href="styles/shikiji-extra/transformerNotationDiff.css">
<link rel="stylesheet" href="styles/shikiji-extra/transformerNotationErrorLevel.css">
<link rel="stylesheet" href="styles/shikiji-extra/transformerNotationFocus.css">
<link rel="stylesheet" href="styles/shikiji-extra/transformerNotationHighlight.css">
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
   * @default "styles/shikiji/"
   */
  baseDir?: string;
}
```
