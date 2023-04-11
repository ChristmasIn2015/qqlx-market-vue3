import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/market/",
    plugins: [
        //
        vue({ template: { transformAssetUrls } }),
        quasar({
            sassVariables: "src/assets/quasar-variables.scss",
        }),
    ],
    define: { "process.env": {} },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        port: 3001,
        proxy: {
            "/qqlx/user": {
                target: "http://127.0.0.1:3006",
                changeOrigin: true,
                rewrite: (path) => path,
            },
            "/qqlx/brand": {
                target: "http://127.0.0.1:3001",
                changeOrigin: true,
                rewrite: (path) => path,
            },
            "/qqlx/market": {
                target: "http://127.0.0.1:3102",
                changeOrigin: true,
                rewrite: (path) => path,
            },
            "/qqlx/wmss": {
                target: "http://127.0.0.1:3104",
                changeOrigin: true,
                rewrite: (path) => path,
            },
        },
    },
});
