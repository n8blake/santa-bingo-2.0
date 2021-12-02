import React, { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import Card from '../components/Card/Card';

import API from '../utils/API';

import './PrintCardPage.scss';

function PrintCardPage(props) {

    const cardTitle = ['S', 'a', 'n', 't', 'A'];
    const [card, setCard] = useState();
    const { id } = useParams();

    useEffect(() => {
        if(!card){
            API.getCard(id).then(response => {
                if(response.data){
                    setCard(response.data);
                    window.print();
                }
            })
            .catch(error => {
                console.log(error)
            })
        }
    }, [])

    return (
        
            card ? (
                <Card title={cardTitle} data={card}/>
            ) : (
                <span>Loading card...</span>
            )
        
    )
}

export default PrintCardPage;