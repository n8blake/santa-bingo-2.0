/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

const loginURL = '/api/login/';
const logoutURL = '/api/logout/';
const usersURL = '/api/users/';

export default {
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
    }
};