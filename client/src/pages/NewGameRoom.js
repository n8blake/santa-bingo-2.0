import React, { useState } from "react";
import { Redirect } from "react-router-dom";
//import { useStoreContext } from "../utils/GlobalState";
import API from "../utils/API";

import './NewGameRoom.scss';

function NewGamePage() {

    const [gameRoomName, setGameRoomName] = useState("");
    const [newRoom, setNewRoom] = useState();
    const handleInputChange = event => {
        setGameRoomName(event.target.value);
    }

    const submitNewGame = () => {
        if(gameRoomName){
            console.log(`Submitting ${gameRoomName}`);
            API.createNewGameRoom(gameRoomName).then(response => {
                console.log(response);
                setNewRoom(response.data);
            })
            .catch(error => console.log(error));
        }
    }

    return(
        <div className="container">
            <div className="d-flex justify-content-center">
                <span>CREATE A NEW GAME ROOM</span>
            </div>
            <hr></hr>
            <div className="form-new-game">
                <label htmlFor="gameName" className="sr-only">Game name</label>
                <input className="form-control" type="text" name="gameRoomName" 
                    placeholder="Room Name" onChange={handleInputChange} required autoFocus></input>
            </div>
            <div className="d-grid gap-2">
            {
                gameRoomName ? (
                    <button className="btn btn-block mt-4 btn-outline-light" onClick={submitNewGame}>Create New Game Room</button>
                ) : (
                    <button className="btn btn-block mt-4 btn-outline-light" disabled>Create New Game Room</button>
                )
            }
            </div>
            {
                newRoom ? (
                    <Redirect to={`/gameroom/${newRoom._id}`} />
                ) : (
                    <div></div>
                )
            }
            
        </div>
    )
}

export default NewGamePage;