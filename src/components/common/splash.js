import React, { useState, useEffect, useRef } from 'react'
import * as style from './splash.module.css'

export default function Splash() {
    const wrap = useRef();
    const canvas = useRef();
    const movieSlatePattern = useRef();
    const [context, setContext] = useState();

    useEffect(() => {
        const clearContext = () => {
            context.clearRect(0, 0, canvas.current.width, canvas.current.height);
            context.beginPath();
        }

        const getRelativeWidth = (width, margin) => {
            let result = width - margin;
            if(width > context.canvas.width) {
                result = context.canvas.width - margin;
            }
            return result;
        }

        const getRelativeHeight = (height, ratio) => {
            return height * ratio;
        }

        const drawContext = () => {
            context.strokeStyle = '#ffffff';
            context.fillStyle = '#ffffff';
            const centerX = (context.canvas.width / 2);
            const centerY = (context.canvas.height / 2);
            drawMovieSlateBody(centerX, centerY);
            drawMovieSlateHead(centerX, centerY);
        }

        const drawMovieSlateBody = (centerX, centerY) => {
            const margin = 20;
            const width = 250;
            const height = 170;
            const relative_width = getRelativeWidth(width, margin);
            const ratio = relative_width/width;
            const relative_height = getRelativeHeight(height, ratio);
            const x = centerX - (relative_width / 2);
            const y = centerY - (relative_height / 2);
            const radius = 6;
            const type = 'fill';

            drawRoundedRectangle(x+5, y+5, relative_width, relative_height, radius, type, '#121212', 0.3);
            drawRoundedRectangle(x, y, relative_width, relative_height, radius, type, '#121212', 1);

            context.beginPath();
            context.fillStyle = 'rgba(255, 255, 255, 1)';
            context.font = '12px Roboto';
            context.textBaseline = 'middle';
            context.fillText('Design By Whatpull', x+120, y+(175-30));
            context.fill();
        }

        const drawMovieSlateHead = (centerX, centerY) => {
            const margin = 20;
            const width = 252;
            const height = 30;
            const relative_width = getRelativeWidth(width, margin);
            const ratio = relative_width/width;
            const relative_height = getRelativeHeight(height, ratio);
            const x = centerX - (relative_width / 2);
            const y = centerY - (getRelativeHeight(210, ratio) / 2);
            const radius = 2;
            const type = 'fill';
            const rotate = -15 * Math.PI / 180; // TODO 해당 각도를 수정하여 슬레이트를 적용한다.(애니메이션)
            
            drawRoundedRectangle(x, y+5, relative_width, relative_height, radius, type, '#121212', 0.1);
            drawRoundedRectangle(x, y, relative_width, relative_height, radius, type, movieSlatePattern.current, 1);
            context.translate(x, y);
            context.rotate(rotate);
            context.translate(-x, -y-25);
            drawRoundedRectangle(x, y, relative_width, relative_height, radius, type, movieSlatePattern.current, 1, rotate);
        }

        /**
         * 라운드 사각형
         * 위치 좌표(x, y), 도형 크기(width, height)
         * @param {*} type (타입 : line(선), fill(채우기))
         */
        const drawRoundedRectangle = (x, y, width, height, radius, type, color, alpha, rotate) => {
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
            context.globalAlpha = alpha;
            if(rotate) context.rotate(rotate);
            if(type === 'fill') {
                context.fillStyle = color;
                context.fill();
            } else {
                context.strokeStyle = color;
                context.stroke();
            }
        }

        const initCanvas = () => { // canvas 사이즈 조절
            context.imageSmoothingEnabled = true;
            context.translate(0.5, 0.5);
            context.canvas.width = canvas.current.clientWidth;
            context.canvas.height = canvas.current.clientHeight;
            clearContext();
            drawContext();
        }

        const initPattern = () => {
            const pattern_canvas = document.createElement('canvas');
            pattern_canvas.width = 40;
            pattern_canvas.height = 40;
            const pattern_context = pattern_canvas.getContext('2d');
            drawPattern(0, 0, 40, 40, pattern_context, '#EEEEEE', '#212121');
            movieSlatePattern.current = pattern_context.createPattern(pattern_canvas, "repeat");
        }

        // TODO 패턴 개발
        const drawPattern = (x, y, width, height, context, rectColor, lineColor) => {
            context.beginPath();
            context.fillStyle = rectColor;
            context.fillRect(x, y, width, height);

            context.beginPath();
            context.fillStyle = lineColor;
            context.lineWidth = 1;
            context.moveTo(20, 0);
            context.lineTo(40, 0);
            context.lineTo(20, 40);
            context.lineTo(0, 40);
            context.closePath();
            context.fill();
        }

        if(canvas) {
            if(typeof context === "undefined") {
                setContext(canvas.current.getContext("2d"));
            }
            if(context) {
                initPattern();
                window.addEventListener('resize', initCanvas);
                initCanvas();
            }
        }

        return() => {
            window.removeEventListener('resize', initCanvas);
            if(canvas && context) {
                clearContext();
            }
        }
    }, [context])

    return(
        <div
            ref={wrap} 
            className={style.splash__canvasWrap}>
            <canvas 
                ref={canvas}
                className={style.splash__canvasFull}>
            </canvas>
        </div>
    )
}