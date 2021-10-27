import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useStoreContext } from './GlobalState';
import API from '../utils/API';
import { LOGIN, SET_TOKEN, VALIDATE_TOKEN, SET_FIRST_NAME, SET_LAST_NAME, SET_DISPLAY_NAME, SET_EMAIL, SET_USER_ID, SET_COLOR } from "../utils/actions";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
    const [checking, setChecking] = useState(true);
    const [state, dispatch] = useStoreContext();
    
    useEffect(() => {
      if(!state.loggedIn){
        setChecking(true);
        try { 
          console.log("checking...");
          setChecking(true);
          API.checkLoginStatus().then(result => {
            console.log(result.status);
            if(result.status === 200){
              if(result.data && result.data.token){
                console.log(result.data);
                const token = result.data.token;
                // set login token
                if(!state.validToken){
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

                if(result.data.user){
                  dispatch({
                    type: SET_FIRST_NAME,
                    firstName: result.data.user.firstName
                  })
                  dispatch({
                    type: SET_LAST_NAME,
                    lastName: result.data.user.lastName
                  })
                  dispatch({
                    type: SET_DISPLAY_NAME,
                    displayName: result.data.user.displayName
                  })
                  dispatch({
                    type: SET_EMAIL,
                    email: result.data.user.email
                  })
                  dispatch({
                    type: SET_USER_ID,
                    userID: result.data.user._id
                  })
                  dispatch({
                    type: SET_COLOR,
                    color: result.data.user.color
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
    }, [state.validToken])

    return (
        
          <Route
            {...rest}
            render={({ location }) =>
              state.validToken ? (
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