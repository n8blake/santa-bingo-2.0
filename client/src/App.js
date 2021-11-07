import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { StoreProvider } from './utils/GlobalState';
import { socket, SocketContext } from './utils/socket';
import PrivateRoute from './utils/privateRoute';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import Header from './components/Header';
import ProfilePage from "./pages/ProfilePage";
import NoMatch from "./pages/NoMatch";
import NewGamePage from "./pages/NewGame";
import GamePage from "./pages/GamePage";
import CardManagerPage from "./pages/CardManagerPage";
import './App.scss';

function App() {
  return (
    <SocketContext.Provider value={socket}>
    <StoreProvider>
      <Router>
        <Header />
        <Switch>
          <Route exact path={["/login/:token", "/login"]} children={<LoginPage />} />
          <PrivateRoute>
            <Switch>
            <Route exact path={"/"} children={<Home />} />
            <Route exact path={"/profile"} children={<ProfilePage />}/>
            <Route exact path={"/cards"} children={<CardManagerPage />}/>
            <Route exact stict path={`/game/:uuid`} >
                <GamePage />
            </Route> 
            <Route exact stict path={"/newgame/"} children={<NewGamePage />}/>
            <Route>
              <NoMatch />
            </Route>
            </Switch>
          </PrivateRoute>
          <Route>
            <NoMatch />
          </Route>
        </Switch>
      </Router>
    </StoreProvider>
    </SocketContext.Provider>
  );
}

export default App;
