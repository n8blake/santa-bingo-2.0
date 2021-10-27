/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

export default {
    login: function(email, name){
        console.log("Loging in with: " + email);
        const loginURL = '/api/login/';
        const payload = {
            email: email,
            name: name
        }
        return axios.post(loginURL, payload);
    },
    logout: function(){
        console.log("Logging out...");
        const logoutURL = '/api/logout/';
        return axios.get(logoutURL);
    },
    validateToken: function(token){
        console.log("validating token...");
        const validateTokenURL = '/api/login/validate';
        const payload = {token}
        return axios.post(validateTokenURL, payload);
    },
    checkLoginStatus: function(){
        console.log("Checking login status");
        const loginURL = '/api/login/';
        return axios.get(loginURL);
    },
    getProfileData: function(token){
        console.log(token);
        const profileDataURL = '/api/users/me/';
        return axios.get(profileDataURL);
    },
    updateProfileData: function(profile){
        console.log(profile);
        const profileDataURL = '/api/users/me/';
        return axios.post(profileDataURL, profile);
    },
    createProfileData: function(profile){
        console.log(profile);
        const profileDataURL = '/api/users/me/';
        return axios.put(profileDataURL, profile);
    },
    getCards: function(playerID){
        console.log(playerID);
        const cardsURL = '/api/cards/player/'
        const data = {id: playerID}
        return axios.post(cardsURL, data);
    },
    getGames: function(){
        const gamesURL = '/api/game/list/'
        return axios.get(gamesURL);
    },
    getGame: function(id){
        const gameURL = `/api/game/${id}`;
        return axios.get(gameURL);
    },
    createNewGame: function(name){
        const game = {
            gameName: name
        }
        const newGameURL = '/api/game/new/';
        return axios.post(newGameURL, game);
    }
};