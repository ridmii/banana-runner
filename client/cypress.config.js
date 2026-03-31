import { defineConfig } from 'cypress'
import viteConfig from './vite.config.js'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5177',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig,
    },
  },
})
