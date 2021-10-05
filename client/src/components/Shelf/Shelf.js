import React, {useState, useEffect} from 'react';

import './Shelf.scss';

function Shelf(props) {
    //const [books, setBooks] = useState([]);
    // <hr className="shelf-base" />
    return(
        <div className="shelf" key={props.index}>
            <div key={'sc-' + props.index} className="books-on-shelf-container">{props.children}</div>
            
        </div>
        
    );

}

export default Shelf;