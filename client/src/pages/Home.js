import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { useStoreContext } from "../utils/GlobalState";
import Card from '../components/Card/Card';
import './Home.scss';

function Home(){
    
    const [state, dispatch] = useStoreContext();

    return(
        <div className="container">
            {
                !state.validToken ? (
                    <Redirect to="/login" />
                ) : (
                    <Card />
                )
            }
            
        </div>
    )

}

export default Home;