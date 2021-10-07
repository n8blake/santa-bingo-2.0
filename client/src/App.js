import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { StoreProvider, useStoreContext } from './utils/GlobalState';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import Header from './components/Header';
import NoMatch from "./pages/NoMatch";
import './App.scss';


function App() {
  return (
    <StoreProvider>
      <Router>
        <Header />
        <Switch>
          <Route exact path={"/"} children={<Home />} />
          <Route exact path={["/login/:token", "/login"]} children={<LoginPage />} />
          <Route>
            <NoMatch />
          </Route>
        </Switch>
      </Router>
    </StoreProvider>
  );
}

export default App;
