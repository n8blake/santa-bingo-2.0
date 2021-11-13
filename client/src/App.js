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
import CountDown from "./components/CountDown/CountDown";
import './App.scss';

function App() {
  return (
    <SocketContext.Provider value={socket}>
    <StoreProvider>
      <Router>
        <Header />
        <Switch>
          <Route>
            <div className="container">
              <div className="d-flex justify-content-center m-4">
                Santa Bingo is coming...
              </div>
              <div className="d-flex justify-content-center m-4">
                <CountDown label="Christmas" unitlDate={new Date('2021-12-25T00:00:00')} />
              </div>
            </div>
          </Route>
          
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
