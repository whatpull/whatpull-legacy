import React, { useEffect, useRef, useState } from 'react'
import * as style from './clawcranegame.module.css'
import CanvasCrawCrane from '../canvas/canvasclawcrane'
import CanvasDollLittlePrincess from '../canvas/canvasdolllittleprincess'

export default function ClawCraneGame() {
    const [audioIsStop, setAudioIsStop] = useState(false);
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
            } else if(event.keyCode === 37) { // Left
                buttonLeft.current.classList.add(style.clawcranegame__keyItemActive);
            }
            if(event.keyCode === 40) { // Down
                buttonDown.current.classList.add(style.clawcranegame__keyItemActive);
            }
        }

        const handleKeyUp = (event) => {
            if(event.keyCode === 39) { // Right
                if(buttonRight.current.classList.contains(style.clawcranegame__keyItemActive)) {
                    buttonRight.current.classList.remove(style.clawcranegame__keyItemActive);
                }
                audioStop(audioCatch.current);
                audioPlay(audioMain.current);
            } else if(event.keyCode === 37) { // Left
                if(buttonLeft.current.classList.contains(style.clawcranegame__keyItemActive)) {
                    buttonLeft.current.classList.remove(style.clawcranegame__keyItemActive);
                }
                audioStop(audioCatch.current);
                audioPlay(audioMain.current);
            }
            if(event.keyCode === 40) { // Down
                if(buttonDown.current.classList.contains(style.clawcranegame__keyItemActive)) {
                    buttonDown.current.classList.remove(style.clawcranegame__keyItemActive);
                }
                audioStop(audioMain.current);
                audioPlay(audioCatch.current);
                setTimeout(function() {
                    audioStop(audioCatch.current);
                }, 3500)
            }
        }

        const audioStop = (element) => {
            if(audioContext.current) {
                audioContext.current.resume().then(() => {
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
            }

            if(audioContext.current) {
                audioContext.current.resume().then(() => {
                    console.log('Playback resumed successfully');
                    const promise = element.play();
                    if (typeof promise === 'object') {
                        promise.then(_ => {
                        // Autoplay started!
                        }).catch(error => {
                            console.log(error);
                        });
                    }
                });
            }
        }
        
        if(audioIsStop) {
            audioStop(audioMain.current);
            audioStop(audioCatch.current);
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
    }, [audioIsStop])

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

    const handleSetAudioIsStop = (isStop) => {
        setAudioIsStop(isStop);
    }

    return (
        <div
            className={style.clawcranegame__canvasWrap}>
            <CanvasDollLittlePrincess />
            <CanvasCrawCrane handleSetAudioIsStop={handleSetAudioIsStop} />
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
            </audio>
            <audio
                ref={audioCatch}
                loop>
                <source src="/crawcranegame_catch.ogg" type="audio/ogg" />
                <source src="/crawcranegame_catch.mp3" type="audio/mpeg" />
            </audio>
        </div>
    )
}