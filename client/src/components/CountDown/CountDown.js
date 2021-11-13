import React, { useState, useEffect } from 'react';
import './CountDown.scss'
import useDebounce from '../../utils/debounceHook';


function CountDown(props) {

    const [timeTill, setTimeTill] = useState();
    const [dateTill, setDateTill] = useState({})
    const debouncedTime = useDebounce(timeTill, 1000);

    const dateUnitsFromMillis = function(millis){
        const second = 1000;
        const minute = (second * 60);
        const hour = (minute * 60);
        const day = (hour * 24);
        const month = (day * 30.4167);

        const monthsLeft = millis/month;
        const daysLeft = millis/day;
        const hoursLeft = 24 * ( (daysLeft) - Math.floor(daysLeft));
        const minutesLeft = 60 * (hoursLeft - Math.floor(hoursLeft));
        const secondsLeft = 60 * (minutesLeft - Math.floor(minutesLeft));

        const _date = {
            seconds: Math.floor(secondsLeft),
            minutes: Math.floor(minutesLeft),
            hours: Math.floor(hoursLeft),
            days: Math.floor(daysLeft - 30),
            months: Math.floor(monthsLeft),
        }
        setDateTill(_date);
    }

    useEffect(() => {
        setTimeTill(Math.abs(new Date() - props.unitlDate));
        dateUnitsFromMillis(debouncedTime);
    }, [props.unitlDate, debouncedTime, timeTill])

    return (
        <div className="count-down-container">
            <div className="count-down-container-fg">
                {
                    dateTill.months > 0 ? (
                        <span>
                            <span className="count-down-number">{dateTill.months}</span>
                            {
                                dateTill.months === 1 ? (
                                    <span>month ,</span>
                                ) : (
                                    <span>months ,</span>
                                )
                            } 
                        </span>
                    ) : (
                        <span></span>
                    )
                }
                {
                    dateTill.days > 0 ? (
                        <span>
                            <span className="count-down-number">{dateTill.days}</span>
                            {
                                dateTill.days === 1 ? (
                                    <span>day ,</span>
                                ) : (
                                    <span>days ,</span>
                                )
                            } 
                        </span>
                    ) : (
                        <span></span>
                    )
                } 
                {
                    dateTill.hours > 0 ? (
                        <span>
                            <span className="count-down-number">{dateTill.hours}</span>
                            {
                                dateTill.hours === 1 ? (
                                    <span>hour ,</span>
                                ) : (
                                    <span>hours ,</span>
                                )
                            } 
                        </span>
                    ) : (
                        <span></span>
                    )
                } 
                {
                    dateTill.minutes >= 0 ? (
                        <span>
                            <span className="count-down-number">{dateTill.minutes}</span>
                            {
                                dateTill.minutes === 1 ? (
                                    <span>minute ,</span>
                                ) : (
                                    <span>minutes ,</span>
                                )
                            } 
                        </span>
                    ) : (
                        <span></span>
                    )
                } 
                {
                    dateTill.seconds > -1 ? (
                        <span>
                            <span className="count-down-number">{dateTill.seconds}</span>
                            {
                                dateTill.seconds === 1 ? (
                                    <span>second until </span>
                                ) : (
                                    <span>seconds until </span>
                                )
                            } 
                        </span>
                    ) : (
                        <span></span>
                    )
                } 
                <span className="count-down-label">{props.label}</span></div>
        </div>
    )
    
}

export default CountDown;