import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { useStoreContext } from "../utils/GlobalState";
import Card from '../components/Card/Card';
import './Home.scss';

function Home(){
    
    const [state, dispatch] = useStoreContext();

    const cardTitle = ['S', 'a', 'n', 't', 'A'];
    const cells = {
        column_0: [2, 1, 9, 11, 3],
        column_1: [16, 17, 29, 21, 30],
        column_2: [42, 41, 0, 31, 32],
        column_3: [52, 51, 49, 48, 53],
        column_4: [72, 71, 69, 65, 63],
    }

    return(
        <div className="container">
            <Card title={cardTitle} cells={cells} />
        </div>
    )

}

export default Home;