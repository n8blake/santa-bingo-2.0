import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect, render } from "react-router-dom";
import { useStoreContext } from './GlobalState';

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
    const [state, dispatch] = useStoreContext();
    
    return (
      <Route
        {...rest}
        render={({ location }) =>
          state.validToken ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

export default PrivateRoute;