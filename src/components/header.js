import React, { useState, useEffect, useRef } from 'react'
import * as style from './header.module.css'

export default function Header() {
    const canvas = useRef();
    const [context, setContext] = useState();
    // Ref Hook은 DOM Object를 관리하는 것 외에 컴포넌트 내에서 조회 수정할 수 있는 변수를 관리하는 용도가 있습니다.(변수 값이 변경된다고 컴포넌트가 리렌딩 되지 않습니다.) 
    let raf = useRef();
    let rafStartTime = useRef();
    let defaultText = useRef('Whatpull');

    useEffect(() => {
        const clearContext = () => {
            context.clearRect(0, 0, canvas.current.width, canvas.current.height);
            context.beginPath();
        }
    
        const drawContext = (x, y) => {
            context.font = '40px Roboto';
            context.fillStyle = '#ffffff';
            context.textBaseline = 'middle';
            context.fillText(defaultText.current, x, y);
        }

        const animate = time => {
            if(typeof rafStartTime.current === "undefined") rafStartTime.current = time;
            const progress = time - rafStartTime.current;
            const drawContext_text_width = context.measureText(defaultText).width;
            const drawContext_max_x = 200;
            const drawContext_x = Math.min((drawContext_text_width * -1) + ((progress / 10) % (drawContext_max_x + drawContext_text_width)), drawContext_max_x);
            const drawContext_y = 25;
            clearContext();
            drawContext(drawContext_x, drawContext_y);
            startAnimation();
        }

        const startAnimation = () => {
            raf.current = requestAnimationFrame(animate);
        }

        const cancelAnimation = () => {
            cancelAnimationFrame(raf.current);
            raf.current = undefined;
            rafStartTime.current = undefined;
        }

        if(canvas) {
            if(typeof context === "undefined") {
                setContext(canvas.current.getContext("2d"));
            }
            if(context) {
                drawContext(0, 25);
                startAnimation();
            }
        }

        return() => {
            if(canvas && context) {
                cancelAnimation();
                clearContext();
            }
        }
    }, [context]);

    return (
        <div
            className={style.header__wrap}>
            <canvas
                ref={canvas}
                className={style.header__logo}
                width="200px"
                height="50px">
            </canvas>
        </div>
    )
}