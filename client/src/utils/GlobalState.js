import React, { createContext, useReducer, useContext } from "react";
// import actions 
import { LOGIN, LOADING, SET_TOKEN, VALIDATE_TOKEN, SET_EMAIL } from "./actions";

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
        case LOADING: 
            return {
                ...state,
                loading: true
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
        userName:"",
        email: "",
        loading: false
    });

    return <Provider value={[state, dispatch]} {...props} />;

};

const useStoreContext = () => {
    return useContext(StoreContext);
}

export { StoreProvider, useStoreContext };
