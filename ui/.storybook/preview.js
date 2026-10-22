import "../styles/clayworks.css";

/** Light/dark switch in the toolbar sets data-theme on <html>, like the app's own theme tokens. */
export const globalTypes = {
  theme: {
    description: "Color theme",
    defaultValue: "light",
    toolbar: { title: "Theme", icon: "mirror", items: ["light", "dark"], dynamicTitle: true },
  },
};

export const decorators = [
  (story, ctx) => {
    document.documentElement.dataset.theme = ctx.globals.theme || "light";
    const wrap = document.createElement("div");
    wrap.style.cssText = "padding:24px;background:var(--bg);color:var(--ink);font-family:var(--body);min-height:100vh;box-sizing:border-box";
    const out = story();
    if (typeof out === "string") wrap.innerHTML = out; else wrap.append(out);
    return wrap;
  },
];

export const parameters = {
  layout: "fullscreen",
  backgrounds: { disable: true },
  options: { storySort: { order: ["Intro", "Foundations", "Components", "Patterns", "Explorations"] } },
};
