import React, { useEffect, useState, useContext } from 'react';
import { useParams, Redirect } from 'react-router';
import API from '../utils/API';
import { SET_IN_GAME } from '../utils/actions';
import { useStoreContext } from '../utils/GlobalState';
import { SocketContext } from "../utils/socket";
import MiniCardsViewer from '../components/MiniCardsViewer/MiniCardsViewer';
import GameSettings from '../components/GameSettings/GameSettings';
import PlayerList from '../components/PlayerList/PlayerList';
import NoMatch from "./NoMatch";
import './GameRoomPage.scss';

function GameRoomPage(props){
    
    const [state, dispatch] = useStoreContext();
    const [stagedCards, setStagedCards] = useState([]);
    const [players, setPlayers] = useState([])
    const [gameRoom, setGameRoom] = useState();
    const [roomError, setRoomError] = useState(false);
    const [joinedGameRoom, setJoinedGameRoom] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [leavingRoom, setLeavingRoom] = useState(false);
    const [activeGameId, setActiveGameId] = useState();
    const { id } = useParams();
    const cardTitle = ['S', 'a', 'n', 't', 'A'];
    const socket = useContext(SocketContext);

    const leaveRoom = (playerId) => {
        API.leaveGameRoom(gameRoom._id, playerId).then(response => {
            if(response.status === 200){
                socket.emit('roomsUpdate', gameRoom._id);
                if(playerId === state.user._id){
                    setLeavingRoom(true);
                } else {
                    console.log(`Ejecting player ${playerId}`);
                    socket.emit('ejectPlayer', {gameRoom: gameRoom._id, playerId});
                    loadRoom();
                }
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    const playersList = players.map(player => {
        return (
            <PlayerList key={player._id} player={player} creator={gameRoom.creator} leavingRoom={leavingRoom} leaveRoom={leaveRoom}></PlayerList>
        )
    })

    const loadRoom = () => {
        return API.getGameRoom(id).then(response => {
            console.log(response.data);
            
            if(response.data && response.data.inGame && response.data.games.length > 0){
                const games = response.data.games;
                console.log(`Redirecting to /game/${games[games.length - 1]}`)
                setActiveGameId(games[games.length - 1]);
                //setGameRoom(response.data);
                //setPlayers(response.data.players);
            } else {
                setGameRoom(response.data);
                setPlayers(response.data.players);
                if(!response.data.inGame){
                    dispatch({
                        type: SET_IN_GAME,
                        inGame: false
                    });
                }
            }
        })
        .catch(error => {
            setRoomError(true);
            console.log(error)
        });
    }

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    }

    const settingChangeHandler = (event) => {
        //console.log(event.target.name);
        //console.log(event.target.value);
        if(event.target.name === 'roomName' && event.target.name !== gameRoom.roomName){
            
            API.updateGameRoom(gameRoom._id, {
                roomName: event.target.value
            })
            .then(response => {
                if(response.status === 200){
                    loadRoom();
                    socket.emit('roomsUpdate', 'main');
                }
            })
            .catch(error => console.log(error));
        }
    }

    const startGame = () => {
        API.startGame(gameRoom._id).then((response) => {
            console.log(response.data);
            if(response.data && response.data._id){
                socket.emit("start", {gameRoom: gameRoom._id, game: response.data._id});
                setActiveGameId(response.data._id);
            }
        })
        
    }

    const handleGameStart = (data) => {
        console.log(data);
        setActiveGameId(data);
    }

    const handleGameEnd = (data) => {
        console.log(data);
        dispatch({
            type: SET_IN_GAME,
            inGame: false
        });
    }

    const handleJoinedGame = (data) => {
        console.log(data);
        setJoinedGameRoom(true);
    }

    const handleCloseRoom = (data) => {
        console.log(`Closing room ${data}`);
        setLeavingRoom(true);
    }

    const handleEjection = (playerId) => {
        console.log(`ejecting ${playerId}`)
        if(playerId === state.user._id){
            console.log(`You have been ejected from the game room`);
            setLeavingRoom(true);
        }
    }

    const endAction = {
        action: function(){
            console.log('will close room');
            API.updateGameRoom(gameRoom._id, {
                active: false
            }).then(() => {
                console.log('room closed');
                socket.emit('roomsUpdate', 'main');
                socket.emit('closeRoom', {gameRoom: gameRoom._id});
                setLeavingRoom(true);
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
            if(!joinedGameRoom){
                socket.emit('join', gameRoom._id);
            }
            socket.on("ended", handleGameEnd);
            socket.on("started", handleGameStart);
            socket.on("joined", handleJoinedGame);
            socket.on("closeRoom", handleCloseRoom);
            socket.on("roomsUpdate", loadRoom);
            socket.on("ejectPlayer", handleEjection);

            API.getStagedCards(gameRoom._id, state.user._id).then(response => {
                if(response.data){
                    //console.log(response.data.cards)
                    setStagedCards(response.data.cards);
                }
            })
            .catch(error => console.log(error));
        }

        return () => {
            socket.off("ended", handleGameEnd);
            socket.off("started", handleGameStart);
            socket.off("joined", handleJoinedGame);
            socket.off("closeRoom", handleCloseRoom);
            socket.off("roomsUpdate", loadRoom);
            socket.off("ejectPlayer", handleEjection);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.inGame, gameRoom, state.user, socket])
//<MiniCardsViewer cardTitle={cardTitle} cards={stagedCards} thumbnail="true"/>
    return (
        <div className="container">
            {
                activeGameId ? ( <Redirect to={`/game/${activeGameId}`}></Redirect>) : (<></>)
            }
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
                            <button className="btn btn-outline-light" onClick={startGame}>start game</button>
                        </div>
                    </div>
                    ) : (
                        <div className="d-flex justify-content-center">
                            <span className="m-2">{gameRoom.roomName}</span>
                        </div>
                    )
                    
                }
                    <hr />
                        <div className="d-flex justify-content-center">Playing with {stagedCards.length} cards</div>
                    <hr></hr>
                    <div className="d-flex justify-content-center player-list-group-title">PLAYERS</div>
                    <div className="list-group list-group-flush player-list-group">
                        {playersList}
                    </div>
                </div>
           ) : (
                 roomError ? ( <NoMatch error={roomError} /> ) : ( <div>Joining...</div> )
            )}
        </div>
    )

}

export default GameRoomPage;