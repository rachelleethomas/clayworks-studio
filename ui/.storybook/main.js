/** Clayworks component library. Styles come from the app via scripts/extract_css.py. */
export default {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.js"],
  addons: ["@storybook/addon-essentials"],
  framework: { name: "@storybook/html-vite", options: {} },
  docs: { autodocs: false },
  core: { disableTelemetry: true },
  // GitHub Pages serves the build under /clayworks-studio/storybook/
  viteFinal: async (config) => ({ ...config, base: "./" }),
};
