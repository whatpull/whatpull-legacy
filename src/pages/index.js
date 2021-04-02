import React from "react"
import Layout from "../components/layout/default"
import ClawCraneGame from '../components/content/clawcranegame'

export default function Home() {
    return (
        <Layout background="#FFEB3B">
            <ClawCraneGame />
        </Layout>
    )
}