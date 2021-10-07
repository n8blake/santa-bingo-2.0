/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

export default {
    login: function(email){
        console.log("Loging in with: " + email);
        const loginURL = '/api/login/';
        const payload = {email}
        return axios.post(loginURL, payload);
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
    }
};