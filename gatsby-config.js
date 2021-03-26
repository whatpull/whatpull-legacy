module.exports = {
  siteMetadata: {
    title: "whatpull",
    siteUrl: "https://www.whatpull.com"
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    "gatsby-plugin-mdx",
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
  ],
};
