import React from "react"
import * as style from "./default.module.css"
import Header from "../common/header"

export default function DefaultLayout({ children }) {
    return (
        <div className={style.layout__defaultWrap}>
            <div className={style.layout__defaultHead}>
                <Header />
            </div>
            <div className={style.layout__defaultBody}>
                {children}
            </div>
            <div className={style.layout__defaultFoot}>
                Copyright © Whatpull. All rights reserved.
            </div>
        </div>
    )
}