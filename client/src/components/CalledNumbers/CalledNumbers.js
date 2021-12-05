import React, { useState, useEffect } from 'react';
import './CalledNumbers.scss';

function CalledNumbers(props) {

    const [numbers, setNumbers] = useState([]);
    const [listView, setListView] = useState(false);

    const switchView = () => {
        setListView(!listView);
    }

    const list = numbers.map(number => {
        return (
            <div className="called-numbers-list-item">
                {
                    number.number > 0 ? (
                        <img className="called-number-img" src={`/images/santa/col_${Math.floor(number.number / 15)}.svg`} alt=""/>
                    ) : (
                        <></>
                    )
                }                
                <img className="called-number-img" src={`/images/santa/${number.number}.svg`} alt=""/>
                <hr className="blue"></hr>
            </div>
        )
    })

    useEffect(() => {
        setNumbers(props.numbers);
    }, [props])

    return(
        <div className="called-numbers-container">{
                numbers && numbers.length > 0 ? (
                    <>
                    <div className={`called-number-box-blur ${listView ? ("tall") : ("")}`}>
                    <div className={`called-number-box ${listView ? ("tall") : ("")}`} onClick={switchView}>
                        {
                            numbers[numbers.length -1].number > 0 ? (
                                 listView ? (
                                    <div className="called-numbers-list">
                                        {list}
                                        <div className="called-numbers-list-item">
                                            
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <img className="called-number-img" src={`/images/santa/col_${Math.floor(numbers[numbers.length - 1 ].number / 15)}.svg`} alt=""/>
                                        <img className="called-number-img" src={`/images/santa/${numbers[numbers.length -1].number}.svg`} alt=""/>
                                    </div>
                                )
                            ) : (
                                <>
                                    <img className="called-number-img" src={`/images/santa/${numbers[numbers.length -1].number}.svg`} alt=""/>
                                </>
                            )
                        }
                        
                        
                    </div>
                    </div>
                    
                    
                    </>
                ) : (<></>)
            }    
        </div>
    )
}

export default CalledNumbers;