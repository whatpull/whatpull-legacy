import React, { useState, useEffect, useRef } from 'react';
import * as style from './canvasclawcrane.module.css';
import icon_wp from '../../images/icon_small.png';
import icon_py from '../../images/icon_py_small.png';

export default function CanvasCrawCrane({ handleSetAudioCatchIsPlay, 
                                            handleCrane, 
                                            dollIsCaught, 
                                            craneMinMoveX,
                                            craneMaxMoveX,
                                            craneMinMoveY,
                                            craneMaxMoveY,
                                            ratio }) {
    const [context, setContext] = useState();
    const canvas = useRef();
    const raf = useRef();
    const rafStartTime = useRef();
    const joystickAnimationSpeed = useRef(1);
    const joystickDirection = useRef();
    const joystickDegree = useRef(0);
    const downbuttonAnimationSpeed = useRef(1);
    const downbuttonDirection = useRef();
    const craneDirection = useRef('start');
    const craneMoveX = useRef(-80);
    const craneMoveY = useRef(0);
    const craneArmDegree = useRef(0);
    const centerX = useRef(0);
    const centerY = useRef(0);
    const logoWPImage = useRef();
    const logoPYImage = useRef();

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

            drawClawCraneGameHead(centerX.current, centerY.current);
            drawClawCraneGameBody(centerX.current, centerY.current);
            drawClawCraneGameFoot(centerX.current, centerY.current);
            drawClawCraneGameLogo(centerX.current, centerY.current);
        }

        const drawClawCraneGameHead = (centerX, centerY) => {
            const drawClawCraneGameHeadBody = () => {
                const width = 300;
                const height = 40;
                const distance = 40;
                const x = centerX - (width / 2);
                const y = centerY - (246 + height);
    
                context.save();
                context.beginPath();
                context.moveTo(x + distance, y);
                context.lineTo(x + width - distance, y);
                context.lineTo(x + width, y + height);
                context.lineTo(x, y + height);
                context.closePath();
                context.fillStyle = '#00796B';
                context.fill();
                context.restore();
            }
            const drawClawCraneGameHeadGlass = (fillColor) => {
                const glassWidth = 240;
                const glassHeight = 25;
                const glassDistance = glassHeight;
                const glassX = centerX - (glassWidth / 2);
                const glassY = centerY - (246 + glassHeight);

                context.save();
                context.beginPath();
                context.moveTo(glassX + glassDistance, glassY);
                context.lineTo(glassX + glassWidth - glassDistance, glassY);
                context.lineTo(glassX + glassWidth, glassY + glassHeight);
                context.lineTo(glassX, glassY + glassHeight);
                context.closePath();
                context.fillStyle = fillColor;
                context.fill();
                context.restore();
            }
            const drawClawCraneGameHeadCraneLine = () => {
                const lineWidth = 230 + 2;
                const lineHeight = 5;
                const lineDistance = lineHeight;
                const lineX = centerX - (lineWidth / 2);
                const lineY = centerY - (250 + lineHeight);

                context.save();
                context.beginPath();
                context.moveTo(lineX + lineDistance, lineY);
                context.lineTo(lineX + lineWidth - lineDistance, lineY);
                context.lineTo(lineX + lineWidth, lineY + lineHeight);
                context.lineTo(lineX, lineY + lineHeight);
                context.closePath();
                context.fillStyle = '#121212';
                context.fill();
                context.restore();
            }

            drawClawCraneGameHeadBody();
            drawClawCraneGameHeadGlass('#ABCDED');
            drawClawCraneGameHeadCraneLine();
            drawClawCraneGameHeadGlass('rgba(246, 254, 255, 0.5)');
        }

        const drawClawCraneGameBody = (centerX, centerY) => {
            const width = 300;
            const height = 500;
            const x = centerX - (width / 2);
            const y = centerY - (height / 2);
            const radius = 6;
            const type = 'fill';

            drawRoundedRectangle(x + 5, y + 2, width, height, radius, type, '#121212', 0.1);
            drawRoundedRectangle(x, y, width, height, radius, type, '#009688', 1);

            drawClawCraneGameCeiling(centerX, centerY);
            drawClawCraneGameGlass(centerX, centerY);
            drawClawCraneGameControlBox(centerX, centerY, 0, 0);
            drawClawCraneGameExitBox(centerX, centerY);
        }

        const drawClawCraneGameCeiling = (centerX, centerY) => {
            const width = 240;
            const height = 10;
            const x = centerX - (width / 2);
            const y = centerY - (height / 2) - 225;

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

        const drawClawCraneGameGlass = (centerX, centerY) => {
            const width = 240;
            const height = 240;
            const x = centerX - (width / 2);
            const y = centerY - (height / 2) - 100;
            const radius = 0;
            const type = 'fill';

            drawRoundedRectangle(x, y, width, height, radius, type, '#ABCDED', 1); // 유리 뒷면
            drawClawCraneGameCrane(centerX, y); // -80 ~ 80 사이의 거리
        }

        const drawClawCraneGameCrane = (centerX, centerY) => {
            const x = centerX + craneMoveX.current;
            const y = centerY;
            const craneHandIsOpen = craneDirection.current === 'down' || (craneDirection.current === 'stop' && craneMoveX.current === craneMinMoveX);
            const CraneBody = () => {
                const radius = 10;

                context.save();
                context.beginPath();
                context.arc(x, y, radius + 3, Math.PI * 1, Math.PI * 2, true);
                context.fillStyle = '#000000';
                context.fill();
                context.restore();
            }
            const CraneArm = (increaseHeight) => {
                const calcX = x - 5;
                const calcY = y + 10;
                const width = 10;
                const height = 20;
                const radius = 2;
                const type = 'fill';

                context.save();
                context.beginPath();
                drawRoundedRectangle(calcX, calcY, width, height, radius, type, '#121212', 1);
                drawRoundedRectangle(calcX + 2, calcY, width - 4, height + 10 + increaseHeight, radius, type, '#121212', 1); // 증가선
                context.restore();
            }
            const CraneHand = (direction, increaseHeight, craneHandIsOpen) => {
                const radius = 30;
                const degree = 45;
                const counterclockwise = direction === 'right' ? true : false;
                const calcX = direction === 'right' ? x + 1 : x - 1;
                const calcY = y + radius + 15 + 25 + increaseHeight;

                context.save();
                if(craneHandIsOpen) {
                    context.translate(calcX, calcY);
                    context.rotate(((direction === 'right' ? -1 : 1) * degree) * (Math.PI / 180));
                    context.translate(-calcX, -calcY);
                }

                context.beginPath();
                context.arc(calcX, calcY, radius, Math.PI * 0.5, Math.PI * 1.5, counterclockwise);
                context.fillStyle = '#121212';
                context.fill();
    
                context.beginPath();
                context.arc(calcX + (direction === 'right' ? -1 : 1), calcY, radius - 5, Math.PI * 0.5, Math.PI * 1.5, counterclockwise);
                context.fillStyle = '#ABCDED';
                context.fill();

                context.restore();
            }

            CraneBody();
            CraneArm(craneMoveY.current);
            context.save();
            context.beginPath();
            context.translate(x, y);
            context.rotate(craneArmDegree.current * Math.PI / 180)
            context.translate(-x, -y);
            CraneHand('right', craneMoveY.current, craneHandIsOpen);
            CraneHand('left', craneMoveY.current, craneHandIsOpen);
            context.restore();
        }

        const drawClawCraneGameControlBox = (centerX, centerY, joystickDegree, downbuttonY) => {
            const width = 240;
            const height = 60;
            const x = centerX - (width / 2);
            const y = centerY - (height / 2) + 50;

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

                drawRoundedRectangle(x + 1, y, width, height, radius, type, '#121212', 0.3);
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
                    context.arc(x + 2, y + 2, radius, 0, Math.PI * 2, true);
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

                context.save();
                context.beginPath();
                context.arc(x + 5, y + 5, radius, Math.PI * -0.5, Math.PI * -1, true);
                context.fillStyle = 'rgba(255, 255, 255, 0.8)';
                context.fill();
                context.restore();

                context.save();
                context.beginPath();
                context.arc(x + 5, y + 5, radius - 3, Math.PI * -0.5, Math.PI * -2.5, true);
                context.fillStyle = 'rgba(255, 0, 0, 0.8)';
                context.fill();
                context.restore();

                buttonBottom(relativeX + 60, relativeY);
            }

            buttonDown(x + (width / 2) - 10, y + (height / 2) + 15, downbuttonY);
            joystick(x + (width / 2), y + (height / 2) + 15, joystickDegree);
        }

        const drawClawCraneGameExitBox = (centerX, centerY) => {
            const exitBoxBody = () => {
                const width = 100;
                const height = 100;
                const x = centerX - (width / 2) - 80;
                const y = centerY - (height / 2) + 165;
                const radius = 5;
                const type = 'fill';
                
                drawRoundedRectangle(x + 3, y + 3, width, height, radius, type, 'rgba(0, 0, 0, 0.1)', 1); // 출구 그림자
                drawRoundedRectangle(x, y, width, height, radius, type, 'rgba(246, 254, 255, 0.7)', 1); // 출구 유리    
            }
            const exitBoxHandle = () => {
                const width = 80;
                const height = 6;
                const x = centerX - (width / 2) - 80;
                const y = centerY - (height / 2) + 130;
                const radius = 2;
                const type = 'fill';
                drawRoundedRectangle(x, y, width, height, radius, type, '#121212', 0.7);
            }
            
            exitBoxBody();
            exitBoxHandle();
        }

        const drawClawCraneGameLogo = (centerX, centerY) => {
            const drawWhatpullLogoImage = () => {
                context.save();
                context.beginPath();
                context.globalCompositeOperation='source-atop';
                context.drawImage(logoWPImage.current, centerX + 105, centerY + 185, 30, 30);
                context.restore();
            }
            const drawParyarnLogoImage = () => {
                context.save();
                context.beginPath();
                context.globalCompositeOperation='source-atop';
                context.drawImage(logoPYImage.current, centerX + 70, centerY + 185, 30, 30);
                context.restore();
            }
            const drawParyarnLogoText = () => {
                context.save();
                context.beginPath();
                context.font = '12px Robot';
                context.textBaseline = 'middle';
                context.fillText('Music by parkyan', centerX + 45, centerY + 240);
                context.fill();
                context.restore();
            }

            drawWhatpullLogoImage();
            drawParyarnLogoImage();
            drawParyarnLogoText();
        }

        const drawClawCraneGameFoot = (centerX, centerY) => {
            const width = 300;
            const height = 25;
            const x = centerX - (width / 2);
            const y = centerY - (height / 2) + 240;
            const radius = 6;
            const type = 'fill';
            drawRoundedRectangle(x, y - 5, width, height, radius, type, '#121212', 0.1);
            drawRoundedRectangle(x, y, width, height, {
                topRight: 0,
                bottomRight: radius,
                bottomLeft: radius,
                topLeft: 0
            }, type, '#121212', 1);
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

        const animateJoystick = time => {
            if(typeof rafStartTime.current === "undefined") rafStartTime.current = time;
            const progress = time - rafStartTime.current;

            // [조이스틱]
            const maxJoystickDegree = 15;
            if(joystickDirection.current === 'right') {
                joystickDegree.current = Math.min(joystickDegree.current + Math.round(progress * 0.1), maxJoystickDegree);
            } else if(joystickDirection.current === 'left') {
                joystickDegree.current = Math.max(joystickDegree.current - Math.round(progress * 0.1), -maxJoystickDegree);
            }
            drawClawCraneGameControlBox(centerX.current, centerY.current, joystickDegree.current, 0);

            // [크레인팔]
            if(joystickDirection.current === 'right') {
                craneMoveX.current = Math.min(craneMoveX.current + Math.round(progress * 0.01), craneMaxMoveX);
            } else if(joystickDirection.current === 'left') {
                craneMoveX.current = Math.max(craneMoveX.current - Math.round(progress * 0.01), craneMinMoveX);
            }
            drawClawCraneGameGlass(centerX.current, centerY.current);

            // [크레인손]
            const maxCraneArmDegree = 5;
            if(joystickDirection.current === 'right') {
                craneArmDegree.current = Math.min(craneArmDegree.current + Math.round(progress * 0.01), maxCraneArmDegree);
            } else if(joystickDirection.current === 'left') {
                craneArmDegree.current = Math.max(craneArmDegree.current - Math.round(progress * 0.01), -maxCraneArmDegree);
            }

            startAnimation(animateJoystick);
        }

        const animateDownbutton = time => {
            if(typeof rafStartTime.current === 'undefined') rafStartTime.current = time;
            const progress = time - rafStartTime.current;

            const maxY = 3;
            const calculate = Math.min(((progress * 0.1) / maxY), maxY);
            drawClawCraneGameControlBox(centerX.current, centerY.current, 0, calculate);

            if(calculate === maxY) {
                handleSetAudioCatchIsPlay(true);
                cancelAnimationFrame(raf.current);
                craneDirection.current = 'down';
                startAnimation(animateCraneCatch);
            } else {
                startAnimation(animateDownbutton);
            }
        }

        const animateCraneCatch = time => {
            if(typeof rafStartTime.current === 'undefined') rafStartTime.current = time;
            const progress = time - rafStartTime.current;

            if(craneDirection.current === 'down') {
                craneMoveY.current = Math.min(craneMoveY.current + progress * 0.001, craneMaxMoveY);
            } else if(craneDirection.current === 'up') {
                craneMoveY.current = Math.max(craneMoveY.current - progress * 0.001, craneMinMoveY);
            } else if(craneDirection.current === 'left') {
                craneMoveX.current = Math.max(craneMoveX.current - progress * 0.001, craneMinMoveX);
            }

            if(craneDirection.current === 'stop') {
                cancelAnimation();
                setTimeout(() => { // 법칙성에 대해서 공부, 병렬처리할 경우 문제가 없는 부분에 대해 연구(스택으로 우선순위 밀림)
                    handleSetAudioCatchIsPlay(false);
                    handleCrane(craneDirection.current, craneMoveX.current, craneMoveY.current, progress);
                }, 0);
                downbuttonDirection.current = undefined;
                downbuttonAnimationSpeed.current = 1;
                drawClawCraneGameControlBox(centerX.current, centerY.current, 0, 0);
                drawClawCraneGameGlass(centerX.current, centerY.current);
                handleCrane(craneDirection.current, craneMoveX.current, craneMoveY.current, progress);
            } else {
                drawClawCraneGameGlass(centerX.current, centerY.current);
                handleCrane(craneDirection.current, craneMoveX.current, craneMoveY.current, progress);
                startAnimation(animateCraneCatch);
            }

            // 크레인 이동 방향 설정
            if(craneMoveY.current === craneMaxMoveY) {
                craneDirection.current = 'up';
            } else if(craneMoveY.current === craneMinMoveY) {
                if(craneMoveX.current === craneMinMoveX) {
                    craneDirection.current = 'stop';
                } else {
                    craneDirection.current = 'left';
                }
            }
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

        const handleKeydown = (event) => {
            const playAnimationJoystick = (direction) => {
                if(craneMoveY.current === 0 && (craneDirection.current === 'start' || craneDirection.current === 'stop') && !dollIsCaught) { // 초기상태 체크
                    cancelAnimationFrame(raf.current);
                    joystickDirection.current = direction;
                    startAnimation(animateJoystick);
                }
            }
            const playAnimationDownbutton = (direction) => {
                if(craneMoveY.current === 0 && (craneDirection.current === 'start' || craneDirection.current === 'stop') && !dollIsCaught) { // 초기상태 체크
                    cancelAnimationFrame(raf.current);
                    downbuttonDirection.current = direction;
                    startAnimation(animateDownbutton);
                }
            }
            if(event.keyCode === 39) { // Right
                playAnimationJoystick('right');
            } else if(event.keyCode === 37) { // Left
                playAnimationJoystick('left');
            }
            if(event.keyCode === 40) { // Down
                playAnimationDownbutton('down');
            }
        }

        const handleKeyUp = (event) => {
            const stopAnimationJoystick = () => {
                if(craneMoveY.current === 0 && (craneDirection.current === 'start' || craneDirection.current === 'stop') && !dollIsCaught) { // 초기상태 체크
                    joystickDirection.current = undefined;
                    joystickAnimationSpeed.current = 1;
                    joystickDegree.current = 0;
                    craneArmDegree.current = 0;
                    cancelAnimation();
                    drawClawCraneGameControlBox(centerX.current, centerY.current, 0, 0);
                    drawClawCraneGameGlass(centerX.current, centerY.current);
                }
            }
            if(event.keyCode === 39) { // Right
                stopAnimationJoystick();
            } else if(event.keyCode === 37) { // Left
                stopAnimationJoystick();
            }
        }

        const loadImage = (callback) => {
            const loadLogoWPImage = (callback) => { // 왓풀 로고
                if(typeof logoWPImage.current === 'undefined')  {
                    logoWPImage.current = new Image();
                    logoWPImage.current.onload = function() {
                        if(typeof callback === 'function') callback();
                    }
                    logoWPImage.current.src = icon_wp;
                } else {
                    if(typeof callback === 'function') callback();
                }
            }
            const loadLogoPYImage = (callback) => { // 박얀 로고
                if(typeof logoPYImage.current === 'undefined') {
                    logoPYImage.current = new Image();
                    logoPYImage.current.onload = function() {
                        if(typeof callback === 'function') callback();
                    }
                    logoPYImage.current.src = icon_py;
                } else {
                    if(typeof callback === 'function') callback();
                }
            }
            loadLogoWPImage(() => { loadLogoPYImage(callback); });
        }

        const initialize = () => {
            if(canvas) {
                if(typeof context === "undefined") {
                    setContext(canvas.current.getContext("2d"));
                }
                if(context) {
                    loadImage(() => {
                        clearContext();
                        initCanvas();
                        window.addEventListener('resize', initCanvas);
                        window.addEventListener('keydown', handleKeydown);
                        window.addEventListener('keyup', handleKeyUp);
                        window.addEventListener('contextmenu', e => e.preventDefault());
                        window.addEventListener('dragstart', e => e.preventDefault());
                        window.addEventListener('selectstart', e => e.preventDefault());
                    })
                }
            }
        }

        initialize();
        return() => {
            window.removeEventListener('resize', initCanvas);
            window.removeEventListener('keydown', handleKeydown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener("contextmenu", e => e.preventDefault());
            window.removeEventListener("dragstart", e => e.preventDefault());
            window.removeEventListener("selectstart", e => e.preventDefault());
            if(canvas && context) {
                cancelAnimation();
                clearContext();
            }
        }
    }, [context, 
        handleSetAudioCatchIsPlay, 
        handleCrane, 
        dollIsCaught,
        craneMinMoveX,
        craneMaxMoveX,
        craneMinMoveY,
        craneMaxMoveY,
        ratio])
    
    return (
        <canvas
            ref={canvas}
            className={style.clawcranegame__canvasFull}>
        </canvas>
    )
}