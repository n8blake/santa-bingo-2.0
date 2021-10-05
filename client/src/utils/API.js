/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

export default {
    // Get all employees
    search: function(queryString){
        const searchURL = 'https://www.googleapis.com/books/v1/volumes?q=' + queryString;
        //console.log(`Getting ${queryString}`)
        return axios.get(searchURL);
    },
    // Get books from our own api
    getBooks: function(bookObj){
        let getBooksURL = '/api/books/';
        if(bookObj){
            // modify url to get book url
        }
        return axios.get(getBooksURL);
    },
    // post a new favorite
    postFavorite: function(bookObj){
        console.log("posting");
        const booksURL = '/api/books/';
        return axios.post(booksURL, bookObj);
    },
    // remove a favorite
    removeFavorite: function(id){
        console.log("Removing");
        const bookURL = '/api/books/' + id;
        return axios.delete(bookURL);
    },
    // get a color for a book
    getBookColor: function(url){
        const requestBody = {url: url}
        const colorURL = '/api/color/';
        return axios.post(colorURL, requestBody);
    }
};