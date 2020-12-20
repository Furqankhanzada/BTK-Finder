import {GET_FAVORITE_BUSINESSES, LOAD_MORE_FAVORITE_BUSINESSES} from "../constants/favorites";
import axiosApiInstance from "../interceptor/axios-interceptor";
import {BUSINESSES_API} from "../constants";
import {handleError} from "../utils";

const encodeQueryData = (data) => {
    const ret = [];
    for (const d in data) {
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    }
    return ret.join('&');
};


const updateData = (array, idsArray) => {
    return array.filter(el => idsArray.includes(el._id));
};

export const getFavoriteBusinesses = (payload) => (dispatch, getState)  => {
    const { businesses } = getState();
    const { favoriteIds } = businesses;
    let dispatchType = GET_FAVORITE_BUSINESSES;
    let queryParams = encodeQueryData(payload) ? `?${encodeQueryData(payload)}` : '';

    if(payload?.skip > 0) dispatchType = LOAD_MORE_FAVORITE_BUSINESSES;

    dispatch({
        type: dispatchType,
        loading: true,
        loadMoreLoading: true,
        data: []
    });

    axiosApiInstance({method: 'GET', url: `${BUSINESSES_API}${queryParams}`})
        .then((response) => {
            dispatch({
                type: dispatchType,
                loading: false,
                loadMoreLoading: false,
                data: updateData(response.data, favoriteIds),
                isLoadMore: !(response.data && response.data.length < 10)
            });
        })
        .catch(({response}) => {
            dispatch({ type: dispatchType, loading: false, loadMoreLoading: false,  data: [] });
            handleError(response.data);
        });
};
