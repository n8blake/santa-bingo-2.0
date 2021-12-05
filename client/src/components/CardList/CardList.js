import React, { useEffect, useState } from "react";
import Card from '../Card/Card';
import { useStoreContext } from "../../utils/GlobalState";

import './CardList.scss';

function CardList(props) {
    

    const [state] = useStoreContext();
    const [activeCardIndex, setActiveCardIndex] = useState(0); 
    const [cards, setCards] = useState([]);
    //const [marks, setMarks] = useState([]);

    const clickHandler = (event, activeCardIndexOffset) => {
        if(activeCardIndexOffset !== 0){
            handleCardIndexChange(activeCardIndexOffset);
        } else {
            if(props.clickHandler){
                props.clickHandler(event);
            }
        }
    } 

    const cardContainer = cards.map(card => {
        const cardIndex = cards.indexOf(card);
        const activeCardIndexOffset = cardIndex - activeCardIndex;
        return(
            <span className="cardWrapper advanceable" key={cards.indexOf(card)}>
                <Card interactable={props.interactable} calledNumbers={props.calledNumbers} clickHandler={(event) => clickHandler(event, activeCardIndexOffset)} data={card} marks={props.marks}/>
            </span>
        )
    })

    const cardIndexIndicator = cards.map(card => {
        const cardIndex = cards.indexOf(card);
        const activeCardIndexOffset = cardIndex - activeCardIndex;
        return(
            <span className="m-2" onClick={() => handleCardIndexChange(activeCardIndexOffset)} key={card._id}>
                {cardIndex === activeCardIndex ? (
                    <i className="bi bi-circle-fill"></i>
                ) : (
                    <i className="bi bi-circle"></i>
                )}
            </span>
        )
    })

    const handleCardIndexChange = (adv) => {
        if((adv >= 1 && activeCardIndex < cards.length - 1) || (adv <= -1 && activeCardIndex > 0)){
            setActiveCardIndex(activeCardIndex + adv);
        }
    }

    const backgroundClickHandler = (event) => {
        if(event.target.classList.contains('advanceable')){
            event.clientX / window.innerWidth > 0.5 ? handleCardIndexChange(1) : handleCardIndexChange(-1);
        }
    }

    useEffect(() => {
        if(props.cards){
            setCards(props.cards);
        }
        // if(props.marks){
        //     setMarks(props.marks)
        // }

        const cardWrappers = document.getElementsByClassName("cardWrapper");
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

    }, [props.cards, activeCardIndex])

    return (
        <div className="cardListOuterContainer advanceable" name="cardListOuterContainer" onClick={backgroundClickHandler}>    
            <div className="cardListContainer advanceable">
                {cardContainer}
                {
                    props.addNewCard ? (<span className="cardWrapper">
                    <button className="btn text-light newCardBtn" onClick={props.addNewCard}><i className="bi bi-file-plus-fill"></i></button>
                </span> ) : (<></>)
                }
                
            </div>
            <div className={`card-list-index-indicator-container advanceable ${ (state && state.inGame ? ("in-game") : (""))} `} >
                {cardIndexIndicator}
            </div>
        </div>
    )

}

export default CardList;