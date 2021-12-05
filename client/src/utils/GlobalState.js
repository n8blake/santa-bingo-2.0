import React, { createContext, useReducer, useContext } from "react";
import axios from "axios";
// import actions 
import { LOGIN, SET_TOKEN, SET_USER, SET_IN_GAME } from "./actions";

const StoreContext = createContext();
const { Provider } = StoreContext;

const reducer = (state, action) => {
    // switch on action type
    switch(action.type){
        case LOGIN: 
            return {
                ...state,
                loggedIn: action.login,
            }
        case SET_TOKEN:
            axios.defaults.headers.common['token'] = action.token;
            return {
                ...state,
                token: action.token
            }
        case SET_IN_GAME:
            if(action.inGame){
                const metaThemeColor = document.querySelector("meta[name=theme-color]");
                metaThemeColor.setAttribute("content", "#001704");
            } else {
                const metaThemeColor = document.querySelector("meta[name=theme-color]");
                metaThemeColor.setAttribute("content", "#150300");
            }
            return {
                ...state,
                inGame: action.inGame
            }
        case SET_USER:
            return {
                ...state,
                user: action.user
            }
        default: 
            return state;
    }
}

const StoreProvider = ({value = [], ...props}) => {
    const [state, dispatch] = useReducer(reducer, {
        loggedIn: false,
        token:"",
        user: {},
        inGame: false
    });

    return <Provider value={[state, dispatch]} {...props} />;

};

const useStoreContext = () => {
    return useContext(StoreContext);
}

export { StoreProvider, useStoreContext };
