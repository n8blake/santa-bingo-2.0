import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useStoreContext } from "../utils/GlobalState";
import { SocketContext } from "../utils/socket";
import API from "../utils/API";
import MiniCardsViewer from '../components/MiniCardsViewer/MiniCardsViewer';
import './Home.scss';
import { SET_IN_GAME } from "../utils/actions";


function Home(){
    
    const [state, dispatch] = useStoreContext();
    const socket = useContext(SocketContext);
    const [joinedMainRoom, setJoinedMainRoom] = useState(false);
    const [cards, setCards] = useState([]);
    const [gameRooms, setGameRooms] = useState([]);
    const [myGameRooms, setMyGameRooms] = useState([]);
    const cardTitle = ['S', 'a', 'n', 't', 'A'];


    const joinRoom = (roomId) => {
        API.joinGameRoom(roomId, state.user._id).then(response => {
            console.log(`Emitting ${roomId}`);
            socket.emit('roomsUpdate', roomId);
        })
        .catch(error => console.log(error))
    }


    const loadRooms = async () => {
        if(state.user && state.user._id){
            const players = [state.user._id];
            await API.getRoomsByPlayers(players).then(response => {
                //console.log(response.data);
                if(response.data){
                    setMyGameRooms(response.data)
                }
            })
            .catch(error => {
                console.log(error);
                setMyGameRooms([])
            })
            await API.getCards(state.user._id).then(response => {
                if(response.data){
                    setCards(response.data);
                }
            })
            .catch(error => {
                console.log(error);
            })
            await API.getRoomsByNotPlayers(players).then(response => {
                //console.log(response.data);
                if(response.data){
                    setGameRooms(response.data)
                }
            })
            .catch(error => {
                console.log(error);
                setGameRooms([])
            })
        }
    }

    const handleRoomsUpdate = (data) => {
        loadRooms();
    }

    const handleJoined = (data) => {
        if(data === 'main'){
            setJoinedMainRoom(true);
        }
    }

    useEffect(() => {
        dispatch({
            type: SET_IN_GAME,
            inGame: false
        });
        
        if(state.user && state.user._id){
            loadRooms();
        }

        if(!joinedMainRoom){
            socket.emit('join', 'main');
        }

        socket.on('roomsUpdate', handleRoomsUpdate);
        socket.on('joined', handleJoined);

        return () => {
            socket.off('roomsUpdate', handleRoomsUpdate);
            socket.off('joined', handleJoined);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.user])

    const myGameRoomsListItems = myGameRooms.map(room => {
        //console.log(room);
        return(<li className="list-group-item m-2" key={room._id}>
            
            <Link to={`/gameroom/${room._id}`} className="d-flex justify-content-between gameName">
                <div className="gameName">
                    <div className="gameName position-relative ml-2">
                        {room.roomName} 
                    {
                        room.inGame ? (<span class="game-badge position-absolute badge rounded-pill">
                        game in progress
                        <span class="visually-hidden">game in progress</span>
                      </span>) : (<></>)
                    }
                    </div>
                    
                    <small className="text-light game-room-detail">{room.creator.firstName} {room.creator.lastName}</small>
                </div>
                <span to={""} className="text-light m-2"><i className="bi bi-caret-right-fill"></i></span>
            </Link>
        </li>)
    })

    const gameRoomsListItems = gameRooms.map(room => {
        return(
            <li className="list-group-item m-2" key={room._id}>
                {
                    room.inGame ? (<span>in game</span>) : (<></>)
                }
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
//<MiniCardsViewer cardTitle={cardTitle} cards={cards} />
    return(
        <div className="container">
            
            
            <hr></hr>
            {
                myGameRooms.length > 0 ? (
                    <div>
                        <div className="d-flex justify-content-center">
                            <span className="title title-red">MY GAME ROOMS</span>
                        </div>
                        <div className="list-group-flush">
                            {myGameRoomsListItems}
                        </div>
                        <div className="d-flex justify-content-center">    
                            <Link to={"/newgame/"} className="btn btn-sm btn-outline-primary">CREATE NEW ROOM</Link>
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
                            <span className="title title-red">GAME ROOMS</span>
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