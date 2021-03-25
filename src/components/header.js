import React from 'react'
import * as style from './header.module.css'

export default function Header() {
    const activation = function() {
        console.log("activation");
    }

    return (
        <div
            onClick={activation}
            className={style.header__wrap}>
            <canvas
                className={style.header__logo}>
            </canvas>
        </div>
    )
}