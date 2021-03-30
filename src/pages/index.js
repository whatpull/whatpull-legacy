import React from "react"
import Layout from "../components/layout/default"
import SEO from "../components/common/seo"
import Splash from "../components/common/splash"

export default function Home() {
    return (
        <Layout>
            <SEO />
            <Splash />
        </Layout>
    )
}