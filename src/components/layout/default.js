import React from "react"
import { TransitionState } from "gatsby-plugin-transition-link"
import * as style from "./default.module.css"
import Header from "../common/header"
import SEO from "../common/seo"
import Splash from "../common/splash"

export default function DefaultLayout({ children, background }) {
    return (
        <div className={style.layout__defaultWrap}>
            <SEO />
            <div className={style.layout__defaultHead}>
                <Header />
            </div>
            <div className={style.layout__defaultBody}>
                <TransitionState>
                    {({ TransitionStatus, exit, entry, mount }) => {
                        return(
                            <Splash mount={mount} />
                        )
                    }}
                </TransitionState>
                <div
                    style={{ background: background }} 
                    className={style.body__content}>
                    {children}
                </div>
            </div>
            <div className={style.layout__defaultFoot}>
                Copyright © Whatpull. All rights reserved.
            </div>
        </div>
    )
}