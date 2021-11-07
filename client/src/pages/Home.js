import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStoreContext } from "../utils/GlobalState";
import API from "../utils/API";
//import Card from '../components/Card/Card';
import './Home.scss';
import { SET_IN_GAME } from "../utils/actions";


function Home(){
    
    const [state, dispatch] = useStoreContext();
    const [gameNames, setGameNames] = useState([]);

    //const gameNames = ["Blake Family", "Roberts Family", "Jaren Blake Family"];
    useEffect(() => {
        dispatch({
            type: SET_IN_GAME,
            inGame: false
        });
        const metaThemeColor = document.querySelector("meta[name=theme-color]");
        metaThemeColor.setAttribute("content", "#150300");
        API.getGames().then(games => {
            console.log(games);
            setGameNames(games.data);
        })
        .catch(error => console.log(error));
    }, [])

    const gameListItems = gameNames.map(game => {
        return(<li className="list-group-item" key={game.uuid}>
            <Link to={`/game/${game.uuid}`} className="d-flex justify-content-between gameName">
                <span className="m-2 gameName">{game.name} </span>
                <span to={""} className="text-light"><i className="bi bi-caret-right-fill"></i></span>
            </Link>
        </li>)
    })

    return(
        <div className="container">
            <div className="d-flex justify-content-center">
                <span>GAMES</span>
            </div>
            <div className="list-group-flush">
                {gameListItems}
            </div>
            <hr></hr>
            <div className="d-flex justify-content-center">
                <div className="m-4">OR</div>
            </div>
            <div className="d-flex justify-content-center">
                
                <Link to={"/newgame/"} className="btn btn-outline-light">CREATE NEW GAME</Link>
            </div>
            
        </div>
    )

}

export default Home;