import {
  BuiltinLanguage,
  BuiltinTheme,
  BundledHighlighterOptions,
  ShikijiTransformer,
  StringLiteralUnion,
  ThemeRegistration,
  ThemeRegistrationRaw,
} from "./deps.ts";

export type ShikijiThemes<Themes extends string = string> =
  | ThemeRegistration
  | ThemeRegistrationRaw
  | StringLiteralUnion<Themes>;

export interface OnTransformerCSSRulesOptions {
  addColors: boolean;
}

export interface CreateThemeStyleOptions {
  /**
   * Theme color
   * @default ''
   */
  color?: string;

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

export interface GetStylesOptions {
  /**
   * Theme color to style
   */
  color: string;

  /**
   * Prefix of CSS variables used to store the color of the other theme.
   * @default '--shiki-'
   */
  cssVariablePrefix: string;
}

export type OnCreateStyleHook = (options: GetStylesOptions) => string;

export interface SingleThemeOptions<Themes extends string = string> {
  /**
   * Single theme used
   * @default 'vitesse-light'
   */
  theme: ShikijiThemes<Themes>;
}

export interface MultiThemesOptions<Themes extends string = string> {
  /**
   * A map of color names to themes.
   * This allows you to specify multiple themes for the generated code.
   *
   * @see https://github.com/antfu/shikiji#lightdark-dual-themes
   */
  themes: Record<string, ShikijiThemes<Themes>>;

  /**
   * Add [data-color] attribute to body element
   *
   * @default false
   */
  defaultColor?: string | false;
}

export type ThemeOptions<Themes extends string = string> =
  | SingleThemeOptions<Themes>
  | MultiThemesOptions<Themes>;

export type Options<TThemes extends string = string> =
  & CommonOptions
  & ThemeOptions<TThemes>;

export interface CommonOptions extends Omit<CreateThemeStyleOptions, "color"> {
  /**
   * The list of extensions this plugin applies to
   * @default [".html"]
   */
  extensions?: string[];

  /**
   * Set the css filename for all generated styles, Set to false to insert a style tag per page.
   * @default false
   */
  cssFile?: string | false;

  /**
   * Highlighter options to configure theme and languages to load
   */
  highlighter?: BundledHighlighterOptions<BuiltinLanguage, BuiltinTheme>;

  /**
   * Inject extra CSS
   */
  extraCSS?: string;

  /**
   * Transform the generated HAST tree.
   */
  transformers?: ShikijiTransformer[];
}
