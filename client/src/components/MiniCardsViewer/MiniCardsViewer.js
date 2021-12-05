import React from "react";
import { Link } from "react-router-dom";
import Card from '../Card/Card';

import './MiniCardsViewer.scss';

function MiniCardsViewer(props){
    
    //<Card title={props.cardTitle} data={card} />
    const cardsList = props.cards.map(card => {
        return(
            <Link to={'/cards/'} className="card-wrapper" key={card._id}>
                <Card title={props.cardTitle} data={card} thumbnail="true"/>
            </Link>
        )
    })

    return(
        <div className="mini-card-viewer">
            {cardsList}
        </div>
    )
}

export default MiniCardsViewer;