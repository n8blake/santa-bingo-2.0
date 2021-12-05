import React from 'react';
import { Redirect } from "react-router-dom";
import { useStoreContext } from '../../utils/GlobalState';
import './PlayerList.scss';

function PlayerList(props) {
    
    const [state] = useStoreContext();

    const player = props.player;
    const leavingRoom = props.leavingRoom;

    return(
        <div className="list-group-item" key={player._id}>
                <div className="d-flex justify-content-between">
                    <div >
                        <span className="user-display-monogram m-2">{player.displayName}</span>
                        <span className="m-2"> {player.firstName} {player.lastName} </span>
                    </div>
                    <div >
                        {
                            (player._id === state.user._id) || (state.user._id === props.creator._id) ? (
                                <button onClick={() => props.leaveRoom(player._id)} title="Remove Player from Game Room" className="btn text-light user-control-btn">
                                    <i className="bi bi-person-x-fill"></i>
                                </button>
                            )  : (
                                <></>
                            )                    
                        }
                        { leavingRoom ? ( <Redirect to="/" /> ) : ( <></>)}
                    </div>
                </div>
                <hr></hr>
            </div>
    );
}

export default PlayerList;