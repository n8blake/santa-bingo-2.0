import React, { useState, useEffect } from 'react';
import './CalledCards.scss';

function CalledCards(props) {

    const [numbers, setNumbers] = useState([]);
    const [listView, setListView] = useState(false);

    const switchView = () => {
        setListView(!listView);
    }

    useEffect(() => {
        if(props.numbers != numbers){
            setNumbers(props.numbers);
        }

    }, [props, listView])

    const numberToLetter = (number) => {
        //console.log(number);
        // 01 - 15 S
        if (number >= 0 && number <= 15){
            return ('S');
        }
        // 16 - 30 a
        else if (number >= 16 && number <= 30){
            return ('a');
        }
        // 31 - 45 n
        else if (number >= 31 && number <= 45){
            return ('n');
        }
        // 46 - 60 t
        else if (number >= 46 && number <= 60){
            return ('t');
        }
        // 61 - 75 A
        else if (number >= 61 && number <= 75){
            return ('A');
        } else {
            return ('');
        }
    }

    const lastCardLg = (
        <div className="d-flex justify-content-center">
            <div className="called-card called-card-lg">
                <img className="CalledCardImg" src={`/images/santa/${numbers[numbers.length - 1]}.svg`} alt="" />
                <span className="called-card-letter called-card-letter-lg">{numberToLetter(numbers[numbers.length - 1])}</span>
                <span className="called-card-control-icon" onClick={switchView}><i className="bi bi-view-list"></i></span>
            </div>
        </div>
    )

    const cardList = numbers.map(number => {
        const letter = numberToLetter(number);
        //console.log(number);
        //console.log(letter);
        return (
            number === 0 ? (
                <li className="list-group-item called-cards-list-item d-flex justify-content-center" key={number}>
                    <img className="called-card-image-list-free" src={`/images/santa/${number}.svg`} alt="" />
                </li>
            ) : (
                <li className="list-group-item called-cards-list-item d-flex justify-content-between" key={number}>
                    <div className="called-card-letter called-card-letter-list">{letter}</div>
                    <img className="called-card-image-list" src={`/images/santa/${number}.svg`} alt="" />
                </li>
            )
        )
    })

    return(
        listView ? (
            <div className="d-flex justify-content-center">
                <div className="called-cards-list-container">
                    <ul className="list-group called-card-list-group">{cardList}</ul>
                </div>
                <span className="called-card-control-icon-list" onClick={switchView}><i className="bi bi-square-fill"></i></span>
            </div>
        ) : (
            <div className="">{lastCardLg}</div>
        )
    )
}

export default CalledCards;