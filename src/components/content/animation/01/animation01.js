import React from 'react';
import * as style from './animation01.module.css';
import CanvasAnimation01 from '../../../canvas/animation/01/canvasanimation01';

export default function Animation01() {
    return (
        <div
            className={style.animation01__canvasWrap}>
            <CanvasAnimation01 />
        </div>
    )
}