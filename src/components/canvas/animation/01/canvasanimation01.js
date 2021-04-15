import React, { useState, useEffect, useRef } from 'react';
import * as style from './canvasanimation01.module.css';

export default function CanvasAnimation01() {
    const [context, setContext] = useState();
    const canvas = useRef();

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

        const initialize = () => {
            if(canvas) {
                if(typeof context === "undefined") {
                    setContext(canvas.current.getContext("2d"));
                }
                if(context) {

                }
            }
        }

        initialize();
        return() => {
            if(canvas && context) {
                clearContext();
            }
        }
    }, [])

    return (
        <canvas
            ref={canvas}
            className={style.canvasanimation01__canvasFull}>
        </canvas>
    )
}