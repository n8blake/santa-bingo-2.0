import React from 'react';
import './Book.scss';
import './book-colors.scss';

import { useStoreContext } from "../../utils/GlobalState";

function Book(props) {

    const [state, dispatch] = useStoreContext();

    const isFavorite = (id) => {
        let isFavorite = false;
        if(state.books){
            state.books.forEach(book => {
                if(book.googleBooksId){
                    if(book.googleBooksId === id) isFavorite = true;
                } 
            })
        }
        return isFavorite;
    }

    return (
        <div key={props.index} onClick={() => props.action(props.book)} className={'book book-' + props.book.color} data-item-id={props.id}>
            
            <div className="book-spine-content-container">
            <div className="book-favorite-indicator-container">
                {isFavorite(props.book.googleBooksId) || isFavorite(props.book.id)  ? (<i className="bi bi-bookmark-heart-fill"></i>) :
                (
                    <span></span>
                )}
            </div>
            <div className="book-title-container">
            {props.book.title ? (
                <span>
                    <div className="book-title">
                        {props.book.title}
                    </div>
                    {props.book.title.length < 20 ? (
                        <div className="variable-width-spacer-s"></div>
                    ) : (
                        props.book.title.length < 40 ? (
                            <div className="variable-width-spacer-m"></div>
                        ) : (
                            <div className="variable-width-spacer-l"></div>
                        )   
                    )}
                </span>
            ) : (
                <div></div>
            )}
            </div>
            
            
            <div className="book-author">
                <hr></hr>
                {
                    props.book.authors ? (
                        props.book.authors.map((author, index) => {
                            return (
                            <div key={index}>
                                <small>{author}</small>
                            </div>
                            )
                        })
                    ) : (
                        <small>unknown</small>
                    )
                }
                
            </div>
            </div>
        </div>
    )

}

export default Book;