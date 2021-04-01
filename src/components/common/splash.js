import React, { useState, useEffect, useRef } from 'react'
import * as style from './splash.module.css'

export default function Splash() {
    const [context, setContext] = useState();
    const wrap = useRef();
    const canvas = useRef();
    const svg = useRef();
    const patternSlateImage = useRef();
    const patternSlateReverseImage = useRef();
    const raf = useRef();
    const rafStartTime = useRef();
    const movieSlateAnimationSpeed = useRef(1);
    const ratio = 1.3;

    useEffect(() => {
        const clearContext = () => {
            if(canvas.current) context.clearRect(0, 0, canvas.current.width, canvas.current.height);
        }

        const drawContext = (progress) => {
            context.strokeStyle = '#ffffff';
            context.fillStyle = '#ffffff';
            const centerX = context.canvas.width / 2;
            const centerY = context.canvas.height / 2;
            drawMovieSlateBody(centerX, centerY);
            drawMovieSlateHead(centerX, centerY, progress);
            drawMovieSlateHeadConnector(centerX, centerY);
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

            context.save();
            context.beginPath();
            context.fillStyle = 'rgba(255, 255, 255, 1)';
            context.font = '14px Roboto';
            context.textBaseline = 'middle';
            context.fillText('Design By Whatpull', x+105, y+(145));
            context.restore();
        }

        const drawMovieSlateHead = (centerX, centerY, progress) => {
            const width = 250;
            const height = 25;
            const x = centerX - (width / 2);
            const y = centerY - (190 / 2);
            const radius = 2;
            const type = 'fill';
            const degree = -1 * (20 - progress); // 20 ~ 0 
            const rotate = degree * Math.PI / 180;

            context.save();
            context.beginPath();
            drawRoundedRectangle(x-1, y+5, width, height, radius, type, '#212121', 0.1);
            drawRoundedRectangle(x-1, y, width, height, radius, type, '#FFFFFF', 1);
            context.drawImage(patternSlateImage.current, x-1, y, width+1, height);
            context.restore();

            context.save();
            context.beginPath();
            context.translate(x, y);
            context.rotate(rotate);
            context.translate(-x, -y);
            drawRoundedRectangle(x-1, y-26, width, height, radius, type, '#FFFFFF', 1);
            context.drawImage(patternSlateReverseImage.current, x-1, y-26, width+1, height);
            context.restore();
        }

        const drawMovieSlateHeadConnector = (centerX, centerY) => {
            const width = 30;
            const height = 55;
            const x = centerX - (width / 2) - 110;
            const y = centerY - (height / 2) - 95;

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

            const boltColor = 'rgba(255, 255, 255, 0.06)';
            // 나사 [top, left]
            context.save();
            context.beginPath();
            context.fillStyle = boltColor;
            context.moveTo(x, y);
            context.arc(x + 5, y + 8, 2, 0, Math.PI * 2, true);
            context.fill();
            context.restore();

            // 나사 [top, right]
            context.save();
            context.beginPath();
            context.fillStyle = boltColor;
            context.moveTo(x, y);
            context.arc(x + 18, y + 13, 2, 0, Math.PI * 2, true);
            context.fill();
            context.restore();

            // 나사 [bottom, right]
            context.save();
            context.beginPath();
            context.fillStyle = boltColor;
            context.moveTo(x, y);
            context.arc(x + 18, y + 40, 2, 0, Math.PI * 2, true);
            context.fill();
            context.restore();

            // 나사 [bottom, left]
            context.save();
            context.beginPath();
            context.fillStyle = boltColor;
            context.moveTo(x, y);
            context.arc(x + 5, y + 45, 2, 0, Math.PI * 2, true);
            context.fill();
            context.restore();
        }

        /**
         * 라운드 사각형
         * 위치 좌표(x, y), 도형 크기(width, height)
         * @param {*} type (타입 : line(선), fill(채우기))
         */
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

        const initCanvas = (progress) => {
            context.canvas.width = canvas.current.clientWidth * ratio;
            context.canvas.height = canvas.current.clientHeight * ratio;
            clearContext();
            drawContext(progress);
            context.imageSmoothingEnabled = true;
            context.translate(0.5, 0.5);
        }

        const animate = time => {
            if(typeof rafStartTime.current === "undefined") rafStartTime.current = time;
            const progress = time - rafStartTime.current;
            const degree = 20;
            const calculate = Math.min(((progress + (movieSlateAnimationSpeed.current++)*5) / degree), degree);
            initCanvas(calculate);
            if(calculate === degree) { // 초기화
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
            if(typeof patternSlateImage.current === "undefined") patternSlateImage.current = new Image(260, 260);
            if(typeof patternSlateReverseImage.current === "undefined") patternSlateReverseImage.current = new Image(260, 260);
            patternSlateImage.current.onload = function() {
                patternSlateReverseImage.current.onload = function() {
                    if(typeof callback === "function") callback();
                }
                patternSlateReverseImage.current.src = '/pattern_slate_top.png';
            }
            patternSlateImage.current.src = '/pattern_slate_bottom.png';
        }

        if(canvas) {
            if(typeof context === "undefined") {
                setContext(canvas.current.getContext("2d"));
            }
            if(context) {
                loadImage(() => {
                    initCanvas(20);
                    startAnimation();
                    window.addEventListener('resize', initCanvas);
                });
            }
        }

        return() => {
            window.removeEventListener('resize', initCanvas);
            if(canvas && context) {
                cancelAnimation();
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
            <svg ref={svg}></svg>
        </div>
    )
}