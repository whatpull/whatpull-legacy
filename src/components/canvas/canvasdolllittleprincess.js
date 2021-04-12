import React, { useState, useEffect, useRef } from 'react';
import * as style from './canvasdolllittleprincess.module.css'

export default function CanvasDollLittlePrincess({ isCatch, animationCrane }) {
    const [context, setContext] = useState();
    const canvas = useRef();
    const centerX = useRef(0);
    const centerY = useRef(0);

    useEffect(() => {
        const ratio = 1.5;

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

            const animate = animationCrane();
            const x = centerX.current + animate.craneMoveX;
            const y = centerY.current - bodyRadius - bodyHeight + ((isCatch && (animate.craneDirection === 'up' || animate.craneDirection === 'left')) ? (animate.craneMoveY - 100) : 0);
            drawDollHead(x, y, headRadius, hairRadius);
            drawDollBody(x, y, headRadius, hairRadius, neckHeight, bodyRadius, bodyHeight);
            drawDollNeck(x, y, headRadius, neckHeight);
            drawClawCraneGameGlass(centerX.current, centerY.current);
        }

        const drawDollHead = (centerX, centerY, headRadius, hairRadius) => {
            const radius = headRadius;
            const x = centerX;
            const y = centerY;

            drawDollBackHair(radius, x, y, hairRadius);
            drawDollFace(radius, x, y);
            drawDollFrontHair(radius, x, y);
        }

        const drawDollFace = (faceRadius, faceX, faceY) => {
            context.save();
            context.beginPath();
            context.arc(faceX, faceY, faceRadius, 0, Math.PI * 2, true);
            context.fillStyle = '#FBCEB1';
            context.fill();
            context.restore();

            const drawDollEye = (direction) => {
                const x = direction === 'right' ? faceX - 7 : faceX + 7;
                const y = faceY + 2;
                context.save();
                context.beginPath();
                context.arc(x, y, 3, 0, Math.PI * 2, true);
                context.fillStyle = '#121212';
                context.fill();
                context.restore();
            }

            drawDollEye('right');
            drawDollEye('left');
        }

        const drawDollBackHair = (faceRadius, faceX, faceY, hairRadius) => {
            const radius = faceRadius + hairRadius;

            context.save();
            context.beginPath();
            context.arc(faceX, faceY, radius, Math.PI, Math.PI * 2, false);
            context.fillStyle = '#121212';
            context.fill();
            context.restore();

            const x = faceX - radius;
            const y = faceY;

            context.save();
            context.beginPath();
            context.moveTo(x, y);
            context.bezierCurveTo(x, y, x - 2, y + radius * 0.325, x, y + radius * 0.75);
            context.bezierCurveTo(x, y + radius * 0.75, x - 3, y + radius * 1.075, x - 1, y + radius * 1.5);
            context.bezierCurveTo(x - 1, y + radius * 1.5, x - 4, y + radius * 1.5 + 5, x - 3, y + radius * 1.5 + 10);
            // 우측
            // context.lineTo((x + radius * 2) + 7, y + radius * 1.5 + 20);
            context.bezierCurveTo(x - 3, y + radius * 1.5 + 10, (x + radius), y + radius * 1.5 + 20, (x + radius * 2) + 3, y + radius * 1.5 + 10);
            // context.bezierCurveTo(x - 1, y + radius * 1.5, (x + radius), y + radius * 1.5 + 5, (x + radius * 2) + 1, y + radius * 1.5);
            // 좌측
            context.bezierCurveTo((x + radius * 2) + 3, y + radius * 1.5 + 10, (x + radius * 2) + 4, y + radius * 1.5 + 5, (x + radius * 2) + 1, y + radius * 1.5);
            context.bezierCurveTo((x + radius * 2) + 1, y + radius * 1.5, (x + radius * 2) + 3, y + radius * 1.075, (x + radius * 2), y + radius * 0.75);
            context.bezierCurveTo((x + radius * 2), y + radius * 0.75, (x + radius * 2) + 2, y + radius * 0.325, (x + radius * 2), y);
            context.fillStyle = '#121212';
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
            context.lineWidth = 3;
            context.strokeStyle = '#121212';
            context.stroke();
            context.restore();

            context.save();
            context.beginPath();
            context.arc(faceX, faceY, faceRadius - 3, Math.PI * 0, Math.PI * 1, true);
            context.closePath();
            context.fillStyle = '#121212';
            context.fill();
            context.restore();

            context.save();
            context.beginPath();
            context.arc(faceX, faceY + 2, faceRadius - 5, Math.PI * 0, Math.PI * 1, true);
            context.closePath();
            context.fillStyle = '#FBCEB1';
            context.fill();
            context.strokeStyle = '#FBCEB1';
            context.stroke();
            context.restore();

            drawRoundedRectangle(faceX - 5, faceY - 15, 10, 5, 0, 'fill', '#121212', 1);
        }

        const drawDollNeck = (centerX, centerY, headRadius, neckHeight) => {
            const width = 8;
            const height = neckHeight;
            const x = centerX - (width / 2);
            const y = centerY + headRadius;
            const radius = 0;
            const type = 'fill';

            drawRoundedRectangle(x - 5, y, width + 10, height, 2, type, '#008080', 1);
            drawRoundedRectangle(x, y, width, height, radius, type, '#FBCEB1', 1);
            drawRoundedRectangle(x - 5, y + 2, width + 10, height - 1, 2, type, '#008C8C', 1);
        }

        const drawDollBody = (centerX, centerY, headRadius, hairRadius, neckHeight, bodyRadius, bodyHeight) => {
            const radius = bodyRadius;
            const x = centerX;
            const y = centerY + headRadius + hairRadius + neckHeight;
            const pants = 7;
            const coat = bodyHeight - pants;

            const drawDollCoat = () => {
                context.save();
                context.beginPath();
                context.arc(x, y, radius, Math.PI, Math.PI * 2, false);
                context.moveTo(x - radius, y);
                context.lineTo(x - radius, y + coat);
                context.lineTo(x + radius, y + coat);
                context.lineTo(x + radius, y);
                context.fillStyle = '#6d443b';
                context.fill();
                context.restore();

                const drawDollCoatArm = (direction) => {
                    const armRadius = radius - 2;
                    const relativeX = direction === 'right' ? x - 6 : x + 6;
                    const relativeY = y + 1;
                    const armHeight = coat - 12;
                    context.save();
                    context.beginPath();
                    context.arc(relativeX, relativeY, armRadius, direction === 'right' ? -Math.PI * 1 : Math.PI * 1.5, direction === 'right' ? -Math.PI * 0.5 : Math.PI * 2, false);
                    context.moveTo(relativeX, relativeY - armRadius);
                    context.lineTo(relativeX, relativeY + armHeight);
                    context.lineTo(direction === 'right' ? relativeX - armRadius : relativeX + armRadius, relativeY + armHeight);
                    context.lineTo(direction === 'right' ? relativeX - armRadius : relativeX + armRadius, relativeY);
                    context.fillStyle = '#553a35';
                    context.fill();
                    context.restore();

                    const handRadiusDistance = 4
                    const handRelativeX = direction === 'right' ? relativeX - handRadiusDistance : relativeX + handRadiusDistance;
                    context.save();
                    context.beginPath();
                    context.arc(handRelativeX, relativeY + armHeight, armRadius - handRadiusDistance, Math.PI * 1, Math.PI * 2, true);
                    context.fillStyle = '#FBCEB1';
                    context.fill();
                    context.restore();
                }

                const degree = 0; // 0 ~ 45

                context.save();
                context.beginPath();
                context.translate(x, y);
                context.rotate(degree * Math.PI / 180);
                context.translate(-x - (degree / 20), -y + (degree / 10));
                drawDollCoatArm('right');
                context.restore();

                context.save();
                context.beginPath();
                context.translate(x, y);
                context.rotate(-degree * Math.PI / 180);
                context.translate(-x + (degree / 20), -y + (degree / 10));
                drawDollCoatArm('left');
                context.restore();
            }

            const drawDollPants = () => {
                context.save();
                context.beginPath();
                context.moveTo(x - radius, y + coat);
                context.lineTo(x - radius, y + coat + pants);
                context.lineTo(x + radius, y + coat + pants);
                context.lineTo(x + radius, y + coat);
                context.fillStyle = '#0A6EFF';
                context.fill();
                context.restore();

                clearContext(x - 1, y + coat + 2, 2, pants);
            }

            const drawDollShoes = (direction) => {
                const relativeX = direction === 'right' ? x - 5 : x + 5;
                const relativey = y + coat + pants + 2;
                context.save();
                context.beginPath();
                context.arc(relativeX, relativey, 5, Math.PI * 1, Math.PI * 2, false);
                context.fillStyle = '#4d3b33';
                context.fill();
                context.restore();
            }

            drawDollCoat();
            drawDollPants();
            drawDollShoes('right');
            drawDollShoes('left');
        }

        const drawClawCraneGameGlass = (centerX, centerY) => {
            const width = 240;
            const height = 240;
            const x = centerX - (width / 2);
            const y = centerY - (height / 2) - 100;
            const radius = 0;
            const type = 'fill';

            drawRoundedRectangle(x, y, width, height, radius, type, 'rgba(246, 254, 255, 0.5)', 1); // 유리 앞면
            drawRoundedRectangle(x - 1, y + height - 2, width + 2, 2, radius, type, '#008080', 1); // 유리 하단(유리 거치대)
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
            if(canvas && context) {
                clearContext();
            }
        }
    }, [context, isCatch, animationCrane])

    return (
        <canvas
            ref={canvas}
            className={style.clawcranegame__canvasFull}>
        </canvas>
    )
}