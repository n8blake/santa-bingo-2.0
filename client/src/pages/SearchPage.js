import React from 'react';
import SearchControls from '../components/SearchControls/'
import SearchResults from '../components/SearchResults/SearchResults';
import './SearchPage.scss';

function SearchPage() {
    return (
        <>
            <SearchControls />
            <SearchResults />
        </>
    )
}

export default SearchPage;