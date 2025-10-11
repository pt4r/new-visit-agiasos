import { defineConfig } from "astro/config";
import icon from "astro-icon";
import i18n from "@astrolicious/i18n";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://new-visitagiasos.netlify.app",
  trailingSlash: 'never',
  integrations: [
    icon(),
    i18n({
      defaultLocale: "en",
      locales: ["el", "en"],
      client: {
        data: true,
        paths: true,
      },
      // used to localize the routes
      pages: {
				"/about": {
					el: "/poioi-eimaste"
				}
			},
    }),
    sitemap({
      i18n: {
        defaultLocale: 'en', // All urls that don't contain `el` after `"https://new-visitagiasos.netlify.app/"` will be treated as default locale, i.e. `en`
        locales: {
          // key/value pairs of all languages supported
          en: 'en-US', // The `defaultLocale` value must be present in `locales` keys
          el: 'el-GR',
        },
      },
    }),
  ],
});
