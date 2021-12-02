import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import API from '../utils/API';
import { useStoreContext } from '../utils/GlobalState';
import MiniCardsViewer from '../components/MiniCardsViewer/MiniCardsViewer';
import GameSettings from '../components/GameSettings/GameSettings';
import './GameRoomPage.scss';

function GameRoomPage(props){
    
    const [state, dispatch] = useStoreContext();
    const [stagedCards, setStagedCards] = useState([]);
    const [players, setPlayers] = useState([])
    const [gameRoom, setGameRoom] = useState();
    const [showSettings, setShowSettings] = useState(false);
    const { id } = useParams()
    const cardTitle = ['S', 'a', 'n', 't', 'A'];
    
    const playersList = players.map(player => {
        return (
            <div className="list-group-item" key={player._id}>
                <div className="d-flex justify-content-between">
                    <div >
                        <span className="user-display-monogram m-2">{player.displayName}</span>
                        <span className="m-2"> {player.firstName} {player.lastName} </span>
                    </div>
                    <div >
                        {
                            player._id === state.user._id ? (
                                <button onClick={() => leaveRoom(player._id)} title="Remove Player from Game Room" className="btn text-light user-control-btn">
                                    <i className="bi bi-person-x-fill"></i>
                                </button>
                            )  : (
                                <span></span>
                            )                    
                        }
                    </div>
                </div>
                <hr></hr>
            </div>
        )
    })

    const leaveRoom = (playerId) => {
        API.leaveGameRoom(gameRoom._id, playerId).then(response => {
            if(response.status === 200){
                loadRoom();
            }
        })
        .catch()
    }

    const loadRoom = () => {
        return API.getGameRoom(id).then(response => {
            //console.log(response.data);
            setGameRoom(response.data);
            setPlayers(response.data.players);
        })
        .catch(error => console.log(error));
    }

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    }

    const settingChangeHandler = (event) => {
        console.log(event.target.name);
        console.log(event.target.value);
        if(event.target.name === 'roomName'){
            API.updateGameRoom(gameRoom._id, {
                roomName: event.target.value
            })
            .then(response => {
                if(response.status === 200){
                    loadRoom();
                }
            })
            .catch(error => console.log(error));

        }
    }

    const endAction = {
        action: function(){
            console.log('will close room');
            API.updateGameRoom(gameRoom._id, {
                active: false
            })  
        },
        buttonLabel: "Close Room",
        confirmationModal: {
            title: "Close Game Room",
            message: "Are you sure you wish to close this game room? All participants will be removed from the room.",
            confirmActionLabel: "Close Room",
            cancelActionLabel: "Cancel"
        }

    }

    useEffect(() => {
        if(!gameRoom){
            loadRoom();
        }
        if(gameRoom && gameRoom._id && state.user){
            //console.log(gameRoom._id);
            //console.log(state.user._id);
            API.getStagedCards(gameRoom._id, state.user._id).then(response => {
                if(response.data){
                    //console.log(response.data.cards)
                    setStagedCards(response.data.cards);
                }
            })
            .catch(error => console.log(error));
        }

    }, [state.inGame, gameRoom, state.user])

    return (
        <div className="container">
            {gameRoom && stagedCards ? (
                <div className="">
                    { gameRoom.creator._id === state.user._id ? (
                        <div>
                            { showSettings ? (
                                <GameSettings roomName={gameRoom.roomName} 
                                gameSettings={gameRoom.settings} 
                                closeSettings={toggleSettings}
                                endAction={endAction} 
                                handleChange={settingChangeHandler}/>
                            ) :(<span></span>)}
                        <div className="d-flex justify-content-between">
                            <span className="m-2">{gameRoom.roomName}</span>
                            <div>
                                <button className="btn text-light" onClick={toggleSettings}>
                                    <i className="bi bi-gear-fill"></i>
                                </button>
                            </div>
                        </div>
                        <div className="d-grid gap-2">
                            <button className="btn btn-outline-light">start game</button>
                        </div>
                    </div>
                    ) : (
                        <div className="d-flex justify-content-center">
                            <span className="m-2">{gameRoom.roomName}</span>
                        </div>
                    )
                    
                }
                    <hr></hr>
                        <MiniCardsViewer cardTitle={cardTitle} cards={stagedCards} thumbnail="true"/>
                    <hr></hr>
                    <div className="d-flex justify-content-center player-list-group-title">PLAYERS</div>
                    <div className="list-group list-group-flush player-list-group">
                        {playersList}
                    </div>
                </div>
           ) : (
                <div>Joining...</div>
            )}
        </div>
    )

}

export default GameRoomPage;