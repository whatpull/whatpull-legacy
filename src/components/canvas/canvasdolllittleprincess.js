import React, { useState, useEffect, useRef } from 'react';
import * as style from './canvasdolllittleprincess.module.css'

export default function CanvasDollLittlePrincess() {
    const [context, setContext] = useState();
    const canvas = useRef();
    const centerX = useRef(0);
    const centerY = useRef(0);
    const ratio = 1.5;

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

            const headRadius = 15;
            const hairRadius = 3;
            const neckHeight = 10;
            const bodyRadius = 10;
            const bodyHeight = 30;
            drawDollHead(centerX.current, centerY.current - bodyRadius - bodyHeight, headRadius, hairRadius);
            drawDollNeck(centerX.current, centerY.current - bodyRadius - bodyHeight, headRadius, neckHeight);
            drawDollBody(centerX.current, centerY.current - bodyRadius - bodyHeight, headRadius, hairRadius, neckHeight, bodyRadius, bodyHeight);
            drawClawCraneGameGlass(centerX.current, centerY.current);
        }

        const drawDollHead = (centerX, centerY, headRadius, hairRadius) => {
            const radius = headRadius;
            const x = centerX;
            const y = centerY;

            drawDollBackHair(radius, x, y, hairRadius);
            
            context.save();
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2, true);
            context.fillStyle = '#FBCEB1';
            context.fill();
            context.restore();

            drawDollFrontHair(radius, x, y);
        }

        const drawDollBackHair = (faceRadius, faceX, faceY, hairRadius) => {
            const radius = faceRadius + hairRadius;

            context.save();
            context.beginPath();
            context.arc(faceX, faceY, radius, Math.PI, Math.PI * 2, false);
            context.fillStyle = '#FFFFFF';
            context.fill();
            context.restore();

            const x = faceX - radius;
            const y = faceY;

            context.save();
            context.beginPath();
            context.moveTo(x, y);
            context.bezierCurveTo(x, y, x + 5, y + radius * 0.75, x - 5, y + radius * 1.5 + 10);
            context.lineTo((x + radius * 2) + 5, y + radius * 1.5 + 10);
            context.bezierCurveTo((x + radius * 2) + 5, y + radius * 1.5 + 10, (x + radius * 2) - 5, y + radius * 0.75, (x + radius * 2), y);
            context.fillStyle = '#FFFFFF';
            context.fill();
            context.restore();
        }

        const drawDollFrontHair = (faceRadius, faceX, faceY) => {
            context.save();
            context.beginPath();
            context.arc(faceX, faceY, faceRadius, Math.PI * 0, Math.PI * 1, true);
            context.closePath();
            context.fillStyle = '#FFFFFF';
            context.fill();
            context.restore();
        }

        const drawDollNeck = (centerX, centerY, headRadius, neckHeight) => {
            const width = 8;
            const height = neckHeight;
            const x = centerX - (width / 2);
            const y = centerY + headRadius;
            const radius = 0;
            const type = 'fill';

            drawRoundedRectangle(x, y, width, height, radius, type, '#FBCEB1', 1);
        }

        const drawDollBody = (centerX, centerY, headRadius, hairRadius, neckHeight, bodyRadius, bodyHeight) => {
            const radius = bodyRadius;
            const x = centerX;
            const y = centerY + headRadius + hairRadius + neckHeight;

            context.save();
            context.beginPath();
            context.arc(x, y, radius, Math.PI, Math.PI * 2, false);
            context.moveTo(x - radius, y);
            context.lineTo(x - radius, y + bodyHeight);
            context.lineTo(x + radius, y + bodyHeight);
            context.lineTo(x + radius, y);
            context.fillStyle = '#964B00';
            context.fill();
            context.restore();
        }

        const drawClawCraneGameGlass = (centerX, centerY) => {
            const width = 240;
            const height = 240;
            const x = centerX - (width / 2);
            const y = centerY - (height / 2) - 100;
            const radius = 0;
            const type = 'fill';

            drawRoundedRectangle(x, y, width, height, radius, type, 'rgba(246, 254, 255, 0.5)', 1); // 유리 앞면
            drawRoundedRectangle(x - 1, y + height - 10, width + 2, 10, radius, type, '#008080', 1); // 유리 하단(유리 거치대)
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

        const initCanvas = () => {
            context.canvas.width = canvas.current.clientWidth * ratio;
            context.canvas.height = canvas.current.clientHeight * ratio;
            centerX.current = context.canvas.width / 2;
            centerY.current = context.canvas.height / 2;
            clearContext();
            drawContext();
            context.imageSmoothingEnabled = true;
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
            }
        }

        return() => {
            window.removeEventListener('resize', initCanvas);
        }
    }, [context])

    return (
        <canvas
            ref={canvas}
            className={style.clawcranegame__canvasFull}>
        </canvas>
    )
}