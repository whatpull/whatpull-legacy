import React, { useState, useEffect, useRef } from 'react';
import * as style from './canvasanimation01.module.css';

export default function CanvasAnimation01({ ratio }) {
    const [context, setContext] = useState();
    const canvas = useRef();
    const centerX = useRef(0);
    const centerY = useRef(0);

    useEffect(() => {
        const clearContext = (paramX, paramY, paramWidth, paramHeight) => {
            if(canvas.current) {
                const x = paramX ? paramX : 0;
                const y = paramY ? paramY : 0;
                const width = paramWidth ? paramWidth : canvas.current.width;
                const height = paramHeight ? paramHeight : canvas.current.height;
                context.clearRect(x, y, width, height);
            }
        }

        const drawContext = () => {
            context.strokeStyle = '#FFFFFF';
            context.fillStyle = '#FFFFFF';

            drawSceneTent();
        }

        const drawSceneTent = () => {
            const drawTent = (fillColor, degree, moveX, moveY, width, height) => {
                const startX = centerX.current;
                const startY = centerY.current - (height / 2);
                const line01X = startX + (((width / 2) / 2) / 2);
                const line01Y = startY; 
                const line02X = line01X + ((width / 2) / 2);
                const line02Y = line01Y + 30;
                const line03X = line02X + (((width / 2) / 2) / 2);
                const line03Y = line02Y + (height - 30);
                const line04X = line03X - width;
                const line04Y = line03Y;
                const line05X = line04X + (((width / 2) / 2) / 2);
                const line05Y = line04Y - (height - 30);
                const line06X = line05X + ((width / 2) / 2);
                const line06Y = line05Y - 30;
    
                context.save();
                context.beginPath();
                context.translate(startX, startY);
                context.rotate(degree * (Math.PI / 180));
                context.translate(-startX + moveX, -startY + moveY);
                context.moveTo(startX, startY);
                context.lineTo(line01X, line01Y);
                context.lineTo(line02X, line02Y);
                context.lineTo(line03X, line03Y);
                context.lineTo(line04X, line04Y);
                context.lineTo(line05X, line05Y);
                context.lineTo(line06X, line06Y);
                context.closePath();
                context.fillStyle = fillColor;
                context.fill();
                context.lineWidth = 2;
                context.strokeStyle = '#121212';
                // context.stroke();
                context.restore();
            }

            context.save();
            context.beginPath();
            drawTent('rgba(205, 0, 0, 1)', 0, 0, -45, 320, 180);
            context.globalCompositeOperation = 'color-dodge';
            drawTent('rgba(255, 0, 0, 1)', -15, 46, 0, 200, 200);
            drawTent('rgba(255, 0, 0, 1)', 15, -47, 0, 200, 200);
            context.restore();
        }

        const initCanvas = () => {
            if(canvas.current) {
                context.canvas.width = canvas.current.clientWidth * ratio;
                context.canvas.height = canvas.current.clientHeight * ratio;
                centerX.current = context.canvas.width / 2;
                centerY.current = context.canvas.height / 2;
                clearContext();
                drawContext();
                context.imageSmoothingEnabled = true;
            }
        }

        const initialize = () => {
            if(canvas) {
                if(typeof context === "undefined") {
                    setContext(canvas.current.getContext("2d"));
                }
                if(context) {
                    initCanvas();
                }
            }
        }

        initialize();
        return() => {
            if(canvas && context) {
                clearContext();
            }
        }
    }, [context, ratio])

    return (
        <canvas
            ref={canvas}
            className={style.canvasanimation01__canvasFull}>
        </canvas>
    )
}