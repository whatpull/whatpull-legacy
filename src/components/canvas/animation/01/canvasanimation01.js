import React, { useState, useEffect, useRef } from 'react';
import * as style from './canvasanimation01.module.css';

export default function CanvasAnimation01({ type, ratio, background }) {
    const [context, setContext] = useState();
    const canvas = useRef();
    const centerX = useRef(0);
    const centerY = useRef(0);
    const patternTentVinylImage = useRef();

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
            const drawTent = (fillColor, degree, moveX, moveY, width, height, alpha) => {
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
                context.globalAlpha = alpha;
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
            const drawFloar = (fillColor, width, height, centeralPlusX) => {
                const startX = centerX.current - (width / 2) + centeralPlusX;
                const startY = centerY.current - (height / 2) + 85;
                const line01X = startX + width;
                const line01Y = startY;
                const line02X = line01X - (width / 2);
                const line02Y = startY + height;

                context.save();
                context.beginPath();
                context.globalAlpha = 0.7;
                context.moveTo(startX, startY);
                context.lineTo(line01X, line01Y);
                context.lineTo(line02X, line02Y);
                context.closePath();
                context.fillStyle = fillColor;
                context.fill();
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
            // 중점 이동좌표
            const centeralPlusX = 15;
            if(type === 'front') {
                // 텐트 오른쪽
                context.save()
                context.beginPath();
                drawTent('rgba(205, 0, 0, 1)', 13, -53, -3, 200, 200, 0.6);
                // context.globalCompositeOperation = 'source-atop';
                drawDoor('rgba(18, 18, 18, 1)', 13, -60, 45, 70);
                context.globalCompositeOperation = 'destination-out'
                drawDoor('rgba(205, 0, 0, 1)', 13, -60, 45, 66);
                context.restore();
                // 텐트 왼쪽
                context.save()
                context.beginPath();
                drawTent('rgba(255, 0, 0, 1)', -13, 53, 4, 200, 200, 0.6);
                context.globalCompositeOperation = 'source-atop';
                drawDoor('#2C3539', -13, 95, 55, 70);
                drawDoor('rgba(255, 0, 0, 1)', -13, 95, 55, 66);
                context.restore();
            } else if(type === 'back') {
                context.save();
                context.beginPath();
                // 텐트 지지대
                drawTent('#2C3539', 0, 0, -35, 368, 175, 1);
                drawTent(background, 0, 0, -32, 365, 175, 1);
                context.restore();
                // 텐트 뒷면
                context.save();
                context.beginPath();
                drawTent('rgba(215, 0, 0, 1)', 0, 0, -25, 390, 170, 1);
                drawFloar('rgba(215, 0, 0, 1)', 390, 50, centeralPlusX);
                context.restore();
                // 조명 효과
                context.globalCompositeOperation = 'source-atop';
                drawLamp('rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0)', 100, Math.PI * 0, Math.PI * 2, 15, -150);
                drawLamp('rgba(255, 255, 255, 0.3)', 'rgba(0, 0, 0, 0)', 100, Math.PI * 0, Math.PI * 2, 15, -160);
                drawLamp('rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 0, 0)', 50, Math.PI * 0, Math.PI * 2, 15, -40);
                drawLamp('rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 0, 0.1)', 100, Math.PI * 1, Math.PI * 2, 15, -40);
            }
            // 텐트 정면 지지대
            drawRoundedRectangle(centerX.current + centeralPlusX, centerY.current - 135, 3, 245, 0, 'fill', '#2C3539');
        }

        const drawLamp = (startColor, endColor, radius, startAngle, endAngle, moveX, moveY) => {
            const x = centerX.current + moveX;
            const y = centerY.current + moveY;
            const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, startColor);
            gradient.addColorStop(1, endColor);
            context.beginPath();
            context.arc(x, y, radius, startAngle, endAngle, true);
            context.fillStyle = gradient;
            context.fill();
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

        const loadImage = (callback) => {
            if(typeof patternTentVinylImage.current === 'undefined')  {
                patternTentVinylImage.current = new Image();
                patternTentVinylImage.current.onload = function() {
                    if(typeof callback === 'function') callback();
                }
                patternTentVinylImage.current.src = '/pattern_tent_vinyl.png';
            } else {
                if(typeof callback === 'function') callback();
            }
        }

        const initialize = () => {
            if(canvas) {
                if(typeof context === "undefined") {
                    setContext(canvas.current.getContext("2d"));
                }
                if(context) {
                    loadImage(() => {
                        initCanvas();
                        window.addEventListener('resize', initCanvas);
                    })
                }
            }
        }

        initialize();
        return() => {
            window.removeEventListener('resize', initCanvas);
            if(canvas && context) {
                clearContext();
            }
        }
    }, [context, type, ratio, background])

    return (
        <canvas
            style={{ zIndex: type === 'front' ? 2 : 0 }}
            ref={canvas}
            className={style.canvasanimation01__canvasFull}>
        </canvas>
    )
}