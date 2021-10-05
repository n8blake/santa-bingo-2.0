import React, { useEffect, useState } from "react";
import { useStoreContext } from "../../utils/GlobalState";
import useDebounce from "../../utils/debounceHook";
import { SEARCH, UPDATE_SEARCH_RESULTS } from '../../utils/actions';
import API from "../../utils/API";
import './style.scss';

function SearchControls() {

    const [state, dispatch] = useStoreContext();
    const [search, setSearch] = useState("");
    const [searchBoxHeight, setSearchBoxHeight] = useState("1");

    const debouncedSearchTerm = useDebounce(search, 500);

    const handleInputChange = event => {
        const searchTerm = event.target.value;
        setSearch(event.target.value);
        const maxLineLength = 17;
        if(searchTerm.length / maxLineLength > 1){
            //console.log(Math.round(searchTerm.length / 10));
            //console.log(searchTerm.length / 10);
            setSearchBoxHeight(Math.round(searchTerm.length / maxLineLength));
        } else {
            setSearchBoxHeight(1);
        }
    }

    useEffect(() => {
        // if there is nothing searched...
        if(!search){
            dispatch({
                type: SEARCH,
                searchTerm: ""
            });
            dispatch({
                type: UPDATE_SEARCH_RESULTS,
                searchResults: state.books
            });
            return;
        }

        if(debouncedSearchTerm){
            // set global search term
            dispatch({
                type: SEARCH,
                searchTerm: debouncedSearchTerm
            });
            //console.log(`Starting search...`);
            API.search(state.searchTerm)
                .then(results => {
                    //console.log("Searched!");
                    console.log(results.status);
                    if(results.data){
                        dispatch({
                            type: UPDATE_SEARCH_RESULTS,
                            searchResults: results.data
                        });
                    }
                    
                });

        }
    }, [debouncedSearchTerm, dispatch, search, state.books, state.searchTerm]);

    return (
        <div id="search-controls-container-bg">    
            <div id="search-controls-container-w">
                <div className="search-wrapper">
                    <i id="search-icon" className="bi bi-search mr-4"></i>
                    <textarea rows={searchBoxHeight} id="google-books-search-input" type="text" onChange={handleInputChange} ></textarea>
                </div>
            </div>
        </div>
    );

}

export default SearchControls;