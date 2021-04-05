import React, { useState, useEffect, useRef } from 'react'
import * as style from './clawcranegame.module.css'

export default function ClawCraneGame() {
    const [context, setContext] = useState();
    const wrap = useRef();
    const canvas = useRef();
    const raf = useRef();
    const rafStartTime = useRef();
    const movieSlateAnimationSpeed = useRef(1);
    const ratio = 1.2;

    useEffect(() => {
        const clearContext = () => {
            if(canvas.current) context.clearRect(0, 0, canvas.current.width, canvas.current.height);
        }

        const drawContext = () => {
            context.strokeStyle = '#FFFFFF';
            context.fillStyle = '#FFFFFF';
            const centerX = context.canvas.width / 2;
            const centerY = context.canvas.height / 2;

            context.save();
            drawClawCraneGameBody(centerX, centerY);
            context.globalCompositeOperation = 'source-atop';
            drawClawCraneGameHead(centerX, centerY);
            context.restore();
            drawClawCraneGameFoot(centerX, centerY);
        }

        const drawClawCraneGameHead = (centerX, centerY) => {
            const width = 240;
            const height = 10;
            const x = centerX - (width / 2);
            const y = centerY - (height / 2) - 220;

            context.save();
            context.beginPath();
            context.moveTo(x - 10, y);
            context.lineTo(x + width + 10, y);
            context.lineTo(x + width, y + height);
            context.lineTo(x, y + height);
            context.closePath();
            context.fillStyle = '#56B2AA';
            context.fill();
            context.restore();
        }

        const drawClawCraneGameBody = (centerX, centerY) => {
            const width = 300;
            const height = 500;
            const x = centerX - (width / 2);
            const y = centerY - (height / 2);
            const radius = 6;
            const type = 'fill';

            drawRoundedRectangle(x+3, y+3, width, height, radius, type, '#121212', 0.5);
            drawRoundedRectangle(x, y, width, height, radius, type, '#009688', 1);

            drawClawCraneGameGlass(centerX, centerY);
            drawClawCraneGameControlBox(centerX, centerY);
            drawClawCraneGameExitBox(centerX, centerY);
        }

        const drawClawCraneGameGlass = (centerX, centerY) => {
            const width = 240;
            const height = 240;
            const x = centerX - (width / 2);
            const y = centerY - (height / 2) - 100;
            const radius = 0;
            const type = 'fill';

            drawRoundedRectangle(x, y, width, height, radius, type, 'rgba(255, 255, 255, 0.7)', 1); // 유리 뒷면
            // TODO 인형 및 기타
            drawRoundedRectangle(x, y, width, height, radius, type, 'rgba(255, 255, 255, 0.1)', 1); // 유리 앞면
            drawRoundedRectangle(x, y + height - 29, width, 30, radius, type, '#008080', 1); // 유리 하단(유리 거치대)
        }

        const drawClawCraneGameControlBox = (centerX, centerY) => {
            const width = 240;
            const height = 60;
            const x = centerX - (width / 2);
            const y = centerY - (height / 2) + 50;

            // clear
            if(canvas.current) context.clearRect(x, y, width, height);

            context.save();
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x + width, y);
            context.lineTo(x + width + 25, y + height);
            context.lineTo(x - 25, y + height);
            context.closePath();
            context.fillStyle = '#20B2AA';
            context.fill();
            context.restore();

            const buttonBottom = (relativeX, relativeY) => {
                const width = 24;
                const height = 8;
                const x = relativeX - (width / 2);
                const y = relativeY - (height / 2);
                const radius = 2;
                const type = 'fill';

                drawRoundedRectangle(x + 2, y, width, height, radius, type, '#121212', 0.3);
                drawRoundedRectangle(x, y, width, height, radius, type, '#121212', 1);
            }

            const joystick = (relativeX, relativeY, degree) => {
                const joystickBody = (relativeX, relativeY)=> {
                    const width = 4;
                    const height = 20;
                    const x = relativeX - (width / 2);
                    const y = relativeY - (height / 2);
                    const radius = 2;
                    const type = 'fill';

                    drawRoundedRectangle(x+1, y+1, width, height, radius, type, '#121212', 0.3);
                    drawRoundedRectangle(x, y, width, height, radius, type, '#EEEEEE', 1);
                }
                const joystickHead = (relativeX, relativeY) => {
                    const radius = 10;
                    const x = relativeX;
                    const y = relativeY - radius * 2;

                    context.save();
                    context.beginPath();
                    context.arc(x+2, y+2, radius, 0, Math.PI * 2, true);
                    context.fillStyle = 'rgba(0, 0, 0, 0.3)';
                    context.fill();
                    context.restore();
                    
                    context.save();
                    context.beginPath();
                    context.arc(x, y, radius, 0, Math.PI * 2, true);
                    context.fillStyle = '#DC143C';
                    context.fill();
                    context.restore();

                    context.save();
                    context.beginPath();
                    context.arc(x + 2, y + 2, radius, Math.PI * -0.5, Math.PI * -1, true);
                    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    context.fill();
                    context.restore();

                    context.save();
                    context.beginPath();
                    context.arc(x + 2, y + 2, radius - 3, Math.PI * -0.5, Math.PI * -2.5, true);
                    context.fillStyle = 'rgba(255, 0, 0, 0.8)';
                    context.fill();
                    context.restore();
                }

                context.save();
                context.translate(relativeX + 90, relativeY - 10);
                context.rotate(degree * Math.PI / 180);
                context.translate(-relativeX - 90, -relativeY + 10);
                joystickBody(relativeX + 90 + (degree / 5), relativeY - 10);
                joystickHead(relativeX + 90 + (degree / 5), relativeY - 10);
                context.restore();
                buttonBottom(relativeX + 90, relativeY);
            }

            const buttonDown = (relativeX, relativeY, downY) => {
                const width = 20;
                const height = 8;
                const x = relativeX - (width / 2) + 60;
                const y = relativeY - (height / 2) - 5 + downY;
                const radius = 3;
                const type = 'fill';
                drawRoundedRectangle(x + 2, y, width, height, radius, type, '#121212', 0.3);
                drawRoundedRectangle(x, y, width, height, radius, type, '#FF0000', 1);
                buttonBottom(relativeX + 60, relativeY);
            }

            // 누를때 액션 개발 (0~3까지 다운)
            buttonDown(x + (width / 2) - 10, y + (height / 2), 0);
            // degree - -15 ~ 15도 사이 값(애니메이션)
            joystick(x + (width / 2), y + (height / 2), 15);
        }

        const drawClawCraneGameExitBox = (centerX, centerY) => {
            const exitBoxBody = () => {
                const width = 100;
                const height = 100;
                const x = centerX - (width / 2) - 80;
                const y = centerY - (height / 2) + 165;
                const radius = 5;
                const type = 'fill';
                
                drawRoundedRectangle(x+3, y+3, width, height, radius, type, 'rgba(0, 0, 0, 0.1)', 1); // 출구 그림자
                drawRoundedRectangle(x, y, width, height, radius, type, 'rgba(255, 255, 255, 0.7)', 1); // 출구 유리    
            }
            const exitBoxHandle = () => {
                const width = 80;
                const height = 6;
                const x = centerX - (width / 2) - 80;
                const y = centerY - (height / 2) + 130;
                const radius = 2;
                const type = 'fill';
                drawRoundedRectangle(x, y, width, height, radius, type, '#121212', 1);
            }
            
            exitBoxBody();
            exitBoxHandle();
        }

        const drawClawCraneGameFoot = (centerX, centerY) => {
            const width = 310;
            const height = 25;
            const x = centerX - (width / 2);
            const y = centerY - (height / 2) + 250;
            const radius = 2;
            const type = 'fill';
            drawRoundedRectangle(x+2, y-2, width, height, radius, type, '#121212', 0.5);
            drawRoundedRectangle(x, y, width, height, radius, type, '#121212', 1);
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

        const animateJoyStick = time => {
            if(typeof rafStartTime.current === "undefined") rafStartTime.current = time;
            const progress = time - rafStartTime.current;
            // 애니메이션 동작 적용
            const centerX = context.canvas.width / 2;
            const centerY = context.canvas.height / 2;
            drawClawCraneGameControlBox(centerX, centerY);
        }

        const animateButton = time => {
            if(typeof rafStartTime.current === "undefined") rafStartTime.current = time;
            const progress = time - rafStartTime.current;
            // 애니메이션 동작 적용
        }

        const startAnimation = (animate) => {
            raf.current = requestAnimationFrame(animate);
        }

        const cancelAnimation = () => {
            cancelAnimationFrame(raf.current);
            raf.current = undefined;
            rafStartTime.current = undefined;
        }

        const initCanvas = () => {
            context.canvas.width = canvas.current.clientWidth * ratio;
            context.canvas.height = canvas.current.clientHeight * ratio;
            clearContext();
            drawContext();
            context.imageSmoothingEnabled = true;
            context.translate(0.5, 0.5);
        }

        const handleKeydown = (event) => {
            if(event.keyCode === 39) { // Right
                cancelAnimation();
                startAnimation(animateJoyStick);
            } else if(event.keyCode === 37) { // Left

            }
        }
        
        // 초기 호출 함수
        if(canvas) {
            if(typeof context === "undefined") {
                setContext(canvas.current.getContext("2d"));
            }
            if(context) {
                clearContext();
                initCanvas();
                window.addEventListener('resize', initCanvas);
                window.addEventListener('keydown', handleKeydown);
            }
        }

        return() => {
            window.removeEventListener('resize', initCanvas);
            window.removeEventListener('keydown', handleKeydown);
            if(canvas && context) {
                cancelAnimation();
                clearContext();
            }
        }
    }, [context])

    return (
        <div
            ref={wrap}
            className={style.clawcranegame__canvasWrap}>
            <canvas
                ref={canvas}
                className={style.clawcranegame__canvasFull}>    
            </canvas>
        </div>
    )
}