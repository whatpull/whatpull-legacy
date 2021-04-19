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
                const line03X = line02X + (((width / 2) / 2) / 2) + 15;
                const line03Y = line02Y + (height - 30);
                const line04X = line03X - width;
                const line04Y = line03Y;
                const line05X = line04X + (((width / 2) / 2) / 2) + 15;
                const line05Y = line04Y - (height - 30);
                const line06X = line05X + ((width / 2) / 2);
                const line06Y = line05Y - 30;
    
                context.save();
                context.beginPath();
                context.translate(startX, startY);
                context.rotate(degree * (Math.PI / 180));
                context.translate(-startX + moveX, -startY + moveY);
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

            const drawDoor = (fillColor, degree, moveX, moveY, radius) => {
                const startX = centerX.current;
                const startY = centerY.current;
                const line01X = startX + radius;
                const line01Y = startY;
                const line02X = line01X;
                const line02Y = startY + radius;
                const line03X = line02X - (2 * radius);
                const line03Y = line02Y;
                const line04X = line03X;
                const line04Y = line03Y - radius;
                const line05X = line04X + radius;
                const line05Y = line04Y;

                context.save();
                context.beginPath();
                context.translate(startX, startY);
                context.rotate(degree * (Math.PI / 180));
                context.translate(-startX + moveX, -startY + moveY);
                context.moveTo(startX, startY);
                context.arc(startX, startY, radius, Math.PI * 1, Math.PI * 2, false);
                context.closePath();
                context.lineTo(line01X, line01Y);
                context.lineTo(line02X, line02Y);
                context.lineTo(line03X, line03Y);
                context.lineTo(line04X, line04Y);
                context.lineTo(line05X, line05Y);
                context.fillStyle = fillColor;
                context.fill();
                context.strokeStyle = '#121212';
                // context.stroke();
                context.restore();
            }
            // 텐트 지지대
            drawTent('#121212', 0, 0, -38, 363, 180);
            drawTent('#673AB7', 0, 0, -35, 360, 180);
            // 텐트 뒷면
            drawTent('rgba(205, 0, 0, 1)', 0, 0, -25, 390, 170);
            // 텐트 오른쪽
            context.save()
            context.beginPath();
            drawTent('rgba(235, 0, 0, 0.95)', 13, -53, -3, 200, 200);
            context.globalCompositeOperation = 'source-atop';
            drawDoor('#121212', 5, -70, 35, 70);
            drawDoor('rgba(255, 0, 0, 1)', 5, -70, 35, 66);
            context.restore();
            // 텐트 왼쪽
            context.save()
            context.beginPath();
            drawTent('rgba(225, 0, 0, 0.95)', -13, 53, 4, 200, 200);
            context.globalCompositeOperation = 'source-atop';
            drawDoor('#121212', -5, 100, 37, 70);
            drawDoor('rgba(255, 0, 0, 1)', -5, 100, 37, 66);
            context.restore();
            // 텐트 정면 지지대
            drawRoundedRectangle(centerX.current + 12.5, centerY.current - 138, 3, 245, 0, 'fill', '#121212');
        }

        /** @param {*} type (타입 : line(선), fill(채우기)) */
        const drawRoundedRectangle = (x, y, width, height, radius, type, color, alpha) => {
            const topRight = typeof radius === 'number' ? radius : radius.topRight;
            const bottomRight = typeof radius === 'number' ? radius : radius.bottomRight;
            const bottomLeft = typeof radius === 'number' ? radius : radius.bottomLeft;
            const topLeft = typeof radius === 'number' ? radius : radius.topLeft;
            context.save();
            context.beginPath();
            context.moveTo(x + (topRight * 2), y);
            context.arcTo(x + width, y, x + width, y + (topRight * 2), topRight); // top, right
            context.lineTo(x + width, y + (topRight * 2));
            context.arcTo(x + width, y + height, x + width - (bottomRight * 2), y + height, bottomRight); // bottom, right
            context.lineTo(x + width - (bottomRight * 2), y + height);
            context.arcTo(x, y + height, x, y + height - (bottomLeft * 2), bottomLeft); // bottom, left
            context.lineTo(x, y + height - (bottomLeft * 2));
            context.arcTo(x, y, x + (topLeft * 2), y, topLeft); // top, left
            context.lineTo(x + (topLeft * 2), y);
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