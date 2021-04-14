import React, { useEffect, useRef, useState, useCallback } from 'react';
import { navigate } from 'gatsby';
import * as style from './clawcranegame.module.css';
import CanvasCrawCrane from '../canvas/canvasclawcrane';
import CanvasDollLittlePrincess from '../canvas/canvasdolllittleprincess';

export default function ClawCraneGame() {
    const [craneIsCatch, setCraneIsCatch] = useState(false);
    const [craneDirection, setCraneDirection] = useState('down');
    const [craneMoveX, setCraneMoveX] = useState(0);
    const [craneMoveY, setCraneMoveY] = useState(0);
    const [progress, setProgress] = useState(0);
    const [dollIsCaught, setDollIsCaught] = useState(false);
    const audioMain = useRef();
    const audioCatch = useRef();
    const audioContext = useRef();
    const buttonLeft = useRef();
    const buttonDown = useRef();
    const buttonRight = useRef();
    const handleSetAudioCatchIsPlay = useCallback((isPlay) => {
        if(isPlay) { 
            setCraneIsCatch(true);
            audioPlay(audioCatch.current);
        }
    }, []);
    const handleSetAudioCatchIsStop = useCallback((isStop) => {
        if(isStop) { 
            setCraneIsCatch(false);
            audioStop(audioCatch.current);
        }
    }, []);
    const handleCrane = useCallback((craneDirection, craneMoveX, craneMoveY, progress) => {
        setCraneDirection(craneDirection);
        setCraneMoveX(craneMoveX);
        setCraneMoveY(craneMoveY);
        setProgress(progress);
    }, []);
    const animationCrane = useCallback(() => { 
        return {craneDirection: craneDirection, craneMoveX: craneMoveX, craneMoveY: craneMoveY, progress: progress}
    }, [craneDirection, craneMoveX, craneMoveY, progress]);
    const handleSetDollIsCaught = useCallback((isCaught) => {
        setDollIsCaught(isCaught);
    }, []);

    const audioStop = (element) => {
        if(audioContext.current && audioContext.current.state === 'running') {
            audioContext.current.suspend().then(() => {
                element.pause();
                element.currentTime = 0;
            });
        }
    }

    const audioPlay = (element) => {
        if(typeof audioContext.current === 'undefined') {
            audioContext.current = new AudioContext()
            const destination = audioContext.current.destination;
            const source = audioContext.current.createMediaElementSource(element);
            const gain = audioContext.current.createGain();
            source.connect(gain).connect(destination);
            audioContext.current.suspend();
        }

        if(audioContext.current && audioContext.current.state === 'suspended') {
            audioContext.current.resume().then(() => {
                const promise = element.play();
                if (typeof promise === 'object') {
                    promise.then(_ => {
                    }).catch(error => {
                        console.log(error);
                    });
                }
            });
        }
    }

    useEffect(() => {
        const handleKeydown = (event) => {
            if(event.keyCode === 39) { // Right
                buttonRight.current.classList.add(style.clawcranegame__keyItemActive);
                if(!dollIsCaught) audioPlay(audioMain.current);
            } else if(event.keyCode === 37) { // Left
                buttonLeft.current.classList.add(style.clawcranegame__keyItemActive);
                if(!dollIsCaught) audioPlay(audioMain.current);
            }
            if(event.keyCode === 40) { // Down
                buttonDown.current.classList.add(style.clawcranegame__keyItemActive);
                audioStop(audioMain.current);
            }
        }

        const handleKeyUp = (event) => {
            if(event.keyCode === 39) { // Right
                if(buttonRight.current.classList.contains(style.clawcranegame__keyItemActive)) {
                    buttonRight.current.classList.remove(style.clawcranegame__keyItemActive);
                }
            } else if(event.keyCode === 37) { // Left
                if(buttonLeft.current.classList.contains(style.clawcranegame__keyItemActive)) {
                    buttonLeft.current.classList.remove(style.clawcranegame__keyItemActive);
                }
            }
            if(event.keyCode === 40) { // Down
                if(buttonDown.current.classList.contains(style.clawcranegame__keyItemActive)) {
                    buttonDown.current.classList.remove(style.clawcranegame__keyItemActive);
                }
            }
        }

        // 잡을 경우 1초뒤 이동
        if(dollIsCaught) { setTimeout(() => { navigate('/animation/01'); }, 3000); }
        
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener("contextmenu", e => e.preventDefault());
        window.addEventListener("dragstart", e => e.preventDefault());
        window.addEventListener("selectstart", e => e.preventDefault());

        return() => {
            window.removeEventListener('keydown', handleKeydown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener("contextmenu", e => e.preventDefault());
            window.removeEventListener("dragstart", e => e.preventDefault());
            window.removeEventListener("selectstart", e => e.preventDefault());
        }
    }, [dollIsCaught])

    const handleTouchStartLeft = (event) => {
        window.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowLeft', keyCode: 37}));
    }

    const handleTouchEndLeft = (event) => {
        window.dispatchEvent(new KeyboardEvent('keyup', {key: 'ArrowLeft', keyCode: 37}));
    }

    const handleTouchStartRight = (event) => {
        window.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', keyCode: 39}));
    }

    const handleTouchEndRight = (event) => {
        window.dispatchEvent(new KeyboardEvent('keyup', {key: 'ArrowRight', keyCode: 39}));
    }

    const handleTouchStartDown = (event) => {
        window.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowDown', keyCode: 40}));
    }

    const handleTouchEndDown = (event) => {
        window.dispatchEvent(new KeyboardEvent('keyup', {key: 'ArrowDown', keyCode: 40}));
    }

    return (
        <div
            className={style.clawcranegame__canvasWrap}>
            <CanvasCrawCrane 
                handleSetAudioCatchIsPlay={handleSetAudioCatchIsPlay}
                handleSetAudioCatchIsStop={handleSetAudioCatchIsStop}
                handleCrane={handleCrane}
                dollIsCaught={dollIsCaught} />
            <CanvasDollLittlePrincess 
                craneIsCatch={craneIsCatch}
                animationCrane={animationCrane}
                handleSetDollIsCaught={handleSetDollIsCaught} />
            <div
                className={style.clawcranegame__keyWrap}>
                <button
                    ref={buttonLeft} 
                    className={style.clawcranegame__keyItem}
                    onMouseDown={handleTouchStartLeft}
                    onMouseUp={handleTouchEndLeft}
                    onTouchStart={handleTouchStartLeft}
                    onTouchEnd={handleTouchEndLeft}>
                    <span 
                        style={{fontSize: '60px'}} 
                        className="material-icons">
                        arrow_left
                    </span>
                </button>
                <button 
                    ref={buttonDown}
                    className={style.clawcranegame__keyItem}
                    onMouseDown={handleTouchStartDown}
                    onMouseUp={handleTouchEndDown}
                    onTouchStart={handleTouchStartDown}
                    onTouchEnd={handleTouchEndDown}>
                    <span
                        style={{fontSize: '60px'}} 
                        className="material-icons">
                        arrow_drop_down
                    </span>
                </button>
                <button 
                    ref={buttonRight}
                    className={style.clawcranegame__keyItem}
                    onMouseDown={handleTouchStartRight}
                    onMouseUp={handleTouchEndRight}
                    onTouchStart={handleTouchStartRight}
                    onTouchEnd={handleTouchEndRight}>
                    <span 
                        style={{fontSize: '60px'}}
                        className="material-icons">
                        arrow_right
                    </span>
                </button>
            </div>
            <audio
                ref={audioMain}
                loop>
                <source src="/crawcranegame_main.ogg" type="audio/ogg" />
                <source src="/crawcranegame_main.mp3" type="audio/mpeg" />
                <track src="/common.vtt" kind="captions" srcLang="ko" label="Korea" />
            </audio>
            <audio
                ref={audioCatch}
                loop>
                <source src="/crawcranegame_catch.ogg" type="audio/ogg" />
                <source src="/crawcranegame_catch.mp3" type="audio/mpeg" />
                <track src="/common.vtt" kind="captions" srcLang="ko" label="Korea" />
            </audio>
        </div>
    )
}