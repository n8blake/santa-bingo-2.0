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
    const [name, setName] = useState("");
    const debouncedEmail = useDebounce(email, 500);

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