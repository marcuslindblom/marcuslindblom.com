import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import lit from "@astrojs/lit";

// https://astro.build/config
export default defineConfig({
  site: 'https://marcuslindblom.com',
  integrations: [tailwind(), sitemap(), lit()],
  output: 'server',
  vite: {
    ssr: {
      noExternal: ['@strifeapp/strife', '@strifeapp/image']
    }
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true
    },
    speedInsights: {
      enabled: true
    }
  })
});