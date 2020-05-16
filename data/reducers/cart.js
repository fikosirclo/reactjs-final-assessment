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
