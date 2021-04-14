import React, { useState, useEffect, useRef } from 'react'
import * as style from './splash.module.css'

export default function Splash({ mount }) {
    const [context, setContext] = useState();
    const wrap = useRef();
    const canvas = useRef();
    const svg = useRef();
    const patternSlateBottomImage = useRef();
    const patternSlateTopImage = useRef();
    const raf = useRef();
    const rafStartTime = useRef();
    const movieSlateAnimationSpeed = useRef(1);
    const centerX = useRef(0);
    const centerY = useRef(0);
    const displayNone = useRef();
    const ratio = 1.3;
    const maxDegree = 20;

    useEffect(() => {
        const initCanvas = (progress) => {
            if(canvas.current) {
                context.canvas.width = canvas.current.clientWidth * ratio;
                context.canvas.height = canvas.current.clientHeight * ratio;
                centerX.current = context.canvas.width / 2;
                centerY.current = context.canvas.height / 2;
                clearContext();
                drawContext(progress);
                context.imageSmoothingEnabled = true;
            }
        }

        const clearContext = (paramX, paramY, paramWidth, paramHeight) => {
            if(canvas.current) {
                const x = paramX ? paramX : 0;
                const y = paramY ? paramY : 0;
                const width = paramWidth ? paramWidth : canvas.current.width;
                const height = paramHeight ? paramHeight : canvas.current.height;
                context.clearRect(x, y, width, height);
            }
        }

        const drawContext = (progress) => {
            context.strokeStyle = '#FFFFFF';
            context.fillStyle = '#FFFFFF';
            drawMovieSlateBody(centerX.current, centerY.current);
            drawMovieSlateHead(centerX.current, centerY.current, progress);
            drawMovieSlateHeadConnector(centerX.current, centerY.current);
        }

        const drawMovieSlateBody = (centerX, centerY) => {
            const width = 250;
            const height = 170;
            const x = centerX - (width / 2);
            const y = centerY - (height / 2);
            const radius = 6;
            const type = 'fill';

            drawRoundedRectangle(x+5, y-10, width, height+15, radius, type, '#0E1013', 0.3);
            drawRoundedRectangle(x, y, width, height, radius, type, '#0E1013', 1);

            const slateBodyDecoration = () => { // 바디 꾸미기(글씨)
                context.save();
                context.beginPath();
                context.fillStyle = 'rgba(255, 255, 255, 1)';
                context.font = '14px Roboto';
                context.textBaseline = 'middle';
                context.fillText('Design By Whatpull', x+105, y+(145));
                context.restore();
            }
            slateBodyDecoration();
        }

        const drawMovieSlateHead = (centerX, centerY, progress) => {
            const width = 250;
            const height = 25;
            const x = centerX - (width / 2);
            const y = centerY - (190 / 2);
            const radius = 2;
            const type = 'fill';
            const degree = -1 * (maxDegree - progress); // 20 ~ 0
            const rotate = degree * Math.PI / 180;
            const slateHeadItem = (x, y, position) => { // 슬레이트 아이템
                context.save();
                context.beginPath();
                if(position === "top") {
                    context.translate(x, y);
                    context.rotate(rotate);
                    context.translate(-x, -y);
                }
                drawRoundedRectangle(x, y+5, width, height, radius, type, '#121212', 0.5);
                context.drawImage((position === 'top' ? patternSlateTopImage.current : patternSlateBottomImage.current), x, y, width+1, height);
                context.restore();
            }
            
            slateHeadItem(x-1, y-26, 'top');
            slateHeadItem(x-1, y, 'bottom');
        }

        const drawMovieSlateHeadConnector = (centerX, centerY) => {
            const width = 30;
            const height = 55;
            const x = centerX - (width / 2) - 110;
            const y = centerY - (height / 2) - 95;
            const boltColor = 'rgba(255, 255, 255, 0.06)';
            const connectorBody = () => { // 컨넥터 몸
                context.save();
                context.beginPath();
                context.lineWidth = 5;
                context.strokeStyle = '#121212'
                context.fillStyle = '#0E1013';
                context.moveTo(x, y);
                context.lineTo(x + 20, y + 1);
                context.lineTo(x + width, y + (height / 2));
                context.lineTo(x + 20, y + height - 2);
                context.lineTo(x, y + height);
                context.closePath();
                context.stroke();
                context.fill();
                context.restore();
            }
            const connectorBolt = (x, y) => { // 컨넥터 나사
                context.save();
                context.beginPath();
                context.fillStyle = boltColor;
                context.moveTo(x, y);
                context.arc(x, y, 2, 0, Math.PI * 2, true);
                context.fill();
                context.restore();
            }
            
            connectorBody();
            connectorBolt(x + 5, y + 8);    // 나사 [top, left]
            connectorBolt(x + 18, y + 13);  // 나사 [top, right]
            connectorBolt(x + 18, y + 40);  // 나사 [bottom, right]
            connectorBolt(x + 5, y + 45);   // 나사 [bottom, left]
        }

        /** @param {*} type (타입 : line(선), fill(채우기)) */
        const drawRoundedRectangle = (x, y, width, height, radius, type, color, alpha) => {
            context.save();
            context.beginPath();
            context.moveTo(x + (radius * 2), y);
            context.arcTo(x + width, y, x + width, y + (radius * 2), radius); // top, right
            context.lineTo(x + width, y + (radius * 2));
            context.arcTo(x + width, y + height, x + width - (radius * 2), y + height, radius); // bottom, right
            context.lineTo(x + width - (radius * 2), y + height);
            context.arcTo(x, y + height, x, y + height - (radius * 2), radius); // bottom, left
            context.lineTo(x, y + height - (radius * 2));
            context.arcTo(x, y, x + (radius * 2), y, radius); // top, left
            context.lineTo(x + (radius * 2), y);
            if(typeof alpha === "number") context.globalAlpha = alpha;
            if(type === 'fill') {
                context.fillStyle = color;
                context.fill();
            } else {
                context.strokeStyle = color;
                context.stroke();
            }
            context.restore();
        }

        const animate = time => {
            if(typeof rafStartTime.current === "undefined") rafStartTime.current = time;
            const progress = time - rafStartTime.current;
            const calculate = Math.min((progress / maxDegree), maxDegree);
            initCanvas(calculate);
            if(calculate === maxDegree) { // 초기화
                cancelAnimation();
                movieSlateAnimationSpeed.current = 1;
            } else {
                startAnimation();
            }
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
            if(typeof patternSlateBottomImage.current === "undefined") patternSlateBottomImage.current = new Image(260, 260);
            if(typeof patternSlateTopImage.current === "undefined") patternSlateTopImage.current = new Image(260, 260);
            patternSlateBottomImage.current.onload = function() {
                patternSlateTopImage.current.onload = function() {
                    if(typeof callback === "function") callback();
                }
                patternSlateTopImage.current.src = '/pattern_slate_top.png';
            }
            patternSlateBottomImage.current.src = '/pattern_slate_bottom.png';
        }

        // 초기 호출 함수
        if(canvas) {
            if(typeof context === "undefined") {
                setContext(canvas.current.getContext("2d"));
            }
            if(context) {
                loadImage(() => {
                    cancelAnimation();
                    clearContext();
                    initCanvas(maxDegree);
                    startAnimation();
                    window.addEventListener('resize', initCanvas);
                });
            }
        }

        // mount를 측정하여, 스플래쉬의 display를 none으로 적용한다.
        // opacity만 0으로 변경될 경우 문제가 발생한다.
        if(mount) {
            if(typeof displayNone.current === 'undefined') {
                displayNone.current = setTimeout(() => {
                    wrap.current.style.display = 'none';
                }, 2100);
            }
        }

        return() => {
            window.removeEventListener('resize', initCanvas);
            if(canvas && context) {
                cancelAnimation();
                clearContext();
            }
        }
    }, [context, mount])

    return(
        <div
            ref={wrap}
            className={[style.splash__canvasWrap, mount ? style.splash__canvasWrapHidden : ''].join(' ')}>
            <canvas 
                ref={canvas}
                className={style.splash__canvasFull}>
            </canvas>
            <svg 
                ref={svg}
                style={{display: 'none'}}></svg>
        </div>
    )
}