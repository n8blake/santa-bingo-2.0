import React, { useEffect, useState, useContext, useCallback } from "react";
import { BrowserRouter as Router, Route, Redirect, useParams } from "react-router-dom";
import { useStoreContext } from "../utils/GlobalState";
import API from "../utils/API";
import { SocketContext } from "../utils/socket";
import './GamePage.scss';

import Card from '../components/Card/Card';
import { SET_IN_GAME } from "../utils/actions";


function GamePage(props){

    const [state, dispatch] = useStoreContext();
    const socket = useContext(SocketContext);

    let { uuid } = useParams();
    //const [inGame, setInGame] = useState(false);
    const [gameManager, setGameManager] = useState(false);
    const [joinedGame, setJoinedGame] = useState(false);
    const [gameData, setGameData] = useState(false);
    const [gameName, setGameName] = useState("");
    const [lobby, setLobby] = useState([])
    const cardTitle = ['S', 'a', 'n', 't', 'A'];
    const cells = {
        column_0: [2, 1, 9, 11, 3],
        column_1: [16, 17, 29, 21, 30],
        column_2: [42, 41, 0, 31, 32],
        column_3: [52, 51, 49, 48, 53],
        column_4: [72, 71, 69, 65, 63],
    }

    // socket.on("game", (arg) => {
    //     console.log(arg);
    //     if(arg === 'start'){
    //         dispatch({
    //             type: SET_IN_GAME,
    //             inGame: true
    //         });  
    //     } else if(arg === 'end'){
    //         dispatch({
    //             type: SET_IN_GAME,
    //             inGame: false
    //         });
    //     }
    // })

    const lobbyList = lobby.map(player => {
        return(<li className="list-group-item" key={player.uuid}>
            <div className="d-flex justify-content-between">
                <div>
                    <span>{player.firstName} {player.lastName}</span>
                </div>
            </div>
        </li>)
    })

    const startGame = () => {
        socket.emit("start", uuid);
        dispatch({
            type: SET_IN_GAME,
            inGame: true
        });
    }

    const endGame = () => {
        socket.emit("end", uuid);
        dispatch({
            type: SET_IN_GAME,
            inGame: false
        });
    }

    const nextCard = () => {
        // next card logic
    }

    const handleGameStart = useCallback((data) => {
        console.log(data);
        dispatch({
            type: SET_IN_GAME,
            inGame: true
        });
    })
    const handleGameEnd = useCallback((data) => {
        console.log(data);
        dispatch({
            type: SET_IN_GAME,
            inGame: false
        });
    })
    const handleJoinedGame = useCallback((data) => {
        console.log(data);
        setJoinedGame(true);
    })

    useEffect(() => {

        if(!joinedGame){
            socket.emit('join', uuid);
        }

        socket.on("ended", handleGameEnd);
        socket.on("started", handleGameStart);
        socket.on("joined", handleJoinedGame);
        if(!gameData){
            API.getGame(uuid).then(response => {
                //console.log(response);
                if(response.data){
                    setGameData(response.data);
                    setLobby(response.data.players);
                    setGameName(response.data.name);
                    // set game manager
                    if(response.data.creator === state.user.uuid){
                        setGameManager(true);
                    }
                    // set in game
                    if(response.data.inGame){
                        dispatch({
                            type: SET_IN_GAME,
                            inGame: true
                        });
                    } else {
                        dispatch({
                            type: SET_IN_GAME,
                            inGame: false
                        });
                    }
                }
            })
            .catch(error => console.log(error));
        }
        

        return () => {
            socket.off("ended", handleGameEnd);
            socket.off("started", handleGameStart);
            socket.off("joined", handleJoinedGame);
        }

    }, [uuid, socket, handleGameStart, handleGameEnd, joinedGame, handleJoinedGame, state.user.uuid])

    return(
         state.inGame ? (
            <div className="container">
                <div className="game-bg bg-grad-green"></div>

                <div>Called Cards Component</div>

                { gameManager ? (
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-light m-2" onClick={nextCard}>Next Card</button>
                        <button className="btn btn-light m-2" onClick={endGame}>End Game</button>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        ) : (<div className="container">
            <div className="game-bg bg-grad-red"></div>
            <h2>{gameName}</h2>
            { gameManager ? (
                <div>
                    <button className="btn btn-light" onClick={startGame}>Start Game</button>
                </div>
            ) : (
                <div></div>
            )}
            <hr></hr>
                <div>Card Manager Component</div>
            <hr></hr>
            <div>Players</div>
            <ul className="list-group-flush">{lobbyList}</ul>
        </div>)
        
    )
}

export default GamePage;