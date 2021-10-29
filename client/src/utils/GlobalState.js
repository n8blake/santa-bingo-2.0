import React, { createContext, useReducer, useContext } from "react";
// import actions 
import { LOGIN, SET_TOKEN, VALIDATE_TOKEN, SET_EMAIL, SET_DISPLAY_NAME, SET_FIRST_NAME, SET_LAST_NAME, SET_USER_ID, SET_COLOR, SET_CARDS, SET_USER, SET_IN_GAME } from "./actions";

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
            return {
                ...state,
                token: action.token
            }
        case VALIDATE_TOKEN: 
            return {
                ...state,
                validToken: action.isValid
            }
        case SET_EMAIL:
            return {
                ...state,
                email: action.email
            }
        case SET_DISPLAY_NAME:
            return {
                ...state,
                displayName: action.displayName
            }
        case SET_FIRST_NAME:
            return {
                ...state,
                firstName: action.firstName
            }
        case SET_LAST_NAME:
            return {
                ...state,
                lastName: action.lastName
        }
        case SET_USER_ID:
            return {
                ...state,
                userID: action.userID
        }
        case SET_COLOR:
            return {
                ...state,
                color: action.color
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
        validToken:false,
        user: {},
        firstName:"",
        lastName:"",
        displayName:"",
        email: "",
        userID: "",
        color: "",
        inGame: false
    });

    return <Provider value={[state, dispatch]} {...props} />;

};

const useStoreContext = () => {
    return useContext(StoreContext);
}

export { StoreProvider, useStoreContext };
