import React from "react";
import Layout from "../../components/layout/default";
import Animation01 from "../../components/content/animation/01/animation01";

export default function PagesAnimation01() {
    const background = '#0C090A';
    return (
        <Layout background={background}>
            <Animation01 background={background} />
        </Layout>
    )
}