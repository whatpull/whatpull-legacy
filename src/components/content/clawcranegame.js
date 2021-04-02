import React, { useState, useEffect, useRef } from 'react'
import * as style from './clawcranegame.module.css'

export default function ClawCraneGame() {
    const [context, setContext] = useState();
    const wrap = useRef();
    const canvas = useRef();
    const ratio = 1;

    useEffect(() => {
        const clearContext = () => {
            if(canvas.current) context.clearRect(0, 0, canvas.current.width, canvas.current.height);
        }

        const drawContext = () => {
            context.strokeStyle = '#FFFFFF';
            context.fillStyle = '#FFFFFF';
            const centerX = context.canvas.width / 2;
            const centerY = context.canvas.height / 2;
            drawClawCraneGame(centerX, centerY);
        }

        const drawClawCraneGame = (centerX, centerY) => {
            context.save();
            context.beginPath();
            context.restore();
        }

        const initCanvas = () => {
            context.canvas.width = canvas.current.clientWidth * ratio;
            context.canvas.height = canvas.current.clientHeight * ratio;
            clearContext();
            drawContext();
            context.imageSmoothingEnabled = true;
            context.translate(0.5, 0.5);
        }
        
        // 초기 호출 함수
        if(canvas) {
            if(typeof context === "undefined") {
                setContext(canvas.current.getContext("2d"));
            }
            if(context) {
                clearContext();
                initCanvas(20);
                window.addEventListener('resize', initCanvas);
            }
        }

        return() => {
            window.removeEventListener('resize', initCanvas);
            if(canvas && context) {
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