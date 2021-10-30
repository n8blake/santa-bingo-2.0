import React, { useEffect, useState, useContext, useCallback } from "react";
import { useStoreContext } from "../utils/GlobalState";
import API from "../utils/API";
import Card from '../components/Card/Card';
import useDebounce from '../utils/debounceHook';
import './CardManagerPage.scss';

function CardManagerPage(props){

    const [activeCardIndex, setActiveCardIndex] = useState(0); 
    const [wheelValue, setWheelValue] = useState(0);
    const debouncedWheelValue = useDebounce(wheelValue, 35);

    const cardTitle = ['S', 'a', 'n', 't', 'A'];
    const cells = {
        column_0: [2, 1, 9, 11, 3],
        column_1: [16, 17, 29, 21, 30],
        column_2: [42, 41, 0, 31, 32],
        column_3: [52, 51, 49, 48, 53],
        column_4: [72, 71, 69, 65, 63],
    }

    const cards = [1, 2, 3, 4];

    const cardContainer = cards.map(card => {
        return(
            <Card title={cardTitle} cells={cells} />
        )
    })

    const handleCardIndexChange = (adv) => {
        if((adv === 1 && activeCardIndex < cards.length - 1) || (adv === -1 && activeCardIndex > 0)){
            setActiveCardIndex(activeCardIndex + adv);
        }
    }

    const handleScroll = (event) => {
        event.preventDefault();
        //console.log(event);
        setWheelValue(event.deltaX);
    }

    useEffect(() => {
        // componentDidMount
        window.addEventListener('wheel', handleScroll);
        // translate card to active card index slot
        //document.getElementById("myDIV").style.transform = "rotate(7deg)";
        const cardWrappers = document.getElementsByClassName("cardWrapper");
        //console.log(cardWrappers);

        if(debouncedWheelValue !== 0 && wheelValue !== 0){
            if(debouncedWheelValue > 0 && activeCardIndex < cards.length - 1){
                setActiveCardIndex(activeCardIndex + 1);
            } else if(debouncedWheelValue < 0 && activeCardIndex > 0){
                setActiveCardIndex(activeCardIndex - 1);
            }
            setWheelValue(0);
        }

        if(cardWrappers.length > 0){
            //console.log(cardWrappers[0])
            //cardWrappers[0].style.transform = "translate(-150%, 0%)"
            const transXp = -1 * (50 + (100 * activeCardIndex));
            //console.log(transXp);
            for(let i = 0; i < cardWrappers.length; i++){
                if(i === activeCardIndex){
                    cardWrappers[i].style.transform = `translate(${transXp}%, 0%) scale(1.07)`;
                } else {
                    cardWrappers[i].style.transform = `translate(${transXp}%, 0%)`;
                }
            }
        }
        
        return () => {
            // componentWillUnmount
            window.removeEventListener('wheel', handleScroll);
        }

    }, [activeCardIndex, cards.length, debouncedWheelValue])

    return(
        <div className="cardManagerContainer" >
            
            <div className="cardListContainer">
                <span className="cardWrapper">
                    <Card title={cardTitle} cells={cells} />
                </span>
                <span className="cardWrapper">
                    <Card title={cardTitle} cells={cells} />
                </span>
                <span className="cardWrapper">
                    <Card title={cardTitle} cells={cells} />
                </span>
                <span className="cardWrapper">
                    <Card title={cardTitle} cells={cells} />
                </span>
            </div>
            <div className="cardIndexControls text-light">
                <button className="btn btn-sm btn-light m-2" onClick={() => handleCardIndexChange(-1)}>back</button>
                <button className="btn btn-sm btn-light m-2" onClick={() => handleCardIndexChange(1)}>next</button>
            </div>

        </div>
    );
}

export default CardManagerPage;