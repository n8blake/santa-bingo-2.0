import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStoreContext } from "../utils/GlobalState";
import API from "../utils/API";
import MiniCardsViewer from '../components/MiniCardsViewer/MiniCardsViewer';
import './Home.scss';
import { SET_IN_GAME } from "../utils/actions";


function Home(){
    
    const [state, dispatch] = useStoreContext();
    const [cards, setCards] = useState([]);
    const [gameRooms, setGameRooms] = useState([]);
    const [myGameRooms, setMyGameRooms] = useState([]);
    const cardTitle = ['S', 'a', 'n', 't', 'A'];


    const joinRoom = (roomId) => {
        API.joinGameRoom(roomId, state.user._id).then(response => {
            console.log(response);
        })
        .catch(error => console.log(error))
    }

    useEffect(() => {
        dispatch({
            type: SET_IN_GAME,
            inGame: false
        });
        
        //TO DO: QUERY TO RETURN LIST OF 'MY GAME ROOMS'
        if((!myGameRooms || myGameRooms.length === 0) && state.user){
            const players = [state.user._id];
            API.getRoomsByPlayers(players).then(response => {
                //console.log(response.data);
                if(response.data){
                    setMyGameRooms(response.data)
                }
            })
            .catch(error => {
                console.log(error);
            })
        }

        if(!gameRooms || gameRooms.length === 0 && state.user && state.user._id){
            const players = [state.user._id];
            API.getRoomsByNotPlayers(players).then(response => {
                //console.log(response.data);
                if(response.data){
                    setGameRooms(response.data)
                }
            })
            .catch(error => {
                console.log(error);
            })
        }

        if(!cards || cards.length === 0){
            API.getCards(state.user._id).then(response => {
                if(response.data){
                    setCards(response.data);
                }
            })
            .catch(error => {
                console.log(error);
            })
        }

    }, [dispatch, gameRooms, myGameRooms, state.user])

    const myGameRoomsListItems = myGameRooms.map(room => {
        return(<li className="list-group-item m-2" key={room._id}>
            <Link to={`/gameroom/${room._id}`} className="d-flex justify-content-between gameName">
                <div>
                    <div className="gameName">{room.roomName} </div>
                    <small className="text-light game-room-detail">{room.creator.firstName} {room.creator.lastName}</small>
                </div>
                <span to={""} className="text-light m-2"><i className="bi bi-caret-right-fill"></i></span>
            </Link>
        </li>)
    })

    const gameRoomsListItems = gameRooms.map(room => {
        return(
            <li className="list-group-item m-2" key={room._id}>
                <Link to={`/gameroom/${room._id}`} onClick={() => joinRoom(room._id)} className="d-flex justify-content-between gameName">
                    <div>
                        <div className="gameName">{room.roomName} </div>
                        <small className="text-light game-room-detail">{room.creator.firstName} {room.creator.lastName}</small>
                    </div>
                    <span className="btn btn-sm btn-outline-light p-2 m-2">Join Room</span>
                </Link>
            </li>
        )
    })

    return(
        <div className="container">
            <div className="d-flex justify-content-center">
                <span>MY CARDS</span>
            </div>
            <MiniCardsViewer cardTitle={cardTitle} cards={cards} />
            <hr></hr>
            {
                myGameRooms.length > 0 ? (
                    <div>
                        <div className="d-flex justify-content-between">
                            <span>My GAME ROOMS</span>
                            <Link to={"/newgame/"} className="btn btn-sm btn-outline-light">NEW ROOM</Link>
                        </div>
                        <div className="list-group-flush">
                            {myGameRoomsListItems}
                        </div>
                    </div>
                ) : (
                    <div className="d-flex justify-content-center">
                        <div>
                            <div className="m-2">
                                <small>You are not currently in any game rooms. Create or join one!</small>
                            </div>
                            <div className="d-flex justify-content-center ">
                                <Link to={"/newgame/"} className="btn btn-sm btn-outline-light m-2">CREATE NEW GAME ROOM</Link>
                            </div>
                        </div>
                    </div>
                )
            }
            <hr></hr>
            {
                gameRoomsListItems && gameRoomsListItems.length > 0 && gameRoomsListItems[0] ? (
                    <div>
                        <div className="d-flex justify-content-center">
                            <span>PUBLIC GAME ROOMS</span>
                        </div>
                        <div className="list-group-flush">
                            {gameRoomsListItems}
                        </div> 
                    </div>
                ) : (
                    <div></div>
                    )
            }
            
        </div>
    )

}

export default Home;