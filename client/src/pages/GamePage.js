import React, { useEffect, useState, useContext } from "react";
import { Redirect, useParams, Link } from "react-router-dom";
import { useStoreContext } from "../utils/GlobalState";
import API from "../utils/API";
import { SocketContext } from "../utils/socket";
import Card from '../components/Card/Card';
import CardList from "../components/CardList/CardList";
import CalledNumbers from "../components/CalledNumbers/CalledNumbers";
import { SET_IN_GAME } from "../utils/actions";
import NoMatch from "./NoMatch";

import './GamePage.scss';

function GamePage(props){

    const [state, dispatch] = useStoreContext();
    const socket = useContext(SocketContext);

    let { id } = useParams();
    const [gameManager, setGameManager] = useState(false);
    const [joinedGame, setJoinedGame] = useState(false);
    const [game, setGame] = useState(false);
    //const [gameRoom, setGameRoom] = useState();
    const [cards, setCards] = useState([]);
    const [marks, setMarks] = useState([]);
    const [lobby, setLobby] = useState([]);
    const [gameError, setGameError] = useState(false);
    const [endingGame, setEndingGame] = useState(false);

    const lobbyList = lobby.map(player => {
        return(<li className="list-group-item" key={player._id}>
            <div className="d-flex justify-content-between">
                <div>
                    <span>{player.firstName} {player.lastName}</span>
                </div>
            </div>
        </li>)
    })


    const updateMarks = () => {
        const cardIds = cards.map(card => {
            return card._id;
        })
        API.getMarks(game._id, state.user._id, cardIds).then(response => {
            if(response.data){
                console.log(response.data);
                setMarks(response.data)
            }
        }).catch(error => {
            console.log(error.response.status);
            if(error.response.status === 404){
                setMarks([])
            }
        });
    }

    let lockMarkAPI = false;
    const cardClickHandler = (event) => {
        if(event.card && !event.mark && !lockMarkAPI){
            console.log(`Submitting mark: ${event.number}`)
            lockMarkAPI = true;
            API.markCard(game._id, event.card._id, state.user._id, event.number).then(response => {
                if(response.data){
                    updateMarks();
                }
                lockMarkAPI = false;
            })
            .catch(error => {
                console.log(error);
                lockMarkAPI = false;
            })
        } else if(event.mark && !lockMarkAPI) {
            //unmark
            console.log('unmarking');
            console.log(event.mark);
            lockMarkAPI = true;
            API.removeMark(event.mark._id).then(response => {
                console.log(response.status);
                updateMarks();
                lockMarkAPI = false;
            }).catch(error => {
                lockMarkAPI = false;
                console.log(error);
                updateMarks();
            });
        }
    }

    const endGame = () => {
        //console.log(`ending game ${game._id}`);
        if(game._id && game.gameRoom){
            API.endGame(game._id, game.gameRoom).then(response => {
                //console.log(response.data);
                socket.emit("end", game.gameRoom);
                setEndingGame(true);
            })
            .catch(error => {
                console.log(error)
            })
        } else {
            console.log("Error ending game");
        }
        
    }

    const nextCard = () => {
        // next card logic
        //console.log('Getting next card');
        API.callNextNumber(game._id).then(response =>{
            //console.log(response.data);
            setGame(response.data);
            socket.emit('nextNumberCalled', {gameRoom: game.gameRoom, game: game._id})
        }).catch(error => console.log(error))
    }

    const handleGameEnd = (data) => {
        //console.log(data);
        setEndingGame(true);
    }

    const handleJoinedGame = (data) => {
        //console.log(data);
        setJoinedGame(true);
    }

    const handleNextNubmerCalled = (data) => {
        API.getGame(id).then(response => {
            if(response.data){
                setGame(response.data);
            }
        }).catch(error => console.log(error))
    }

    useEffect(() => {
        if(id && !gameError){
            //console.log(id);
            //try to get the game data
            if(!game && !gameError){
                API.getGame(id).then(response => {
                    //console.log(response.data);
                    if(response.data){
                        setGame(response.data);
                        if(response.data.players){
                            response.data.players.map(playerObj => {
                                //console.log(playerObj.player._id === state.user._id);
                                if(playerObj.player._id === state.user._id){
                                    //console.log("Getting cards");
                                    //console.log(playerObj.cards);
                                    API.getCardsByIds(playerObj.cards).then(response => {
                                        //console.log(response.data);
                                        if(response.data){
                                            setCards(response.data);
                                        }
                                    })
                                    .catch(error => { console.log(error)})
                                }
                            })
                            
                        }
                        // set game manager
                        if(response.data.creator._id === state.user._id){
                            setGameManager(true);
                        }
                        // set in game
                        if(!response.data.inGame){
                            dispatch({
                                type: SET_IN_GAME,
                                inGame: false
                            });
                        } else {
                            dispatch({
                                type: SET_IN_GAME,
                                inGame: true
                            });
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                    setGameError(true);
                    dispatch({
                        type: SET_IN_GAME,
                        inGame: false
                    });
                });
            }
        }

        if(id && state.user && cards && cards.length > 0){
            //get marks for cards
            //console.log(`Getting marks for ${cards.length} cards`);
            updateMarks();
            
        }

        if(!joinedGame && game.gameRoom){
            socket.emit('join', game.gameRoom);
        }
        socket.on("ended", handleGameEnd);
        socket.on("joined", handleJoinedGame);
        socket.on("nextNumberCalled", handleNextNubmerCalled);

        return () => {
            socket.off("ended", handleGameEnd);
            socket.off("joined", handleJoinedGame);
            socket.off("nextNumberCalled", handleNextNubmerCalled);

        }

    }, [state.inGame, state.user, id, cards, gameError])


//<CalledCards numbers={[0, 34, 5, 62, 75]} />
    const gamePageComponent = 
         (
            <div className="container">
                {
                    game && game.numbers ? (<CalledNumbers numbers={game.numbers} />) : (<></>)
                }
                
                { gameManager ? (
                    <div className="game-controls">
                        <button className="btn btn-light m-2" onClick={nextCard}>Next</button>
                        <button className="btn btn-light m-2" onClick={endGame}>End Game</button>
                    </div>
                ) : (
                    <></>
                )}
                <div>
                    <CardList interactable="true" clickHandler={cardClickHandler} cards={cards} marks={marks} calledNumbers={game.numbers}/>
                </div>
            </div>
        )
    
    // game page return    
    return(
        gameError ? (
            <NoMatch />
        ) : (
            <>
                { gamePageComponent }
                { endingGame ? ( <Redirect to={`/gameroom/${game.gameRoom}`} />) : ( <></> )}
            </>
        )

    )
}

export default GamePage;