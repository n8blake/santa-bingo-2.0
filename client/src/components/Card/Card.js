import React, { useState, useEffect } from 'react';
import './Card.scss'

function Card(props) {

    const [interactable, setInteractable] = useState(false);
    const [thumbnail, setThumbnail] = useState(false);
    const tableHead = props.title.map((letter) => 
        <th className={`bingoCardHeader ${thumbnail ? "bingo-header-thumb" : ""}`} key={letter}>{letter}</th>
    );

    function cellInteractableDynamicClass() {
        if(interactable){
            return "bingoCell bingoCellInteractable"
        } else {
            return "bingoCell"
        }
    }

    const rows = [0, 1, 2, 3, 4];
    const cells = rows.map((row) => {
        return (<tr className="bingoCardRow" key={row}>
            <td className={`bingoCell ${interactable ? "bingoCellInteractable" : ""}`}>
                <img className={`${thumbnail ? "bingo-img-thumb" : ""}`} src={`/images/santa/${props.data.column_0[row]}.svg`} alt="" />
            </td>
            <td className={`bingoCell ${interactable ? "bingoCellInteractable" : ""}`}>
                <img className={`${thumbnail ? "bingo-img-thumb" : ""}`} src={`/images/santa/${props.data.column_1[row]}.svg`} alt="" />
            </td>
            <td className={`bingoCell ${interactable ? "bingoCellInteractable" : ""}`}>
                <img className={`${thumbnail ? "bingo-img-thumb" : ""}`} src={`/images/santa/${props.data.column_2[row]}.svg`} alt="" />
            </td>
            <td className={`bingoCell ${interactable ? "bingoCellInteractable" : ""}`}>
                <img className={`${thumbnail ? "bingo-img-thumb" : ""}`} src={`/images/santa/${props.data.column_3[row]}.svg`} alt="" />
            </td>
            <td className={`bingoCell ${interactable ? "bingoCellInteractable" : ""}`}>
                <img className={`${thumbnail ? "bingo-img-thumb" : ""}`} src={`/images/santa/${props.data.column_4[row]}.svg`} alt="" />
            </td>
        </tr>)
    });

    useEffect(() => {
        if(props.interactable){
            setInteractable(true);
        }
        if(props.thumbnail){
            setThumbnail(true);
        }
    }, [props])

    return(
        <div className={`bingoCardContainer ${thumbnail ? "bingo-card-thumb" : ""}`} onClick={props.clickHandler}>
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