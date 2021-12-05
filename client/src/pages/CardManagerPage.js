import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStoreContext } from "../utils/GlobalState";
import API from "../utils/API";
import Card from '../components/Card/Card';
import CardList from "../components/CardList/CardList";
import './CardManagerPage.scss';

function CardManagerPage(props){

    const [state] = useStoreContext();
    const [activeCardIndex, setActiveCardIndex] = useState(0); 
    const [cards, setCards] = useState([]);

    const fetchCards = (index) => {
        console.log(state.user);
        API.getCards(state.user._id)
            .then(response => {
                console.log(response);
                if(response.data){
                    setCards(response.data);
                    if(index){
                        setActiveCardIndex(index);
                    }
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    const addNewCard = () => {
        const oldCardsLength = cards.length;
        API.getCard("new")
            .then(response => {
                if(response.data){
                    fetchCards(oldCardsLength);
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    const deactivateCard = () => {
        const card = cards[activeCardIndex];
        if(cards.length > 1){
            API.deactivateCard(card._id)
            .then(response => {
                //console.log(response);
                if(response.data){
                    if(activeCardIndex > 0){
                        fetchCards(activeCardIndex - 1);
                    } else {
                        fetchCards();
                    }
                } 
            })
        }
    }

    useEffect(() => {
        // componentDidMount
        if(cards.length === 0){
            fetchCards();
        }
        return () => {
            // componentWillUnmount
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cards, state.user])

    return(
        <>
        <CardList clickHandler={(event) => {}} cards={cards} addNewCard={addNewCard} />
        <div className="activeCardControls">
            { cards.length > 1 ? (
                <button className="btn text-light activeCardControlBtn mx-2" onClick={deactivateCard}>
                    <i className="bi bi-trash"></i>
                </button>
            ) : (
                <span></span>
            )}
            {
                cards.length > 0 && cards[activeCardIndex] ? (
                    <Link to={`/card/print/${cards[activeCardIndex]._id}`} className="btn text-light activeCardControlBtn mx-2" >
                        <i className="bi bi-printer"></i>
                    </Link>
                ) : (
                    <span></span>
                )
            }  
        </div>
        </>
    );
}

export default CardManagerPage;