import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { StoreProvider, useStoreContext } from './utils/GlobalState';
import PrivateRoute from './utils/privateRoute';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import Header from './components/Header';
import ProfilePage from "./pages/ProfilePage";
import NoMatch from "./pages/NoMatch";
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
