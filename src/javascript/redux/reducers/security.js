import {security as type} from '../types';

export const security = (state = {}, action) => {
    switch(action.type)	 {
        case type.LOGIN_REQUEST:
            return {
                ...state
            }
        case type.LOGIN_SUCCESS:
            localStorage.setItem('token', JSON.stringify(action.payload.token));
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}
