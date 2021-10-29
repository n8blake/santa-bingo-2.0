import React, { useState } from "react";
//import { Redirect } from "react-router-dom";
//import { useStoreContext } from "../utils/GlobalState";
import API from "../utils/API";

import './NewGame.scss';

function NewGamePage() {

    const [gameName, setGameName] = useState("");

    const handleInputChange = event => {
        if(event.target.name === 'gameName') {
            //const email = event.target.value;
            setGameName(event.target.value);
        } else {
            //const name = event.target.value;
            setGameName(event.target.value);
        }
    }

    const submitNewGame = () => {
        if(gameName){
            console.log(`Submitting ${gameName}`);
            API.createNewGame(gameName).then(response => {
                console.log(response);

            })
            .catch(error => console.log(error));
        }
    }

    return(
        <div className="container">
            <div className="form-new-game">
                <label htmlFor="gameName" className="sr-only">Game name</label>
                <input className="form-control" type="text" name="gameName" 
                    placeholder="Game Name" onChange={handleInputChange} required autoFocus></input>
            </div>
            {
                gameName ? (
                    <button className="btn mt-4 btn-outline-light" onClick={submitNewGame}>Create New Game</button>
                ) : (
                    <button className="btn mt-4 btn-outline-light" disabled>Create New Game</button>
                )
            }
            
        </div>
    )
}

export default NewGamePage;