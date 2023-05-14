import { Plugin, PluginRenderStyleTag } from "https://deno.land/x/fresh@1.1.2/server.ts";
import { DOMParser, Element } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

export function InjectCSSPlugin(): Plugin {
    return {
        name: "inject-css",
        render: (ctx) => {
            const res = ctx.render();
            const document = new DOMParser().parseFromString(res.htmlText, "text/html");
            const elementsWithStyleTag = document?.querySelectorAll("[inject-style]");
            const sheetsToImport: Array<string> = [];
            elementsWithStyleTag?.forEach(($el) => {
                const el = $el as unknown as Element;
                const styleSheet = el.getAttribute("inject-style");
                if (styleSheet && !sheetsToImport.includes(styleSheet)) {
                    sheetsToImport.push(styleSheet);
                }
            });
            const styles: Array<PluginRenderStyleTag> = [];
            sheetsToImport.forEach((sheet) => {
                styles.push({
                    cssText: Deno.readTextFileSync(`./static/${sheet}`),
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
