import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useStoreContext } from './GlobalState';
import API from '../utils/API';
import { LOGIN, SET_TOKEN, SET_USER } from "../utils/actions";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
    const [checking, setChecking] = useState(true);
    const [state, dispatch] = useStoreContext();
    
    useEffect(() => {
      if(!state.loggedIn){
        setChecking(true);
        try { 
          //console.log("checking...");
          setChecking(true);
          API.checkLogin().then(result => {
            if(result.status === 200){
              if(result.data && result.data.token){
                //console.log(result.data);
                const token = result.data.token;
                // set login token
                if(!state.token){
                  dispatch({
                    type: SET_TOKEN,
                    token: token
                  });
                  dispatch({
                      type: LOGIN,
                      login: true
                  });
                }
                if(result.data.user){
                  dispatch({
                    type: SET_USER,
                    user: result.data.user
                  })
                }
              }
            } 
        })
        .catch(err => {
          console.log(err);
          setChecking(false);
        })
      } catch (err) {
        console.log(err);
        setChecking(false);
      }
      }
    }, [state.loggedIn])

    return (
        
          <Route
            {...rest}
            render={({ location }) =>
              state.token ? (
                children
              ) : (
                  checking ? (
                    <div className="container">Checking login status</div>
                  ) : (
                    <Redirect
                      to={{
                        pathname: "/login",
                        state: { from: location }
                      }}
                    />
                  )
              )
            }
          />
        
    );
  }

export default PrivateRoute;