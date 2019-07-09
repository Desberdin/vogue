import glob from "glob";
import path from "path";
/**
 * Create an array of URLs from a list of files
 * @param {*} urlFilepathTable
 */
const getDynamicPaths = urlFilepathTable => {
  return [].concat(
    ...Object.keys(urlFilepathTable).map(url => {
      const filepathGlob = urlFilepathTable[url];
      return glob
        .sync(filepathGlob, { cwd: "content" })
        .map(filepath => `${url}/${path.basename(filepath, ".json")}`);
    })
  );
};

const dynamicRoutes = getDynamicPaths({
  "/writing": "writing/*.json"
});

export default {
  srcDir: "src",
  css: ["~/assets/scss/style.scss"],
  router: {
    linkExactActiveClass: "nav__link--active"
  },
  head: {
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" }
    ]
  },
  generate: {
    routes: dynamicRoutes
  },
  modules: ["@nuxtjs/markdownit", "@nuxtjs/dotenv"],
  markdownit: {
    injected: true,
    preset: "default",
    breaks: true,
    html: true,
    linkify: true,
    typographer: true,
    quotes: "“”‘’",
    highlight: (code, lang) => {
      /* eslint-disable no-undef */
      const Prism = require("prismjs");
      require("prismjs/components/prism-scss");
      /* eslint-enable no-undef */
      return Prism.highlight(
        code,
        Prism.languages[lang] || Prism.languages.markup
      );
    }
  },
  build: {
    extend(config) {
      config.node = {
        fs: "empty"
      };
    }
  }
};
