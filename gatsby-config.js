module.exports = {
  siteMetadata: {
    title: "whatpull",
    titleTemplate: "%s · design",
    description: "front-end design by whatpull",
    url: "https://www.whatpull.com",
    image: "/images/icon.png",
    siteUrl: "https://www.whatpull.com"
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    {
      resolve: `gatsby-plugin-s3`,
      options: {
        bucketName: "whatpull.com",
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `whatpull`,
        short_name: `whatpull`,
        start_url: `/`,
        background_color: `#161616`,
        theme_color: `#161616`,
        display: `standalone`,
        icon: `src/images/icon.png`,
        cache_busting_mode: `name`
      },
    },
  ],
};
