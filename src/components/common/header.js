import React, { useState, useEffect, useRef } from 'react'
import * as style from './header.module.css'
import icon from '../../images/icon.png'

export default function Header() {
    const canvas = useRef();
    const [context, setContext] = useState();
    // Ref Hook은 DOM Object를 관리하는 것 외에 컴포넌트 내에서 조회 수정할 수 있는 변수를 관리하는 용도가 있습니다.
    // (변수 값이 변경된다고 컴포넌트가 리렌딩 되지 않습니다.) 
    let raf = useRef();
    let rafStartTime = useRef();
    let defaultText = useRef('Design by Whatpull');
    let patternImage = useRef();

    useEffect(() => {
        const clearContext = () => {
            context.clearRect(0, 0, canvas.current.width, canvas.current.height);
            context.beginPath();
        }
    
        const drawContext = (x, y) => {
            context.save();
            context.beginPath();
            context.font = '30px Roboto';
            context.textBaseline = 'middle';
            context.fillText(defaultText.current, x, y);
            context.fill();

            context.beginPath();
            context.globalCompositeOperation="source-in";
            context.drawImage(patternImage.current, 0, 0);
            context.restore();
        }

        const animate = time => {
            if(typeof rafStartTime.current === "undefined") rafStartTime.current = time;
            const progress = time - rafStartTime.current;
            // TODO. 정확한 width 측정방법 확인
            const drawContext_text_width = context.measureText(defaultText).width + 250;
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

        const loadImage = (callback) => {
            if(typeof patternImage.current === "undefined") patternImage.current = new Image(200, 50);
            patternImage.current.onload = function() {
                if(typeof callback === "function") callback();
            }
            patternImage.current.src = '/pattern.jpeg';
        }

        if(canvas) {
            if(typeof context === "undefined") {
                setContext(canvas.current.getContext("2d"));
            }
            if(context) {
                loadImage(() => {
                    drawContext(0, 25);
                    startAnimation();
                });
            }
        }

        return() => {
            if(canvas && context) {
                cancelAnimation();
                clearContext();
                // resource 자원 낭비 확인
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
            <div className={style.header__logoIcon}>
                <img src={icon} alt="symbol icon" />
            </div>
        </div>
    )
}