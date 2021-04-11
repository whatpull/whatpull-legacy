import React, { useEffect, useRef, useState } from 'react'
import * as style from './clawcranegame.module.css'
import CanvasCrawCrane from '../canvas/canvasclawcrane'
import CanvasDollLittlePrincess from '../canvas/canvasdolllittleprincess'

export default function ClawCraneGame() {
    const [audioCatchIsPlay, setAudioCatchIsPlay] = useState(false);
    const [audioCatchIsStop, setAudioCatchIsStop] = useState(false);
    const audioMain = useRef();
    const audioCatch = useRef();
    const audioContext = useRef();
    const buttonLeft = useRef();
    const buttonDown = useRef();
    const buttonRight = useRef();

    useEffect(() => {
        const handleKeydown = (event) => {
            if(event.keyCode === 39) { // Right
                buttonRight.current.classList.add(style.clawcranegame__keyItemActive);
                audioPlay(audioMain.current);
            } else if(event.keyCode === 37) { // Left
                buttonLeft.current.classList.add(style.clawcranegame__keyItemActive);
                audioPlay(audioMain.current);
            }
            if(event.keyCode === 40) { // Down
                buttonDown.current.classList.add(style.clawcranegame__keyItemActive);
                audioStop(audioMain.current);
                // audioPlay(audioCatch.current);
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

        const audioStop = (element) => {
            if(audioContext.current && audioContext.current.state === 'running') {
                audioContext.current.suspend().then(() => {
                    element.pause();
                    element.currentTime = 0;
                    console.log(element);
                    if(element === audioCatch.current) {
                        setAudioCatchIsPlay(false);
                        setAudioCatchIsStop(false);
                    }
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
            }

            if(audioContext.current && audioContext.current.state === 'suspended') {
                audioContext.current.resume().then(() => {
                    console.log('Playback resumed successfully');
                    const promise = element.play();
                    if (typeof promise === 'object') {
                        promise.then(_ => {
                            if(element === audioCatch.current) {
                                setAudioCatchIsPlay(false);
                                setAudioCatchIsStop(false);
                            }
                        }).catch(error => {
                            console.log(error);
                        });
                    }
                });
            }
        }
        
        if(audioCatchIsStop) {
            audioStop(audioCatch.current);
        }
        if(audioCatchIsPlay) {
            audioPlay(audioCatch.current);
        } 
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
    }, [audioCatchIsPlay, audioCatchIsStop])

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

    const handleSetAudioCatchIsPlay = (isPlay) => {
        setAudioCatchIsPlay(isPlay);
    }

    const handleSetAudioCatchIsStop = (isStop) => {
        setAudioCatchIsStop(isStop);
    }

    return (
        <div
            className={style.clawcranegame__canvasWrap}>
            <CanvasDollLittlePrincess />
            <CanvasCrawCrane 
                handleSetAudioCatchIsPlay={handleSetAudioCatchIsPlay}
                handleSetAudioCatchIsStop={handleSetAudioCatchIsStop} />
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