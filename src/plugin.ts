import { Plugin, PluginRenderStyleTag } from "https://deno.land/x/fresh@1.1.2/server.ts";
import { DOMParser, Element } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

type PluginOptions = {
    baseDirectory?: string;
    attributeName?: string;
};

export function InjectCSSPlugin({ baseDirectory = "static", attributeName = "inject-style" }: PluginOptions): Plugin {
    return {
        name: "inject-css",
        render: (ctx) => {
            const res = ctx.render();
            const document = new DOMParser().parseFromString(res.htmlText, "text/html");
            const elementsWithStyleTag = document?.querySelectorAll(`[${attributeName}]`);
            const sheetsToImport: Array<string> = [];
            elementsWithStyleTag?.forEach(($el) => {
                const el = $el as unknown as Element;
                const styleSheet = el.getAttribute(attributeName);
                if (styleSheet && !sheetsToImport.includes(styleSheet)) {
                    sheetsToImport.push(styleSheet);
                }
            });
            const styles: Array<PluginRenderStyleTag> = [];
            sheetsToImport.forEach((sheet) => {
                styles.push({
                    cssText: Deno.readTextFileSync(`./${baseDirectory}/${sheet}`),
                    id: sheet.split("/").pop(),
                });
            });
            return {
                scripts: [],
                styles,
            };
        },
    };
}
