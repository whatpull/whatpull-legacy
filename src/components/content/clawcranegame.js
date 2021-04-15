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
    const audioMainContext = useRef();
    const audioCatch = useRef();
    const audioCatchContext = useRef();
    const audioSuccess = useRef();
    const audioSuccessContext = useRef();
    const buttonLeft = useRef();
    const buttonDown = useRef();
    const buttonRight = useRef();

    // [오디오 : 메인]
    const audioMainPlay = useCallback(() => {
        if(typeof audioMainContext.current === 'undefined') {
            audioMainContext.current = new AudioContext();
            const destination = audioMainContext.current.destination;
            const source = audioMainContext.current.createMediaElementSource(audioMain.current);
            const gain = audioMainContext.current.createGain();
            source.connect(gain).connect(destination);
            source.loop = true;
            audioMainContext.current.suspend();
        }

        if(audioMainContext.current && audioMainContext.current.state === 'suspended') {
            audioMainContext.current.resume().then(() => {
                const promise = audioMain.current.play();
                if (typeof promise === 'object') {
                    promise.then(_ => {
                        console.info('music play main theme');
                    }).catch(error => {
                        console.log(error);
                    });
                }
            });
        }
    }, []);
    const audioMainStop = useCallback(() => {
        if(audioMainContext.current && audioMainContext.current.state === 'running') {
            audioMainContext.current.suspend().then(() => {
                if(audioMain.current) {
                    audioMain.current.pause();
                    audioMain.current.currentTime = 0;
                }
            });
        }
    }, []);

    // [오디오 : 잡기]
    const audioCatchPlay = useCallback(() => {
        if(typeof audioCatchContext.current === 'undefined') {
            audioCatchContext.current = new AudioContext();
            const destination = audioCatchContext.current.destination;
            const source = audioCatchContext.current.createMediaElementSource(audioCatch.current);
            const gain = audioCatchContext.current.createGain();
            source.connect(gain).connect(destination);
            source.loop = true;
            audioCatchContext.current.suspend();
        }
        if(audioCatchContext.current && audioCatchContext.current.state === 'suspended') {
            audioCatchContext.current.resume().then(() => {
                const promise = audioCatch.current.play();
                if (typeof promise === 'object') {
                    promise.then(_ => {
                        console.info('music play main theme');
                    }).catch(error => {
                        console.log(error);
                    });
                }
            });
        }
    }, []);
    const audioCatchStop = useCallback(() => {
        if(audioCatchContext.current && audioCatchContext.current.state === 'running') {
            audioCatchContext.current.suspend().then(() => {
                if(audioCatch.current) {
                    audioCatch.current.pause();
                    audioCatch.current.currentTime = 0;
                }
            });
        }
    }, []);

    // [오디오 : 성공]
    const audioSuccessPlay = useCallback(() => {
        if(typeof audioSuccessContext.current === 'undefined') {
            audioSuccessContext.current = new AudioContext();
            const destination = audioSuccessContext.current.destination;
            const source = audioSuccessContext.current.createMediaElementSource(audioSuccess.current);
            const gain = audioSuccessContext.current.createGain();
            source.connect(gain).connect(destination);
            audioSuccessContext.current.suspend();
        }
        if(audioSuccessContext.current && audioSuccessContext.current.state === 'suspended') {
            audioSuccessContext.current.resume().then(() => {
                const promise = audioSuccess.current.play();
                if (typeof promise === 'object') {
                    promise.then(_ => {
                        console.info('music play main theme');
                    }).catch(error => {
                        console.log(error);
                    });
                }
            });
        }
    }, []);
    const audioSuccessStop = useCallback(() => {
        if(audioSuccessContext.current && audioSuccessContext.current.state === 'running') {
            audioSuccessContext.current.suspend().then(() => {
                if(audioSuccess.current) {
                    audioSuccess.current.pause();
                    audioSuccess.current.currentTime = 0;
                }
            });
        }
    }, []);


    // [useCallback : 함수 재사용(리렌더링에 영향없이 함수를 일회만 생성)]
    const handleCrane = useCallback((craneDirection, craneMoveX, craneMoveY, progress) => {
        setCraneDirection(craneDirection);
        setCraneMoveX(craneMoveX);
        setCraneMoveY(craneMoveY);
        setProgress(progress);
    }, []);
    const handleSetDollIsCaught = useCallback((isCaught) => {
        setDollIsCaught(isCaught);
    }, []);
    const handleSetAudioCatchIsPlay = useCallback((isPlay) => {
        if(isPlay) { 
            audioCatchPlay();
            setCraneIsCatch(true);
        } else {
            audioCatchStop();
            setCraneIsCatch(false);
        }
    }, [audioCatchPlay, audioCatchStop]);
    const animationCrane = useCallback(() => { 
        return {craneDirection: craneDirection, craneMoveX: craneMoveX, craneMoveY: craneMoveY, progress: progress}
    }, [craneDirection, craneMoveX, craneMoveY, progress]);

    useEffect(() => {
        const handleKeydown = (event) => {
            if(event.keyCode === 39) { // Right
                buttonRight.current.classList.add(style.clawcranegame__keyItemActive);
                // TODO. 해당 부분에 대한 문제점 검토
                if(dollIsCaught === false) audioMainPlay();
            } else if(event.keyCode === 37) { // Left
                buttonLeft.current.classList.add(style.clawcranegame__keyItemActive);
                if(dollIsCaught === false) audioMainPlay();
            }
            if(event.keyCode === 40) { // Down
                buttonDown.current.classList.add(style.clawcranegame__keyItemActive);
                audioMainStop();
            }
        }

        const handleKeyUp = (event) => {
            if(event.keyCode === 39) { // Right₩
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

        // [오디오 : 전체]
        const audioAllStop = () => {
            audioMainStop();
            audioCatchStop();
            audioSuccessStop();
        }

        // [초기화 : 인형을 뽑았을 경우(Success)]
        const initDollIsCaught = () => {
            if(dollIsCaught) { // 인형이 잡혔을 경우
                audioCatchStop();
                audioSuccessPlay();
                setTimeout(() => { 
                    audioAllStop();
                    navigate('/animation/01'); 
                }, 3000); 
            }
        }

        initDollIsCaught();
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener("contextmenu", e => e.preventDefault());
        window.addEventListener("dragstart", e => e.preventDefault());
        window.addEventListener("selectstart", e => e.preventDefault());

        return() => {
            audioAllStop();
            window.removeEventListener('keydown', handleKeydown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener("contextmenu", e => e.preventDefault());
            window.removeEventListener("dragstart", e => e.preventDefault());
            window.removeEventListener("selectstart", e => e.preventDefault());
        }
    }, [dollIsCaught, audioMainPlay, audioMainStop, audioCatchPlay, audioCatchStop, audioSuccessPlay, audioSuccessStop])

    // [이벤트 : 핸들러]
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
            <audio
                ref={audioSuccess}>
                <source src="/crawcranegame_success.ogg" type="audio/ogg" />
                <source src="/crawcranegame_success.mp3" type="audio/mpeg" />
                <track src="/common.vtt" kind="captions" srcLang="ko" label="Korea" />
            </audio>
        </div>
    )
}