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
    "gatsby-plugin-sitemap",
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: 'https://www.whatpull.com',
        sitemap: 'https://www.whatpull.com/sitemap.xml',
        policy: [{ userAgent: '*', allow: '/' }]
      }
    },
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    `gatsby-plugin-transition-link`,
  ],
};
