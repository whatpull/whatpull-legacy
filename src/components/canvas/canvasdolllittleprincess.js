import React, { useState, useEffect, useRef } from 'react';
import * as style from './canvasdolllittleprincess.module.css';

// type: scene, [default]: main(clawcranegame - else) 사용타입
// type(scene) - position [x, y]; 이동좌표
// TODO. 자세, 모션 등 애니메이션 추가 개발
export default function CanvasDollLittlePrincess({ type,
                                                    position,
                                                    craneIsCatch, 
                                                    animationCrane, 
                                                    handleSetDollIsCaught,
                                                    craneMaxMoveY,
                                                    ratio }) {
    const [context, setContext] = useState();
    const canvas = useRef();
    const centerX = useRef(0);
    const centerY = useRef(0);
    const isCaught = useRef(false);
    const dollArmShakeDegree = useRef(0);
    const animateDropInterval = useRef();
    const dollDropY = useRef(-100);

    useEffect(() => {
        const minDistanceY = craneMaxMoveY;
        const maxDollArmShakeDegree = 25;
        const minDollDropY = -100;
        const maxDollDropY = 195;
        const animate = animationCrane();
        const gameBoxWidth = 300;

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

            let x = centerX.current;
            let y = centerY.current - bodyRadius - bodyHeight;
            if(type === 'scene' && typeof position === 'object') {
                x = x + position.x;
                y = y + position.y;
            }
            const absX = 5;
            context.save();
            context.beginPath();
            if(animate.craneDirection === 'stop') {
                if(isCaught.current) {
                    x = x + animate.craneMoveX;
                    y = y + dollDropY.current;
                    if(typeof animateDropInterval.current === 'undefined') {
                        animateDropInterval.current = setInterval(animateDropDoll, 1);
                    }
                    handleSetDollIsCaught(true);
                }
            } else if(animate.craneDirection === 'down') {
                if(((x + animate.craneMoveX) - absX <= centerX.current && (x + animate.craneMoveX) + absX >= centerX.current)) {
                    if(animate.craneMoveY === minDistanceY) {
                        isCaught.current = true;
                    }
                }
            }
            if(isCaught.current) {
                x = x + ((craneIsCatch && (animate.craneDirection === 'up' || animate.craneDirection === 'left')) ? animate.craneMoveX : 0);
                y = y + ((craneIsCatch && (animate.craneDirection === 'up' || animate.craneDirection === 'left')) ? (animate.craneMoveY - minDistanceY) : 0);
            }
            drawDollHead(x, y, headRadius, hairRadius);
            drawDollBody(x, y, headRadius, hairRadius, neckHeight, bodyRadius, bodyHeight);
            drawDollNeck(x, y, headRadius, neckHeight);
            context.restore();
            if(typeof type === 'undefined') drawClawCraneGameGlass(centerX.current, centerY.current);
        }

        const drawDollHead = (centerX, centerY, headRadius, hairRadius) => {
            const radius = headRadius;
            const x = centerX;
            const y = centerY;
            let hairColor = '#121212';
            if(type === 'scene') hairColor = '#FFFFFF'; // 머리카락색상(흰색)

            drawDollBackHair(radius, x, y, hairRadius, hairColor);
            drawDollFace(radius, x, y);
            drawDollFrontHair(radius, x, y, hairColor);
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

        const drawDollBackHair = (faceRadius, faceX, faceY, hairRadius, hairColor) => {
            const radius = faceRadius + hairRadius;

            context.save();
            context.beginPath();
            context.arc(faceX, faceY, radius, Math.PI, Math.PI * 2, false);
            context.fillStyle = hairColor;
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
            context.fillStyle = hairColor;
            context.fill();
            context.restore();
        }

        const drawDollFrontHair = (faceRadius, faceX, faceY, hairColor) => {
            context.save();
            context.beginPath();
            context.arc(faceX, faceY, faceRadius, Math.PI * 0, Math.PI * 1, true);
            context.closePath();
            context.fillStyle = '#FFFFFF';
            context.fill();
            context.lineWidth = 3;
            context.strokeStyle = hairColor;
            context.stroke();
            context.restore();

            context.save();
            context.beginPath();
            context.arc(faceX, faceY, faceRadius - 3, Math.PI * 0, Math.PI * 1, true);
            context.closePath();
            context.fillStyle = hairColor;
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

            drawRoundedRectangle(faceX - 5, faceY - 15, 10, 5, 0, 'fill', hairColor, 1);
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

                if(isCaught.current && animate.progress) dollArmShakeDegree.current = (animate.progress * 0.05) % maxDollArmShakeDegree;

                context.save();
                context.beginPath();
                context.translate(x, y);
                context.rotate(dollArmShakeDegree.current * Math.PI / 180);
                context.translate(-x, -y + (dollArmShakeDegree.current / 10));
                drawDollCoatArm('right');
                context.restore();

                context.save();
                context.beginPath();
                context.translate(x, y);
                context.rotate(-dollArmShakeDegree.current * Math.PI / 180);
                context.translate(-x, -y + (dollArmShakeDegree.current / 10));
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

        const animateDropDoll = () => {
            if(dollDropY.current === maxDollDropY) {
                animateDropDollClear();
            } else {
                dollDropY.current++;
                clearContext();
                drawContext();
                clearContext(centerX.current - (gameBoxWidth / 2), centerY.current + 20, gameBoxWidth, 115);
            }
        }

        const animateDropDollClear = () => {
            if(animateDropInterval.current) {
                clearInterval(animateDropInterval.current);
                animateDropInterval.current = undefined;
                dollDropY.current = minDollDropY;
            }
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
                    clearContext();
                    initCanvas();
                    window.addEventListener('resize', initCanvas);
                }
            }
        }

        initialize();
        return() => {
            window.removeEventListener('resize', initCanvas);
            animateDropDollClear();
            if(canvas && context) {
                clearContext();
            }
        }
    }, [context,
        type,
        position,
        craneIsCatch, 
        animationCrane, 
        handleSetDollIsCaught,
        craneMaxMoveY,
        ratio])

    return (
        <canvas
            ref={canvas}
            className={style.clawcranegame__canvasFull}>
        </canvas>
    )
}