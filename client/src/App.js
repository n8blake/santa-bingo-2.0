import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { StoreProvider } from './utils/GlobalState';
import PrivateRoute from './utils/privateRoute';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import Header from './components/Header';
import ProfilePage from "./pages/ProfilePage";
import NoMatch from "./pages/NoMatch";
import NewGamePage from "./pages/NewGame";
import GamePage from "./pages/GamePage";
import './App.scss';

function App() {
  return (
    <StoreProvider>
      <Router>
        <Header />
        <Switch>
          
          <Route exact path={["/login/:token", "/login"]} children={<LoginPage />} />

          <PrivateRoute>
            <Route exact path={"/"} children={<Home />} />
            <Route exact path={"/profile"} children={<ProfilePage />}/>
            <Route exact path={"/game/new"} children={<NewGamePage />}/>
            <Route path={"/game/:uuid"} children={<GamePage />}/>
          </PrivateRoute>
          <Route>
            <NoMatch />
          </Route>
        </Switch>
      </Router>
    </StoreProvider>
  );
}

export default App;
