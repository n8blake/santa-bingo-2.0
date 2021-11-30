import React, { useEffect, useState } from "react";
//import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { useStoreContext } from "../utils/GlobalState";
import './ProfilePage.scss';
import { LOGIN, SET_TOKEN, SET_IN_GAME, SET_USER } from "../utils/actions";
import API from "../utils/API";

function ProfilePage(props){
    
    const [state, dispatch] = useStoreContext();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [color, setColor] = useState();
    const [displayName, setDisplayName] = useState();
    const [profileUserData, setProfileUserData] = useState(false);
    const [changes, setChanges] = useState(false);
    const [monogramLengthError, setMLE] = useState(false);
    //const debouncedEmail = useDebounce(email, 500);

    const handleInputChange = event => {
        if(event.target.name === 'firstName'){
            setFirstName(event.target.value);
        } else if(event.target.name === 'lastName'){
            setLastName(event.target.value);
        } else if(event.target.name === 'displayName'){
            if(event.target.value.length > 2){
                setMLE(true);
            } else {
                setMLE(false);
                setDisplayName(event.target.value);
            }
        }
        
    }

    const changeProfileColor = color => {
        setColor(color);
        setChanges(true);
    }
    const selectionClass = color => {
        if(state.color === color){
            return 'profile-color-choice-selected'
        } else {
            return '';
        }
    }

    const logout = event => {
        API.logout().then(result => {
            dispatch({
                type: SET_USER,
                user: {}
            });
            dispatch({
                type: LOGIN,
                loggedIn: false
            })
            dispatch({
                type: SET_TOKEN,
                token: ""
            })
        });
    }

    const update = () => {
        const user = {firstName, lastName, color, displayName}
        console.log(state.user);
        API.updateUser(user, state.user._id).then(response => {
            if(response.status === 200) {
                API.refresh().then(result => {
                    console.log(result);
                    if(result.data && result.data.user){
                        dispatch({
                            type: SET_USER,
                            user: result.data.user
                        })
                    }
                })
                .catch(error => {
                    console.log('an error occured');
                    console.log(error);
                    syncWithStateUser();
                })
            }
            setChanges(false);
        }).catch(error => {
            console.log('an update error occured');
            console.log(error);
        })
    }

    const syncWithStateUser = () => {
        setFirstName(state.user.firstName);
        setLastName(state.user.lastName);
        setColor(state.user.color);
        setDisplayName(state.user.displayName);
        setProfileUserData(true);
    }

    useEffect(() => {
        dispatch({
            type: SET_IN_GAME,
            inGame: false
        });
        if(state.user._id && !profileUserData){
            // Set profile user data to user data
            // only the things we can change...
            syncWithStateUser();
        }
        if( firstName !== state.user.firstName ||
            lastName !== state.user.lastName || 
            displayName !== state.user.displayName ||
            color !== state.user.color){
                setChanges(true);
        } else {
            setChanges(false);
        }
    }, [color, dispatch, displayName, firstName, lastName, profileUserData, state.user])

    return(
        
        profileUserData ? (
            <div className="container">
        <div className="game-bg bg-grad-red"></div>
        <div className="input-wrapper title">Edit Profile</div>
        
        <div className={`profile-color-${color} profile-badge`}>
            <span className="profile-badge-letters">{
                displayName ? (
                    <span>{displayName}</span>
                ) : (
                    <span></span>
                )
            }</span>
        </div>
        <div className="color-picker-wrapper">
        <div className="color-picker">
            <span className={`profile-color-red profile-color-choice ${selectionClass('red')}`} 
                onClick={() => changeProfileColor('red')}></span>
            <span className={`profile-color-green profile-color-choice ${selectionClass('green')}`} 
                onClick={() => changeProfileColor('green')}></span>
            <span className={`profile-color-yellow profile-color-choice ${selectionClass('yellow')}`} 
                onClick={() => changeProfileColor('yellow')}></span>
            <span className={`profile-color-blue profile-color-choice ${selectionClass('blue')}`} 
                onClick={() => changeProfileColor('blue')}></span>
        </div>
        </div>
        <div className="login-form">
            <div className="input-wrapper">
                <input type="text" name="firstName" placeholder="First Name" value={firstName} 
                    onChange={handleInputChange}></input>
            </div>
            <div className="input-wrapper">
                <input type="text" name="lastName" placeholder="Last Name" value={lastName} 
                    onChange={handleInputChange}></input>
            </div>
            <div className="input-wrapper">
                <input type="text" name="displayName" placeholder="Display Monogram" value={displayName} 
                    onChange={handleInputChange}></input>
            </div>
            <div>
                { monogramLengthError ? (
                    <span>Monogram Length must be 2 characters or less.</span>
                ) : <span></span>}
            </div>
        </div>
        <div className="d-grid gap-2 col-6 mx-auto">
            { changes ? (
                <button className="btn btn-lg btn-outline-secondary submit-changes-btn" onClick={update}>Update Profile</button>
            ) : (
                <div></div>
            )}
        </div>
        <div className="d-grid gap-2 col-6 mx-auto">
            <button className="btn btn-lg btn-outline-secondary submit-changes-btn" onClick={logout}>Logout</button>
        </div>
            </div>
        ) : (
            <div></div>
        )
        
        
    )

}

export default ProfilePage;