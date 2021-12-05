import React, { useState, useEffect } from 'react';
import './Card.scss'

function Card(props) {

    const [interactable, setInteractable] = useState(false);
    const [thumbnail, setThumbnail] = useState(false);
    const [marks, setMarks] = useState([]);
    const [markNumbers, setMarkNumbers] = useState([]);
    const [calledNumbers, setCalledNumbers] = useState([])
    const cols = [0, 1, 2, 3, 4];
    const rows = [0, 1, 2, 3, 4];

    const tableHead = cols.map((col) => 
        <th className={`bingoCardHeader ${thumbnail ? "bingo-header-thumb" : ""}`} key={col}>
            <img className={`${thumbnail ? "bingo-img-thumb" : ""}`} src={`/images/santa/col_${col}.svg`} alt="" />
        </th>
    );

    const cellClickInterceptor = (event, col, row, num) => {
        if(num > -1){
            event.col = col;
            event.row = row;
            event.number = num;
            event.card = props.data;
            if(markNumbers.indexOf(num) > -1){
                event.mark = marks.find(mark => {
                    console.log(mark.number);
                    console.log(num);
                   return mark.number === num;
                });
            }
        }
        if(props.clickHandler){
            props.clickHandler(event);
        }
    }


    const cells = rows.map((row) => {
        return (<tr className="bingoCardRow" key={row}>
            <td className={`bingoCell ${interactable ? "bingoCellInteractable" : ""}  
                ${calledNumbers.indexOf(props.data.column_0[row]) > -1 ? "called" : ""}
                ${markNumbers.indexOf(props.data.column_0[row]) > -1 ? "marked" : ""}
            `} >
                <img className={`${thumbnail ? "bingo-img-thumb" : ""}`} src={`/images/santa/${props.data.column_0[row]}.svg`} alt="" 
                onClick={(event) => cellClickInterceptor(event, 0, row, props.data.column_0[row])} />
            </td>
            <td className={`bingoCell ${interactable ? "bingoCellInteractable" : ""}  
                ${calledNumbers.indexOf(props.data.column_1[row]) > -1 ? "called" : ""} 
                ${markNumbers.indexOf(props.data.column_1[row]) > -1 ? "marked" : ""} `}>
                <img className={`${thumbnail ? "bingo-img-thumb" : ""}`} src={`/images/santa/${props.data.column_1[row]}.svg`} alt="" 
                onClick={(event) => cellClickInterceptor(event, 1, row, props.data.column_1[row])} />
            </td>
            <td className={`bingoCell ${interactable ? "bingoCellInteractable" : ""}  
                ${calledNumbers.indexOf(props.data.column_2[row]) > -1 ? "called" : ""}
                ${markNumbers.indexOf(props.data.column_2[row]) > -1 ? "marked" : ""} `}>
                <img className={`${thumbnail ? "bingo-img-thumb" : ""}`} src={`/images/santa/${props.data.column_2[row]}.svg`} alt="" 
                onClick={(event) => cellClickInterceptor(event, 2, row, props.data.column_2[row])} />
            </td>
            <td className={`bingoCell ${interactable ? "bingoCellInteractable" : ""}  
                ${calledNumbers.indexOf(props.data.column_3[row]) > -1 ? "called" : ""}
                ${markNumbers.indexOf(props.data.column_3[row]) > -1 ? "marked" : ""} `}>
                <img className={`${thumbnail ? "bingo-img-thumb" : ""}`} src={`/images/santa/${props.data.column_3[row]}.svg`} alt="" 
                onClick={(event) => cellClickInterceptor(event, 3, row, props.data.column_3[row])} />
            </td>
            <td className={`bingoCell ${interactable ? "bingoCellInteractable" : ""}  
                ${calledNumbers.indexOf(props.data.column_4[row]) > -1 ? "called" : ""}
                ${markNumbers.indexOf(props.data.column_4[row]) > -1 ? "marked" : ""}`}>
                <img className={`${thumbnail ? "bingo-img-thumb" : ""}`} src={`/images/santa/${props.data.column_4[row]}.svg`} alt="" 
                onClick={(event) => cellClickInterceptor(event, 4, row, props.data.column_4[row])} />
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
        if(props.marks && props.marks.length > 0){
            const _marks = props.marks.filter(mark => mark.card === props.data._id);
            if(_marks.length > 0){
                const numbers = _marks.map(mark => mark.number)
                setMarkNumbers(numbers);
            }
            setMarks(_marks);
        }
        if(props.calledNumbers){
            const numbers = props.calledNumbers.map(calledNumberObject => {
                return calledNumberObject.number;
            })
            setCalledNumbers(numbers);
        }
    }, [props])

    return(
        <div className={`bingoCardContainer ${thumbnail ? "bingo-card-thumb" : ""}`} onClick={cellClickInterceptor}>
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