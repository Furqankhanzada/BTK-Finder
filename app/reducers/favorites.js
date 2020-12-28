import {
    GET_FAVORITE_BUSINESSES,
} from '../constants/favorites';

//initial state.
const initialState = {
    favoriteBusinesses: [],
    loadingFavoriteBusinesses: false,
};

export default function userReducer(state = initialState, action = {}) {
    switch (action.type) {
        case GET_FAVORITE_BUSINESSES:
            return {...state, favoriteBusinesses: action.data, loadingFavoriteBusinesses: action.loading};
        default:
            return state;
    }
}
