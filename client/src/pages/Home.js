import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { useStoreContext } from "../utils/GlobalState";
import Card from '../components/Card/Card';
import './Home.scss';

function Home(){
    
    const [state, dispatch] = useStoreContext();

    const cardTitle = ['S', 'a', 'n', 't', 'A'];
    const cells = {
        column_0: [2, 1, 9, 11, 3],
        column_1: [16, 17, 29, 21, 30],
        column_2: [42, 41, 0, 31, 32],
        column_3: [52, 51, 49, 48, 53],
        column_4: [72, 71, 69, 65, 63],
    }

    const gameNames = ["Blake Family", "Roberts Family", "Jaren Blake Family"];

    const gameListItems = gameNames.map(game => {
        return(<li className="list-group-item">
            <div className="d-flex justify-content-between">
                <span className="m-2">{game}</span>
                <button className="btn bnt-sm btn-outline-light">JOIN</button>
            </div>
        </li>)
    })

    return(
        <div className="container">
            <div className="d-flex justify-content-center">
                <span>JOIN A GAME ROOM</span>
            </div>
            <div className="list-group-flush">
                {gameListItems}
            </div>
            <div className="d-flex justify-content-center">
                <div className="m-4">OR</div>
            </div>
            <div className="d-flex justify-content-center">
                
                <button className="btn btn-outline-light">CREATE NEW GAME</button>
            </div>
            <hr></hr>
            <div>
                cards...
            </div>
        </div>
    )

}

export default Home;