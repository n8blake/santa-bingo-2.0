import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    Redirect
  } from "react-router-dom";
import { useStoreContext } from "../utils/GlobalState";
import useDebounce from "../utils/debounceHook";
import { LOGIN, SET_TOKEN, VALIDATE_TOKEN } from "../utils/actions";
import API from "../utils/API";
import "./LoginPage.scss";

function LoginPage(props) {
    const [state, dispatch] = useStoreContext();
    const [email, setEmail] = useState("");
    const debouncedEmail = useDebounce(email, 500);

    const handleInputChange = event => {
        const email = event.target.value;
        setEmail(event.target.value);
    }

    let token;

    const submitLogin = () => {
        API.login(email).then(result => {
            console.log(result);
            if(result.data){
                if(result.data.token){
                    token = result.data.token;
                    dispatch({
                        type: SET_TOKEN,
                        token: token
                    });
                    dispatch({
                        type: VALIDATE_TOKEN,
                        isValid: true
                    });
                    dispatch({
                        type: LOGIN,
                        login: true
                    });
                }
            }
        });
    }

    const validateToken = (token) => {
        API.validateToken(token).then(result => {
            console.log(result);
            if(result.status === 200){
                console.log("ok!");
                dispatch({
                    type: SET_TOKEN,
                    token: token
                });
                dispatch({
                    type: VALIDATE_TOKEN,
                    isValid: true
                });
                dispatch({
                    type: LOGIN,
                    login: true
                });
            } else {
                console.log("unsetting token");
                dispatch({
                    type: SET_TOKEN,
                    token: ""
                });
                dispatch({
                    type: VALIDATE_TOKEN,
                    isValid: false
                });
                dispatch({
                    type: LOGIN,
                    login: false
                });
            }
        })
    }

    useEffect(() => {
       // do something ?
        if(!state.loggedIn){
            API.checkLoginStatus().then(result => {
                console.log(result);
                if(result.data){
                    if(result.data.token){
                        validateToken(result.data.token);
                    }
                }
            })
        }

        if(token){
            // validate token...
            validateToken(token);
        }
    }, [token, state.token, state.loggedIn, state.validateToken]);

    return (
        <div className="container">
            {!state.validToken ? (
                <div className="login-form">
                    <div className="input-wrapper">
                        <input type="text" name="email" placeholder="email address" onChange={handleInputChange}></input>
                    </div>
                    <div>
                        <button className="btn btn-outline-primary px-4 m-4" onClick={submitLogin}>Login with email</button>
                    </div>
                </div>
            ) : (
                <div className="login-form">You are logged in!
                    <p>
                        <Redirect to="/" />
                    </p>
                </div>
            )}
            
        </div>
    )
}

export default LoginPage;