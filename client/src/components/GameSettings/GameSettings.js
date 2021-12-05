import React, { useState, useEffect} from 'react';
import Modal from '../Modal/Modal';
import './GameSettings.scss';
import useDebounce from '../../utils/debounceHook';

function GameSettings(props) {

    const [showCloseGameModal, setShowCloseGameModal] = useState(false);
    const [roomName, setRoomName] = useState(props.roomName);
    const [changeEvent, setChangeEvent] = useState();
    const debouncedChangeEvent = useDebounce(changeEvent, 500);

    const modalActionInterceptor = (event) => {
        if(event === 'confirm'){
            props.endAction.action();
        }
        setShowCloseGameModal(false);
    }

    const handleChange = (event) => {
        setRoomName(event.target.value);
        setChangeEvent(event);
    }

    useEffect(() => {
        if(debouncedChangeEvent){
            props.handleChange(debouncedChangeEvent);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedChangeEvent])

    return(
        <div className="game-settings-pane">
            <button className="btn text-light close-btn" onClick={props.closeSettings}>
                <i className="bi bi-x-circle-fill"></i>
            </button>
            <div className="container">
                <div className="settings-title">SETTINGS</div>
                <hr></hr>
                <div className="settings-input-wrapper">
                    <div className="descriptor"><small>
                        Room Name
                        </small></div>
                    <input type="text" name="roomName" onChange={handleChange} value={roomName}></input>
                    <hr></hr>
                </div>
                {
                    props.gameSettings && (false === true) ? (
                        <div>
                        <div className="settings-input-wrapper">
                            <div className="descriptor">
                                <small>Game Type</small>
                            </div>
                            <select name="gameType" onChange={props.handleChange} value={props.gameSettings.currentGameType}>
                                <option value="bingo">Bingo</option>
                                <option value="x">X</option>
                                <option value="window">Window</option>
                                <option value="blackout">Black Out</option>
                            </select>
                            <hr></hr>
                        </div>
                        </div>
                    ) : (<></>)
                }
                <div className="button-container d-grid gap-2">
                    <button type="button" className="btn btn-outline-warning" onClick={() => {setShowCloseGameModal(true)}} >
                        {props.endAction.buttonLabel}
                    </button>
                </div>
                
            </div>
            {
                showCloseGameModal ? (
                    <Modal title={props.endAction.confirmationModal.title} 
                    message={props.endAction.confirmationModal.message} 
                    confirmActionLabel={props.endAction.confirmationModal.confirmActionLabel} 
                    cancelActionLabel={props.endAction.confirmationModal.cancelActionLabel}  
                    actionHandler={modalActionInterceptor}
                    />
                ) : (
                    <></>
                )
            }
            
        </div>
    )

}

export default GameSettings;