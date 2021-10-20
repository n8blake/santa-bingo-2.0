import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { useStoreContext } from "../utils/GlobalState";
import useDebounce from "../utils/debounceHook";
import './ProfilePage.scss';
import { SET_DISPLAY_NAME, LOGIN, SET_TOKEN, SET_EMAIL, SET_FIRST_NAME, SET_LAST_NAME, VALIDATE_TOKEN, SET_USER_ID, SET_COLOR } from "../utils/actions";
import API from "../utils/API";

function ProfilePage(props){
    
    const [state, dispatch] = useStoreContext();
    const [changes, setChanges] = useState(false);
    const [editing, setEditing] = useState(false);
    const [newProfile, setNewProfile] = useState(false);
    const [monogramLengthError, setMLE] = useState(false);
    //const debouncedEmail = useDebounce(email, 500);

    const handleInputChange = event => {
        setEditing(true);
        if(event.target.name === 'displayName'){
            // update display mongram
            if(event.target.value.length > 2) {
                // error
                setMLE(true);
            } else {
                dispatch({
                    type: SET_DISPLAY_NAME,
                    displayName: event.target.value
                });
                setChanges(true);
                setMLE(false);
            }
        }
        if(event.target.name === 'firstName'){
            dispatch({
                type: SET_FIRST_NAME,
                firstName: event.target.value
            })
            setChanges(true);
        }
        if(event.target.name === 'lastName'){
            dispatch({
                type: SET_LAST_NAME,
                lastName: event.target.value
            })
            setChanges(true);
        }
    }

    const changeProfileColor = color => {
        dispatch({
            type: SET_COLOR,
            color: color
        })
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
                type: SET_DISPLAY_NAME,
                displayName: ""
            });
            dispatch({
                type: SET_EMAIL,
                email: ""
            })
            dispatch({
                type: SET_FIRST_NAME,
                firstName: ""
            })
            dispatch({
                type: SET_LAST_NAME,
                lastName: ""
            })
            dispatch({
                type: LOGIN,
                loggedIn: false
            })
            dispatch({
                type: SET_TOKEN,
                token: ""
            })
            dispatch({
                type: VALIDATE_TOKEN,
                validToken: false
            })
        });
    }

    const update = () => {
        const profile = {
            id: state.userID,
            firstName: state.firstName,
            lastName: state.lastName,
            displayName: state.displayName,
            email: state.email,
            color: state.color
        };
        if(newProfile) {
            // if(!profile.email){
            //     throw new Error("Profile email not set");
            // }
            API.createProfileData(profile).then(response => {
                console.log(response);
                setChanges(false);
                setNewProfile(false);
            })
        } else {
            API.updateProfileData(profile).then(response => {
                console.log(response);
                setChanges(false);
            })
        }   
    }

    useEffect(() => {
        const token = state.token;
        console.log("fetching profile data");
        if((!state.firstName || !state.lastName || !state.displayName) && !editing){
            API.getProfileData(token).then(results => {
                console.log(results.data[0]);
                //console.log(results.data[0]._id);
                if(results.data[0]){
                    if(results.data[0].firstName){
                        console.log("Setting first name");
                        dispatch({
                            type: SET_FIRST_NAME,
                            firstName: results.data[0].firstName
                        })
                    }
                    if(results.data[0].lastName){
                        dispatch({
                            type: SET_LAST_NAME,
                            lastName: results.data[0].lastName
                        })
                    }
                    if(results.data[0].displayName){
                        dispatch({
                            type: SET_DISPLAY_NAME,
                            displayName: results.data[0].displayName
                        })
                    }
                    if(results.data[0].email){
                        dispatch({
                            type: SET_EMAIL,
                            email: results.data[0].email
                        })
                    }
                    if(results.data[0]._id){
                        //console.log("Setting User ID: " + results.data[0]._id);
                        dispatch({
                            type: SET_USER_ID,
                            userID: results.data[0]._id
                        })
                    } 
                    if(results.data[0].color){
                        dispatch({
                            type: SET_COLOR,
                            color: results.data[0].color
                        })
                    }
                } else {
                    setNewProfile(true);
                    dispatch({
                        type: SET_COLOR,
                        color: 'red'
                    })
                }
            })
        }
    }, [state.token, state.firstName, state.lastName, state.displayName])

    return(
        <div className="container">
            <div className="input-wrapper title">Edit Profile</div>
            
            <div className={`profile-color-${state.color} profile-badge`}>
                <span className="profile-badge-letters">{
                    state.displayName ? (
                        <span>{state.displayName}</span>
                    ) : (
                        <span></span>
                    )
                }</span>
            </div>
            <div className="color-picker-wrapper">
            <div className="color-picker">
                <span className={`profile-color-red profile-color-choice ${selectionClass('red')}`} onClick={() => changeProfileColor('red')}></span>
                <span className={`profile-color-green profile-color-choice ${selectionClass('green')}`} onClick={() => changeProfileColor('green')}></span>
                <span className={`profile-color-yellow profile-color-choice ${selectionClass('yellow')}`} onClick={() => changeProfileColor('yellow')}></span>
                <span className={`profile-color-blue profile-color-choice ${selectionClass('blue')}`} onClick={() => changeProfileColor('blue')}></span>
            </div>
            </div>
            <div className="login-form">
                <div className="input-wrapper">
                    <input type="text" name="firstName" placeholder="First Name" value={state.firstName} onChange={handleInputChange}></input>
                </div>
                <div className="input-wrapper">
                    <input type="text" name="lastName" placeholder="Last Name" value={state.lastName} onChange={handleInputChange}></input>
                </div>
                <div className="input-wrapper">
                    <input type="text" name="displayName" placeholder="Display Monogram" value={state.displayName} onChange={handleInputChange}></input>
                </div>
                <div>
                    { monogramLengthError ? (
                        <span>Monogram Length must be 2 characters or less.</span>
                    ) : <span></span>}
                </div>
            </div>
            <div className="d-grid gap-2 col-6 mx-auto">
                {changes || newProfile ? (
                    !state.displayName || !state.firstName || !state.lastName ? (
                        <div id="new-profile-helper">Please complete your profile!</div>
                    ) : (
                        <button className="btn btn-lg btn-outline-secondary submit-changes-btn" onClick={update}>Update Profile</button>
                    )
                ) : (
                        <div></div>
                )}
            </div>
            <div className="d-grid gap-2 col-6 mx-auto">
                <button className="btn btn-lg btn-outline-secondary submit-changes-btn" onClick={logout}>Logout</button>
            </div>
        </div>
    )

}

export default ProfilePage;