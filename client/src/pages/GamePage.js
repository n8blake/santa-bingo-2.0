import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Redirect, useParams } from "react-router-dom";
import { useStoreContext } from "../utils/GlobalState";
import API from "../utils/API";
import './GamePage.scss';

import Card from '../components/Card/Card';


function GamePage(props){

    const [state, dispatch] = useStoreContext();

    let { uuid } = useParams();
    const [inGame, setInGame] = useState(false);
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
        return(<li className="list-group-item">
            <div className="d-flex justify-content-between">
                <div>
                    <span>{player.firstName} {player.lastName}</span>
                </div>
            </div>
        </li>)
    })
    useEffect(() => {
        API.getGame(uuid).then(response => {
            console.log(response);
            if(response.data){
                setGameData(response.data);
                setLobby(response.data.players);
                setGameName(response.data.name);
                // set game manager
            }
        })
        .catch(error => console.log(error));
    }, [uuid])

    return(
        <div className="container">
            <h2>{gameName}</h2>
            { gameManager ? (
                <div>Game Controlls</div>
            ) : (
                <div></div>
            )}
            <hr></hr>
                <div>Card Manager Component</div>
            <hr></hr>
            <div>Lobby</div>
            <ul className="list-group-flush">{lobbyList}</ul>
        </div>
    )
}

export default GamePage;