import React from 'react';
import './Card.scss'

function Card(props) {

    const tableHead = props.title.map((letter) => 
        <th className="bingoCardHeader">{letter}</th>
    );

    const rows = [0, 1, 2, 3, 4];
    const cells = rows.map((row) => {
        return (<tr className="bingoCardRow">
            <td className="bingoCell">
                <img src={`/images/santa/${props.cells.column_0[row]}.svg`} alt="" />
            </td>
            <td className="bingoCell">
                <img src={`/images/santa/${props.cells.column_1[row]}.svg`} alt="" />
            </td>
            <td className="bingoCell">
                <img src={`/images/santa/${props.cells.column_2[row]}.svg`} alt="" />
            </td>
            <td className="bingoCell">
                <img src={`/images/santa/${props.cells.column_3[row]}.svg`} alt="" />
            </td>
            <td className="bingoCell">
                <img src={`/images/santa/${props.cells.column_4[row]}.svg`} alt="" />
            </td>
        </tr>)
    });

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