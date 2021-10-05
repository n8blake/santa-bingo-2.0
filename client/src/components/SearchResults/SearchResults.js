import React, {useState, useEffect} from 'react';
import { SET_ACTIVE_BOOK } from '../../utils/actions';
import API from '../../utils/API';
import { useStoreContext } from '../../utils/GlobalState';
import './SearchResults.scss';
import FastAverageColor from 'fast-average-color';
import Shelf from '../Shelf/Shelf';
import Book from '../Book/Book';

function SearchResults(){
	const fac = new FastAverageColor();
	const [state, dispatch] = useStoreContext();
	const [shelves, setShelves] = useState();
	
	const sortBooks = async (books) => {
		//const colors = ['red', 'orange', 'yellow', 'cyan', 'green', 'blue', 'purple', 'brown'];
		const shelves = [];
		// the incoming books into groups of 5
		// put them on a shelf
		const numShelves = Math.ceil(books.length / 5);
		let bookIndex = 0;
		for(let shelfIndex = 0; shelfIndex < numShelves; shelfIndex++){
			const shelf = [];
			for(let bookOnShelfIndex = 0; 
				(bookOnShelfIndex < 10 && bookIndex < books.length); 
				bookOnShelfIndex++){
					shelf.push(books[bookIndex]);
					if(books[bookIndex].volumeInfo){
						const book = books[bookIndex].volumeInfo;
						if(book.imageLinks){
							const bookImageURL = books[bookIndex].volumeInfo.imageLinks.thumbnail;
							await API.getBookColor(bookImageURL).then(result => {
								console.log(result);
								book.color = result.data;
							});
						} else {
							book.color = 'red';
						}
						//const colorIndex = Math.floor(Math.random() * (colors.length - 1));
						//books[bookIndex].volumeInfo.color = colors[colorIndex];
					}
					bookIndex++;
			}
			shelves.push(shelf);
		}
		setShelves(shelves);
	}

	const setActiveBook = (book) => {
		console.log(book);
		dispatch({
			type: SET_ACTIVE_BOOK,
			activeBook: book
		});
	}

	useEffect(() => {
		if(state.searchResults){
			if(state.searchResults.items){
				sortBooks(state.searchResults.items)
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[state.searchResults]);

	return(
		<div className="container" id="search-results-container">
			
			{ shelves ? (
				<div key={1}>
					{shelves.map((shelf, index) => {
						return (
						<Shelf key={index} index={shelves.indexOf(shelf)}>
							{shelf.map((item, item_index) => {
								const book = item.volumeInfo;
								book.id = item.id;
								return (
									<Book key={item_index} index={'book-key' + item.id} book={book} action={setActiveBook}></Book>
								)
							})}
						</Shelf>
						)
					})
					}
				</div>
			) : (
				<div>no results</div>
			)}
			
		</div>
	);
}

export default SearchResults;
