import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { useStoreContext } from "../utils/GlobalState";
import { LOGIN, SET_TOKEN, SET_IN_GAME, SET_USER } from "../utils/actions";
import API from "../utils/API";
import useDebounce from "../utils/debounceHook";
import "./LoginPage.scss";
import snowflake from '../assets/SVG/snowflake_white.svg';

function LoginPage(props) {
    const [state, dispatch] = useStoreContext();
    const [email, setEmail] = useState();
    const [firstName, setFirstName ] = useState();
    const [lastName, setLastName ] = useState();
    const [emailInUse, setEmailInUse] = useState(true);
    const [password, setPassword] = useState();
    const [passwordConf, setPasswordConf] = useState();
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [formFilled, setFormFilled ] = useState(false);
    const debouncedEmail = useDebounce(email, 500);
    const debouncedPasswordConf = useDebounce(passwordConf, 500);

    const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };

    const handleInputChange = event => {
        if(event.target.name === 'email') {
            //const email = event.target.value;
            if(validateEmail(event.target.value)){
                setEmail(event.target.value);
            } else {
                setEmail("")
            }
        } else if(event.target.name === 'password') {
            setPassword(event.target.value);
        } else if(event.target.name === 'password-conf') {
            setPasswordConf(event.target.value);
        } else if(event.target.name === 'firstName') {
            setFirstName(event.target.value);
        } else if(event.target.name === 'lastName') {
            setLastName(event.target.value);
        }
    }

    const submitLogin = () => {
        setFetching(true);
        API.login(debouncedEmail, password).then(response => {
            //console.log(result);
            if(response.data){
                if(response.data.token && response.data.user){
                    dispatch({
                        type: SET_TOKEN,
                        token: response.data.token
                    });
                    dispatch({
                        type: SET_USER,
                        user: response.data.user
                    })
                    dispatch({
                        type: LOGIN,
                        login: true
                    });
                } else {
                    console.log("No user or token in response");
                }
            }
            setFetching(false);
        })
        .catch(err => {
            console.log(err);
            setFetching(false);
        })
    }

    const submitNewUser = () => {
        setFetching(true);
        const displayName = `${firstName.charAt(0)}${lastName.charAt(0)}`;
        const newUser = { firstName, lastName, email, password, displayName };
        API.newUser(newUser).then(response => {
            if(response.status === 200){
                if(response.data && response.data.token && response.data.user){
                    dispatch({
                        type: SET_TOKEN,
                        token: response.data.token
                    });
                    dispatch({
                        type: SET_USER,
                        user: response.data.user
                    })
                    dispatch({
                        type: LOGIN,
                        login: true
                    });
                } else {
                    console.log("No user or token in response");
                }
            }
        })
        .catch(error => {
            console.log('New user creation error');
            console.log(error);
        })
    }

    useEffect(() => {
        dispatch({
            type: SET_IN_GAME,
            inGame: false
        });
        
        if(!state.loggedIn){
            API.checkLogin().then(response => {
                if(response.data && response.data.token){
                    dispatch({
                        type: SET_TOKEN,
                        token: response.data.token
                    });
                    dispatch({
                        type: LOGIN,
                        login: true
                    });
                }
            })
            .catch(error => {
                //console.log(error);
            })
        }

        if(emailInUse){
            if(debouncedEmail && password){
                setFormFilled(true);
            } else {
                setFormFilled(false);
            }
        } else {
            if(password !== debouncedPasswordConf){
                setPasswordMismatch(true);
                setFormFilled(false);
            } else {
                setPasswordMismatch(false)
                if(firstName && lastName && debouncedEmail && password && debouncedPasswordConf){
                    setFormFilled(true);
                } else {
                    setFormFilled(false);
                }
            }
            
        }

        if(debouncedEmail && validateEmail(debouncedEmail)){
            // check email
            API.checkEmail(debouncedEmail).then(response => {
                //console.log(result);
                if(response.data){
                    console.log(response)
                    setEmailInUse(true);
                } else {
                   // 
                   setEmailInUse(false);
                }
            })
            .catch(error => {
                console.log(error);
                setEmailInUse(false);
            })
        }

        return () => {
            // ?
        }

    }, [debouncedEmail, emailInUse, state.token, state.loggedIn, dispatch, password, passwordConf, debouncedPasswordConf, firstName, lastName]);

    return (
        <div className="container">
            <div className="game-bg bg-grad-red"></div>
            {!state.token ? (
                <div className="login-form">
                    <h3 className="h3 mb-3 font-weight-normal">
                        Come Join the Party!
                    </h3>
                    <div className="form-signin">
                        
                        { debouncedEmail ? (
                            <span>
                                <label htmlFor="inputEmail" className="sr-only">Email address</label>
                                <input className="form-control email-group" type="email" name="email" 
                            placeholder="email address" onChange={handleInputChange} required autoFocus></input>
                                { emailInUse ? (
                                    <span>
                                    <label htmlFor="password" className="sr-only">Password</label>
                                    <input type="password" id="password" name="password" className="form-control" 
                                        placeholder="Password" onChange={handleInputChange} required></input>
                                    </span>
                                ):(
                                    <span>
                                        <label htmlFor="firstName" className="sr-only">First Name</label>
                                        <input type="text" id="firstNameField" name="firstName" className="form-control" 
                                            placeholder="First Name" onChange={handleInputChange} required></input>
                                        <label htmlFor="lastName" className="sr-only">Last Name</label>
                                        <input type="text" id="lastNameField" name="lastName" className="form-control" 
                                            placeholder="Last Name" onChange={handleInputChange} required></input>
                                        {
                                        passwordMismatch && debouncedPasswordConf ? (
                                            <span>
                                                <label htmlFor="password" className="sr-only">Password</label>
                                                <input type="password" id="newPassword" name="password" className="form-control is-invalid" 
                                                    placeholder="Password" onChange={handleInputChange} required></input>
                                                <label htmlFor="password-conf" className="sr-only">Confirm Password</label>
                                                <input type="password" id="password-conf" name="password-conf" className="form-control is-invalid" 
                                                    placeholder="Confirm Password" onChange={handleInputChange} required></input>
                                                <div class="invalid-feedback m-2">
                                                    Password and Password Confirmation do not match.
                                                </div>
                                        </span>
                                        ) : (
                                            <span>
                                                <label htmlFor="password" className="sr-only">Password</label>
                                                <input type="password" id="newPassword" name="password" className="form-control" 
                                                    placeholder="Password" onChange={handleInputChange} required></input>
                                                <label htmlFor="password-conf" className="sr-only">Confirm Password</label>
                                                <input type="password" id="password-conf" name="password-conf" className="form-control" 
                                                    placeholder="Confirm Password" onChange={handleInputChange} required></input>
                                            </span>
                                        )
                                        }               
                                    </span>
                                )}
                            </span>
                        ):(
                            <span>
                                <label htmlFor="inputEmail" className="sr-only">Email address</label>
                                <input className="form-control email-alone " type="email" name="email" 
                            placeholder="email address" onChange={handleInputChange} required autoFocus></input>
                                
                            </span>
                        )}
                        
                        
                    </div>
                    <div>
                        {
                            fetching ? (
                                <img className="snowflake spinner" src={snowflake} alt="snoflake"/>
                            ) : (
                                formFilled ? (
                                    emailInUse ? (
                                        <button className="btn btn-outline-primary px-4 m-4" onClick={submitLogin} >JOIN THE PARTY!</button>
                                    ) : (
                                        <button className="btn btn-outline-primary px-4 m-4" onClick={submitNewUser} >JOIN THE PARTY!</button>
                                    )
                                    
                                ) : (
                                    <button className="btn btn-outline-primary px-4 m-4" disabled>JOIN THE PARTY!</button>
                                )
                                
                            )
                        }
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