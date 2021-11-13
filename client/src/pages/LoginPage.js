import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { useStoreContext } from "../utils/GlobalState";
import { LOGIN, SET_TOKEN, VALIDATE_TOKEN, SET_IN_GAME } from "../utils/actions";
import API from "../utils/API";
import "./LoginPage.scss";

import CountDown from "../components/CountDown/CountDown";

function LoginPage(props) {
    const [state, dispatch] = useStoreContext();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    const handleInputChange = event => {
        if(event.target.name === 'email') {
            //const email = event.target.value;
            setEmail(event.target.value);
        } else {
            //const name = event.target.value;
            setName(event.target.value);
        }
    }

    let token;

    const submitLogin = () => {
        API.login(email, name).then(result => {
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
        })
        .catch(err => {
            console.log(err);
        })
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
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        dispatch({
            type: SET_IN_GAME,
            inGame: false
        });
        const metaThemeColor = document.querySelector("meta[name=theme-color]");
        metaThemeColor.setAttribute("content", "#150300");
        if(!state.loggedIn){
            API.checkLoginStatus().then(result => {
                console.log(result);
                if(result.data){
                    if(result.data.token){
                        validateToken(result.data.token);
                    }
                }
            })
            .catch(err => {
                console.log(err);
            })
        }

        if(token){
            // validate token...
            validateToken(token);
        }
    }, [token, state.token, state.loggedIn, state.validateToken]);

    return (
        <div className="container">
            <div className="game-bg bg-grad-red"></div>
            {!state.validToken ? (
                <div className="login-form">
                    <h3 class="h3 mb-3 font-weight-normal">COME JOIN THE PARTY!</h3>
                    <div className="form-signin">
                        <label for="inputEmail" class="sr-only">Email address</label>
                        <input className="form-control" type="email" name="email" placeholder="email address" onChange={handleInputChange} required autofocus></input>
                        <label for="loginName" class="sr-only">Name</label>
			            <input type="text" id="loginName" name="name" className="form-control" placeholder="Name" onChange={handleInputChange} required></input>
                    </div>
                    <div>
                        <button className="btn btn-outline-primary px-4 m-4" onClick={submitLogin}>JOIN THE PARTY!</button>
                    </div>
                    <CountDown label="Christmas" unitlDate={new Date('2021-12-25T00:00:00')} />
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