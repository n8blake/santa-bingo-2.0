import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Redirect, useParams } from "react-router-dom";
import { useStoreContext } from "../utils/GlobalState";
import API from "../utils/API";
import './GamePage.scss';

import Card from '../components/Card/Card';
import { SET_IN_GAME } from "../utils/actions";


function GamePage(props){

    const [state, dispatch] = useStoreContext();

    let { uuid } = useParams();
    //const [inGame, setInGame] = useState(false);
    const [gameManager, setGameManager] = useState(false);
    const [gameData, setGameData] = useState({});
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
        const update = {
            start: true
        }
        API.updateGame(gameData.uuid, update)
            .then(response => {
                console.log(response);
                dispatch({
                    type: SET_IN_GAME,
                    inGame: true
                });
            })
            .catch(error => console.log(error));
    }

    const endGame = () => {
        const update = {
            end: true
        }
        API.updateGame(gameData.uuid, update)
            .then(response => {
                dispatch({
                    type: SET_IN_GAME,
                    inGame: false
                });
            })
            .catch(error => console.log(error));
    }

    const nextCard = () => {
        // next card logic
    }

    useEffect(() => {
        API.getGame(uuid).then(response => {
            console.log(response);
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
                }
            }
        })
        .catch(error => console.log(error));
    }, [uuid])

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