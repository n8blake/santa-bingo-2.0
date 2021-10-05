import React, {useState, useEffect} from 'react';
import { SET_ACTIVE_BOOK, UPDATE_BOOKS } from '../../utils/actions';
import API from '../../utils/API';
import { useStoreContext } from '../../utils/GlobalState';
import './ActiveBook.scss';

function ActiveBook() {
    const [book, setBook] = useState({});
    const [bookMarkIcon, setBookMarkIcon] = useState("bi bi-bookmark-heart-fill");
	const [state, dispatch] = useStoreContext();

    useEffect(() => {
        if(state.activeBook){
            setBook(state.activeBook);
        }
    }, [state.activeBook]);
    
    const clearActiveBook = () => {
        dispatch({
			type: SET_ACTIVE_BOOK,
			activeBook: {}
		});
    }

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

    // A book looks like...
    // title: { type: String, required: true },
    // description: { type: String, required: true },
    // link: { type: String, required: true },
    // image: { type: String, required: true },
    // authors: { type: Array }

    const setFavorite = () => {
        console.log(state.activeBook);
        const book = {};
        book.title = state.activeBook.title;
        book.description = state.activeBook.description;
        book.googleBooksId = state.activeBook.id;
        book.link = state.activeBook.infoLink;
        book.image = state.activeBook.imageLinks.thumbnail;
        book.authors = state.activeBook.authors;
        book.color = state.activeBook.color;
        API.postFavorite(book).then(response => {
            console.log(response);
            API.getBooks().then(results => {
                console.log(results)
                if(results.data){
                    dispatch({
                        type: UPDATE_BOOKS,
                        books: results.data
                    })
                }
            })
        });
    }

    const removeFavorite = (_id) => {
        console.log(`Removing ${_id}`);
        API.removeFavorite(_id).then(response => {
            console.log(response);
            API.getBooks().then(results => {
                console.log(results)
                if(results.data){
                    dispatch({
                        type: UPDATE_BOOKS,
                        books: results.data
                    })
                }
            })
        });
    }

    return(
        <div>{book.title ? (
            <div className={"blurred-backdrop colored-" + book.color }>
                <div className="active-book-control-area"
                            onMouseOut={() => setBookMarkIcon("bi bi-bookmark-heart-fill")}>
                    {isFavorite(book.googleBooksId) || isFavorite(book.id) ? (
                        <button className="unmark-favorite-action" onMouseOver={() => setBookMarkIcon("bi bi-bookmark-x")} 
                            onClick={() => {
                                removeFavorite(book._id);
                                }}
                            onMouseDown={() => setBookMarkIcon("bi bi-bookmark-x-fill")}
                            onMouseUp={() => setBookMarkIcon("bi bi-bookmark-x")}
                        >
                            <i className={bookMarkIcon}></i>
                        </button>
                    ) : (
                        <button className="mark-favorite-action" onClick={() => setFavorite()}><i className="bi bi-bookmark-plus"></i></button>
                    )}
                    <button className="close-active-action" onClick={() => clearActiveBook()}><i className="bi bi-x"></i></button>
                </div>
                <div className="active-book-header">
                    {book.image ? (
                        <img className="active-book-thumbnail" alt={book.title + " Cover Art"} src={book.image}></img>
                    ) : (
                        <span></span>
                    )}
                    {book.imageLinks ? (
                        <img className="active-book-thumbnail" alt={book.title + " Cover Art"} src={book.imageLinks.thumbnail}></img>
                    ) : (
                        <span></span>
                    )}
                    <div>
                    <h1 className="active-book-title">{book.title} </h1>
                    <p className="active-book-date">{book.publishedDate ? (<span>{book.publishedDate}</span>) : (<span></span>)}</p>
                    {book.authors ? (
                        <p>
                        {book.authors.map((author,index) => {
                            if(index < book.authors.length && book.authors.length > 1){
                                author = author + ' '
                            }
                            return(
                                <span className="active-book-author" key={index}>{author} </span>
                            )
                        })}
                        </p>
                    ) : (
                        <span></span>
                    )}
                    </div>
                </div>
                <div>
                    {book.description ? (
                        <article className="active-book-description">{book.description}</article>
                    ) : (
                        <article className="active-book-description">This title has no provided description.</article>
                    )}
                </div>
            </div>
            
        ) : (
            <span></span>
        )
        }
        </div>
    )
}

export default ActiveBook;