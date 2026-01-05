// See https://observablehq.com/framework/config for documentation.
export default {
  // The app’s title; used in the sidebar and webpage titles.
  title: "Measured",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  pages: [
     {
       name: "Energy",
       collapsible: true,
       pages: [
         {name: "Electricity grid: Uruguay", path: "/energy-uy"},
       ]
     }
   ],

  // Content to add to the head of the page, e.g. for a favicon:
  head: '<!-- Google tag (gtag.js) -->\n' +
      '<script async src="https://www.googletagmanager.com/gtag/js?id=G-4MZS95K7C2"></script>\n' +
      '<script>\n' +
      '  window.dataLayer = window.dataLayer || [];\n' +
      '  function gtag(){dataLayer.push(arguments);}\n' +
      '  gtag(\'js\', new Date());\n' +
      '\n' +
      '  gtag(\'config\', \'G-4MZS95K7C2\');\n' +
      '</script><link rel="icon" href="observable.png" type="image/png" sizes="32x32">',

  // The path to the source root.
  root: "src",

  // Some additional configuration options and their defaults:
  // theme: "default", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
  // footer: "Built with Observable.", // what to show in the footer (HTML)
  // sidebar: true, // whether to show the sidebar
  // toc: true, // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer
  // output: "dist", // path to the output root for build
  search: true, // activate search
  // linkify: true, // convert URLs in Markdown to links
  typographer: false, // smart quotes and other typographic improvements
  preserveExtension: false, // drop .html from URLs
  preserveIndex: false, // drop /index from URLs
};
