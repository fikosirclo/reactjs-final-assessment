import { createStore, applyMiddleware, compose } from "redux";
import reduxLogger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";

const initialState = {
    qty: 0,
    items: {},
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "CART_LIST":
            return {
                ...state,
            };

        case "CART_ADD":
            return {
                ...state,
                qty: parseInt(state.qty) + parseInt(action.qty),
                items: action.items,
            };

        case "CART_UPDATE":
            return {
                ...state,
                qty: parseInt(action.qty),
                items: action.items,
            };

        default:
            return state;
    }
};

export const initializeStore = () => {
    return createStore(reducer, composeWithDevTools(applyMiddleware(reduxLogger)));
};
