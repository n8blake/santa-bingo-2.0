import React, { useEffect } from 'react';
import { useStoreContext } from '../../utils/GlobalState';
import API from '../../utils/API';
import { SET_CARDS } from '../../utils/actions';

import './Card.scss'


function Card(props) {

    const [state, dispatch] = useStoreContext();

    const letters = ['S', 'a', 'n', 't', 'A'];
    const tableHead = letters.map((letter) => 
        <th className="bingoCardHeader">{letter}</th>
    );

    const cards = state.cards.map((card) => {
        <tr>{card}</tr>
    });

    useEffect(() => {
        if(state.cards.length === 0 && state.userID !== ''){
            const playerID = state.userID;
            API.getCards(playerID).then(response => {
                console.log(response);
                if(response.data){
                    dispatch({
                        type: SET_CARDS,
                        cards: response.data
                    })
                } else {
                    console.log(response);
                    throw new Error("No cards returned");
                }
            }) 
            .catch(error => {
                console.log(error);
            })
        }
    }, [state.cards.length, state.userID]);

    // <tr className="bingoCardRow" ng-repeat="row in rows">
	// 			<td class="bingoCell" ng-class="{'called':(game.calledNumbers.indexOf(activeCard.card[column][row]) > -1), 'marked':(marks.indexOf(activeCard.card[column][row]) > -1)}" ng-repeat="column in columns" ng-click="mark(activeCard.card[column][row])">
	// 				<img ng-src="./SVG/{{activeCard.card[column][row]}}.svg">
	// 			</td>
	// 		</tr>

    return(
        <div>
        <table className="bingoCard">
		<thead>
			<tr >
				{tableHead}
			</tr>
		</thead>
		<tbody>	
			{ state.cards.length > 0 ? (
                state.cards.map((card) => 
                    <tr key={card}>a {card}</tr>)
            ) : (
                <tr>no card</tr>
            )}
		</tbody>
	    </table>
        <span>tabel</span>
        </div>
    )
}

export default Card;