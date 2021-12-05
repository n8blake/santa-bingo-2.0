/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

const loginURL = '/api/login/';
const logoutURL = '/api/logout/';
const usersURL = '/api/users/';
const cardsURL = '/api/cards/';
const stagedCardsURL = '/api/stagedcards/';
const gameRoomsURL = '/api/gamerooms/';
const gameURL = '/api/game/';
const marksURL = '/api/marks/'

export default {
    // LOGIN AND USER APIs
    login: function(email, password){
        return axios.post(loginURL, {email, password});
    },
    refresh: function(){
        return axios.get(loginURL + 'refresh/');
    },
    checkLogin: function(){
        return axios.get(loginURL);
    },
    logout: function(){
        console.log("Logging out...");
        return axios.get(logoutURL);
    },
    checkEmail: function(email){
        return axios.post(`${loginURL}check/`, {email});
    },
    newUser: function(user){
        return axios.post(`${loginURL}new/`, user);
    },
    updateUser: function(user, id){
        return axios.patch(`${usersURL}${id}`, user);
    },
    //CARDS APIs
    getCards: function(userId){
        let url = cardsURL;
        if(userId){
            url = url + `?player=${userId}`
        }
        return axios.get(url);
    },
    getCard: function(cardId){
        return axios.get(`${cardsURL}${cardId}`);
    },
    getCardsByIds: function(cards){
        //console.log('getting cards from api...')
        //console.log(cards);
        return axios.post(`${cardsURL}`, {cards})
    },
    deactivateCard: function(cardId){
        return axios.patch(`${cardsURL}${cardId}`, {active: false});
    },
    getStagedCards: function(gameRoomId, playerId){
        const _stagedCardsURL = `${stagedCardsURL}?gameroom=${gameRoomId}&player=${playerId}`;
        return axios.get(_stagedCardsURL);
    },
    // GAME ROOM APIs
    getGameRooms: function(){
        return axios.get(gameRoomsURL);
    },
    getRoomsByNotPlayers: function(notPlayers){
        return axios.post(`${gameRoomsURL}players/`, {notPlayers});
    },
    getRoomsByPlayers: function(players){
        return axios.post(`${gameRoomsURL}players/`, {players});
    },
    getGameRoom: function(id){
        return axios.get(`${gameRoomsURL}${id}`)
    },
    createNewGameRoom: function(roomName){
        return axios.post(gameRoomsURL, {roomName});
    },
    joinGameRoom: function(roomId, playerId){
        return axios.put(`${gameRoomsURL}${roomId}/${playerId}`, {})
    },
    leaveGameRoom: function(roomId, playerId){
        return axios.delete(`${gameRoomsURL}${roomId}/${playerId}`, {}) 
    },
    updateGameRoom: function(roomId, update){
        return axios.patch(`${gameRoomsURL}${roomId}`, update)
    },
    // GAME APIs
    getGame: function(gameId){
        return axios.get(`${gameURL}${gameId}`)
    },
    startGame: function(gameRoom){
        return axios.post(`${gameURL}new/`, {gameRoom})
    },
    endGame: function(gameId, gameRoom){
        return axios.put(`${gameURL}${gameId}/end/`, {gameRoom});
    },
    callNextNumber: function(gameId){
        return axios.get(`${gameURL}${gameId}/nextnumber/`)
    },
    markCard: function(game, card, player, number){
        return axios.post(marksURL, {game, card, player, number})
    },
    getMarks: function(game, player, cards){
        return axios.get(marksURL, {game, player, cards})
    },
    removeMark: function(mark){
        return axios.delete(`${marksURL}${mark}`)
    }
};