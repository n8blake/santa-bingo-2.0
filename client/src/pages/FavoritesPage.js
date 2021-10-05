import React, {useState, useEffect} from 'react';
import { useStoreContext } from "../utils/GlobalState";
import API from "../utils/API";

import Shelf from '../components/Shelf/Shelf';
import Book from '../components/Book/Book';

import './FavoritesPage.scss';
import { UPDATE_BOOKS, SET_ACTIVE_BOOK } from '../utils/actions';

function SearchPage() {

    const [state, dispatch] = useStoreContext();

    useEffect(() => {
        // get books from API
        API.getBooks().then(results => {
            console.log(results)
            if(results.data){
                dispatch({
                    type: UPDATE_BOOKS,
                    books: results.data
                })
            }
        })
    }, [])

    const setActiveBook = (book) => {
		console.log(book);
		dispatch({
			type: SET_ACTIVE_BOOK,
			activeBook: book
		});
	}
//<Book key={book.id} book={book} action={setActiveBook}></Book>
    return (
        <div className="container text-center">
            { state.books ? (
                <Shelf>
                    {state.books.map(book => {
                        
                        if(!book.color){
                            book.color = 'blue';
                        }
                        
                        return (<Book key={book._id} book={book} action={setActiveBook}></Book>)
                    })}
                </Shelf>
            ) : (
                <div className="text-center">No Favorites</div>
            )}
        </div>
    )
}

export default SearchPage;