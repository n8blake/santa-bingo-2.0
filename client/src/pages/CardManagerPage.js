import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import { useStoreContext } from "../utils/GlobalState";
import API from "../utils/API";
import Card from '../components/Card/Card';
import useDebounce from '../utils/debounceHook';
import './CardManagerPage.scss';

function CardManagerPage(props){

    const [state, dispatch] = useStoreContext();
    const [activeCardIndex, setActiveCardIndex] = useState(0); 
    const [wheelValue, setWheelValue] = useState(0);
    const [cards, setCards] = useState([]);
    const debouncedWheelValue = useDebounce(wheelValue, 40);

    const cardTitle = ['S', 'a', 'n', 't', 'A'];

    const cardContainer = cards.map(card => {
        const cardIndex = cards.indexOf(card);
        const activeCardIndexOffset = cardIndex - activeCardIndex;
        return(
            <span className="cardWrapper" key={cards.indexOf(card)}>
                <Card clickHandler={() => handleCardIndexChange(activeCardIndexOffset)} title={cardTitle} data={card} />
            </span>
        )
    })

    const handleCardIndexChange = (adv) => {
        if((adv >= 1 && activeCardIndex < cards.length - 1) || (adv <= -1 && activeCardIndex > 0)){
            setActiveCardIndex(activeCardIndex + adv);
        }
    }

    const handleScroll = (event) => {
        //event.preventDefault();
        //console.log(event);
        setWheelValue(event.deltaX);
    }

    const fetchCards = () => {
        API.getCards(state.userID)
            .then(response => {
                console.log(response);
                if(response.data){
                    setCards(response.data);
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    const addNewCard = () => {
        const oldCardsLength = cards.length;
        API.addNewCard()
            .then(response => {
                if(response.data){
                    setCards(response.data);
                    setActiveCardIndex(oldCardsLength);
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    const deactivateCard = () => {
        const card = cards[activeCardIndex];
        if(cards.length > 1){
            API.deactivateCard(card.uuid)
            .then(response => {
                console.log(response);
                if(response.data){
                    setCards(response.data);
                    if(activeCardIndex > 0){
                        setActiveCardIndex(activeCardIndex - 1);
                    }
                } 
            })
        }
    }

    useEffect(() => {
        // componentDidMount
        window.addEventListener('wheel', handleScroll);
        // translate card to active card index slot
        const cardWrappers = document.getElementsByClassName("cardWrapper");

        if(debouncedWheelValue !== 0 && wheelValue !== 0){
            if(debouncedWheelValue > 0 && activeCardIndex < cards.length - 1){
                setActiveCardIndex(activeCardIndex + 1);
            } else if(debouncedWheelValue < 0 && activeCardIndex > 0){
                setActiveCardIndex(activeCardIndex - 1);
            }
            setWheelValue(0);
        }

        if(cardWrappers.length > 0){
            const transXp = -1 * (50 + (100 * activeCardIndex));
            for(let i = 0; i < cardWrappers.length; i++){
                if(i === activeCardIndex){
                    cardWrappers[i].style.transform = `translate(${transXp}%, 0%) scale(1.07)`;
                } else {
                    cardWrappers[i].style.transform = `translate(${transXp}%, 0%)`;
                }
            }
        }
        
        if(cards.length === 0){
            fetchCards();
        }

        return () => {
            // componentWillUnmount
            window.removeEventListener('wheel', handleScroll);
        }

    }, [activeCardIndex, cards, debouncedWheelValue, wheelValue])

    return(
        <div className="cardManagerContainer" >
            
            <div className="cardListContainer">
                {cardContainer}
                <span className="cardWrapper">
                    <button className="btn text-light newCardBtn" onClick={addNewCard}><i class="bi bi-file-plus-fill"></i></button>
                </span>
                <div className="activeCardControls">
                    { cards.length > 1 ? (
                        <button className="btn text-light activeCardControlBtn mx-2" onClick={deactivateCard}>
                            <i class="bi bi-trash"></i>
                        </button>
                    ) : (
                        <span></span>
                    )}
                    {
                        cards.length > 0 ? (
                            <Link to={`/cards/print/${cards[activeCardIndex].uuid}`} className="btn text-light activeCardControlBtn mx-2" >
                                <i class="bi bi-printer"></i>
                            </Link>
                        ) : (
                            <span></span>
                        )
                    }
                    
                </div>
            </div>
            
            <div className="cardIndexControls text-light">
                <button className="btn text-light activeCardControlBtn m-2" onClick={() => handleCardIndexChange(-1)}><i class="bi bi-arrow-left-circle-fill"></i></button>
                <button className="btn text-light activeCardControlBtn m-2" onClick={() => handleCardIndexChange(1)}><i class="bi bi-arrow-right-circle-fill"></i></button>
            </div>

        </div>
    );
}

export default CardManagerPage;