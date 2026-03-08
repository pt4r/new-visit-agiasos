import { defineConfig } from "astro/config";
import icon from "astro-icon";
import i18n from "@astrolicious/i18n";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";

export default defineConfig({
  site: "https://new-visitagiasos.netlify.app",
  output: "server",
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    icon(),
    i18n({
      defaultLocale: "en",
      locales: ["el", "en"],
      client: {
        data: true,
        paths: true,
      },
      pages: {
        "/about": {
          el: "/poioi-eimaste",
        },
        "/agiasos-lesbos": {
          el: "/agiasos-lesvos",
        },
        "/the-talking-tiles": {
          el: "/ta-plakakia-pou-milane",
        },
        "/how-to-get-to-agiasos": {
          el: "/pos-na-ertheis-stin-agiaso",
        },
        "/things-to-see-in-agiasos": {
          el: "/axiothea-stin-agiaso",
        },
        "/museums-of-agiasos": {
          el: "/mouseia-agiasos",
        },
        "/events": {
          el: "/ekdiloseis",
        },
        "/apartments-in-agiasos-lesvos": {
          el: "/diamerismata-stin-agiaso",
        },
        "/shops-in-agiasos": {
          el: "/katastimata-stin-agiaso",
        },
        "/our-projects": {
          el: "/ta-erga-mas",
        },
        "/shop": {
          el: "/souvenir",
        },
        "/contact": {
          el: "/epikoinonia",
        },
      },
    }),
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en-US",
          el: "el-GR",
        },
      },
    }),
  ],
});
