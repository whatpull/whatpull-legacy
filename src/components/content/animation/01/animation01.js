import React, { useRef } from 'react';
import * as style from './animation01.module.css';
import CanvasAnimation01 from '../../../canvas/animation/01/canvasanimation01';
import CanvasDollLittlePrincess from '../../../canvas/canvasdolllittleprincess';

export default function Animation01({ background }) {
    const ratio = useRef(1.5);

    return (
        <div
            className={style.animation01__canvasWrap}>
            <CanvasAnimation01
                type='back'
                ratio={ratio.current} 
                background={background} />
            <CanvasDollLittlePrincess
                type='scene'
                position={{x: -55, y: 40}}
                craneIsCatch={false}
                animationCrane={() => { return { craneDirection : 'stop', craneMoveX : 0, craneMoveY : 0} }}
                handleSetDollIsCaught={false}
                craneMaxMoveY={0}
                ratio={1.2} />
            <CanvasAnimation01
                type='front'
                ratio={ratio.current} 
                background={background} />
        </div>
    )
}