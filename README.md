# fresh-inject-css

A plugin for [Deno Fresh](https://fresh.deno.dev/) to inject CSS per-component.

When building a web application, it is common to have a large amount of CSS styles in your app. The problem with this is that on some pages, you may not be using all of those styles. The `fresh-inject-css` plugin allows you to define your styles in a per-component manner and only ship the styles you need when rendering a page.

# Installation

This assumes that you have already created a [fresh project](https://fresh.deno.dev/docs/getting-started/create-a-project).

Add the plugin to your `import_map.json`

```json
{
    "imports": {
        // ...
        "$inject-css/": "https://deno.land/x/fresh_inject_css@1.0.0/"
        // ...
    }
}
```

Import and use the plugin in `main.ts`

```ts
import { InjectCSSPlugin } from "$inject-css/index.ts";

await start(manifest, {
    plugins: [
        // ... your other plugins
        InjectCSSPlugin(),
        // ...
    ],
});
```

# Usage

In order to take advantage of this plugin, you should create your CSS files in the `static` directory of your project. To use those styles on your components, you can add the `inject-style` attribute on your component with the path relative to the `static` directory as the value.

For example, in a `Button` component, you may have the styles in `static/styles/button.css`

```tsx
import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
    return (
        <button {...props} disabled={!IS_BROWSER || props.disabled} class="button" inject-style="styles/button.css" />
    );
}
```

The plugin will automatically ignore duplicates so if, for example, you have multiple buttons in your app, it will only inject that CSS one time.
