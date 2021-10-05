import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import FavoritesPage from "./pages/FavoritesPage";
import ActiveBook from "./components/ActiveBook/ActiveBook";
import Header from './components/Header';
import NoMatch from "./pages/NoMatch";
import { StoreProvider } from './utils/GlobalState';

import './App.scss';


function App() {
  return (
    <StoreProvider>
      <Router>
        <Header />
        <Switch>
          <Route exact path={["/", "/search"]}>
            <SearchPage />
          </Route>
          <Route exact path={["/library", "/books", "/favorites", "/loved"]}>
            <FavoritesPage />
          </Route>
          <Route>
            <NoMatch />
          </Route>
        </Switch>
      </Router>
      <ActiveBook />
    </StoreProvider>
    
  );
}

export default App;
