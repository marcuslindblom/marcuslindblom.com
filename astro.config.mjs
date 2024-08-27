import { defineConfig } from 'astro/config';
import basicSsl from '@vitejs/plugin-basic-ssl'
import vercel from '@astrojs/vercel/serverless';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import lit from "@astrojs/lit";

const { PROD } = import.meta.env;

// https://astro.build/config
export default defineConfig({
  site: 'https://marcuslindblom.com',
  railingSlash: 'never',
  integrations: [tailwind(), sitemap(), lit()],
  output: 'server',
  server: {
    port: 4323
  },
  vite: {
    plugins: !PROD ? [basicSsl()] : [],
    server: {
      https: true
    },
    ssr: {
      noExternal: ['@strifeapp/strife', '@strifeapp/image']
    }
  },
  adapter: vercel({
    webAnalytics: {
      enabled: PROD,
    },
    speedInsights: {
      enabled: false
    }
  })
});