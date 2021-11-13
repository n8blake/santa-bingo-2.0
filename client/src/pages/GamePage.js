import React, { useEffect, useState, useContext, useCallback } from "react";
import { BrowserRouter as Router, Route, Redirect, useParams, Link } from "react-router-dom";
import { useStoreContext } from "../utils/GlobalState";
import API from "../utils/API";
import { SocketContext } from "../utils/socket";
import './GamePage.scss';
import { validate } from 'uuidv4';
import Card from '../components/Card/Card';
import CalledCards from "../components/CalledCards/CalledCards";
import { SET_IN_GAME } from "../utils/actions";
import NoMatch from "./NoMatch";

function GamePage(props){

    const [state, dispatch] = useStoreContext();
    const socket = useContext(SocketContext);

    let { uuid } = useParams();
    //const [inGame, setInGame] = useState(false);
    const [gameManager, setGameManager] = useState(false);
    const [joinedGame, setJoinedGame] = useState(false);
    const [gameData, setGameData] = useState(false);
    const [gameName, setGameName] = useState("");
    const [lobby, setLobby] = useState([]);
    const [validUuid, setValidUuid] = useState(false);
    const [badUuid, setBadUuid] = useState(false);

    const lobbyList = lobby.map(player => {
        return(<li className="list-group-item" key={player._id}>
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

        if(uuid){
            //try to get the game data
            if(!gameData){
                API.getGame(uuid).then(response => {
                    //console.log(response);
                    if(response.data){
                        setGameData(response.data);
                        setLobby(response.data.players);
                        setGameName(response.data.name);
                        setValidUuid(true);
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
                .catch(error => {
                    console.log(error);
                    setBadUuid(true);
                });
            }
        }
        if(validUuid){
            if(!joinedGame){
                socket.emit('join', uuid);
            }
            socket.on("ended", handleGameEnd);
            socket.on("started", handleGameStart);
            socket.on("joined", handleJoinedGame);
        }

        return () => {
            socket.off("ended", handleGameEnd);
            socket.off("started", handleGameStart);
            socket.off("joined", handleJoinedGame);
        }

    }, [uuid, socket, handleGameStart, handleGameEnd, joinedGame, handleJoinedGame, state.user.uuid, validUuid, gameData])



    const gamePageComponent = 
         (
            state.inGame ? (
                <div className="container">
                    <CalledCards numbers={[0, 34, 5, 62, 75]} />
    
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
                <h2>{gameName}</h2>
                { gameManager ? (
                    <div>
                        <button className="btn btn-light" onClick={startGame}>Start Game</button>
                    </div>
                ) : (
                    <div></div>
                )}
                <hr></hr>
                    <div>
                        <Link to={'/cards/'} className="btn btn-outline-light" >Card Manager</Link>
                    </div>
                <hr></hr>
                <div>Players</div>
                <ul className="list-group-flush">{lobbyList}</ul>
            </div>)
        )
    
    // game page return    
    return(
        badUuid ? (
            <NoMatch />
        ) : (
            <span>
                {gamePageComponent}
            </span>
        )
        
        
         
        
    )
}

export default GamePage;