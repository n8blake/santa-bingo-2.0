import React, { useEffect } from 'react';
// import { useStoreContext } from '../../utils/GlobalState';
// import API from '../../utils/API';
// import { SET_CARDS } from '../../utils/actions';
//import zero from '../../assets/SVG/0.svg';
import './Card.scss'
import Icon from '../Icon/Icon';

function Card(props) {

    //const [state, dispatch] = useStoreContext();

    const tableHead = props.title.map((letter) => 
        <th className="bingoCardHeader">{letter}</th>
    );

    const rows = [0, 1, 2, 3, 4];
    const cells = rows.map((row) => {
        return (<tr className="bingoCardRow">
            <td class="bingoCell">
                <img src={`/images/santa/${props.cells.column_0[row]}.svg`} alt="" />
            </td>
            <td class="bingoCell">
            <img src={`/images/santa/${props.cells.column_1[row]}.svg`} alt="" />
            </td>
            <td class="bingoCell">
            <img src={`/images/santa/${props.cells.column_2[row]}.svg`} alt="" />
            </td>
            <td class="bingoCell">
            <img src={`/images/santa/${props.cells.column_3[row]}.svg`} alt="" />
            </td>
            <td class="bingoCell">
            <img src={`/images/santa/${props.cells.column_4[row]}.svg`} alt="" />
            </td>
        </tr>)
    });

    // useEffect(() => {

    // }, []);

    // <tr className="bingoCardRow" ng-repeat="row in rows">
	// 			<td class="bingoCell" ng-class="{'called':(game.calledNumbers.indexOf(activeCard.card[column][row]) > -1), 'marked':(marks.indexOf(activeCard.card[column][row]) > -1)}" ng-repeat="column in columns" ng-click="mark(activeCard.card[column][row])">
	// 				<img ng-src="./SVG/{{activeCard.card[column][row]}}.svg">
	// 			</td>
	// 		</tr>

    return(
        <div className="bingoCardContainer">
            <table className="bingoCard">
                <thead>
                    <tr >
                        {tableHead}
                    </tr>
                </thead>
                <tbody>	
                    {cells}
                </tbody>
            </table>
        </div>
    )
}

export default Card;