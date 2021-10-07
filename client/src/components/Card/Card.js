import React from 'react';
import './Card.scss'

import { useStoreContext } from '../../utils/GlobalState';

function Card(props) {

    const [state, dispatch] = useStoreContext();

    return(
        <div>Card</div>
    )
}

export default Card;