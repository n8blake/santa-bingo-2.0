import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { useStoreContext } from "../utils/GlobalState";
import useDebounce from "../utils/debounceHook";
import './ProfilePage.scss';

function ProfilePage(props){
    
    const [state, dispatch] = useStoreContext();
    const [email, setEmail] = useState("");
    const debouncedEmail = useDebounce(email, 500);
    const handleInputChange = event => {
        const email = event.target.value;
        setEmail(event.target.value);
    }

    return(
        <div className="container">
            <div className="input-wrapper title">Edit Profile</div>
            <div className="login-form">
                <div className="input-wrapper">
                    <input type="text" name="firstName" placeholder="First Name" onChange={handleInputChange}></input>
                </div>
                <div className="input-wrapper">
                    <input type="text" name="lastName" placeholder="Last Name" onChange={handleInputChange}></input>
                </div>
                <div className="input-wrapper">
                    <input type="text" name="displayName" placeholder="Display Name" onChange={handleInputChange}></input>
                </div>
            </div>
        </div>
    )

}

export default ProfilePage;