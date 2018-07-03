import {security as type} from '../types';
import { SessionService } from '../../commons/configs/security';

const initialState = SessionService.userInfo || {}

export const security = (state = initialState, action) => {
    switch(action.type)	 {
        case type.LOGIN_REQUEST:
            return {
                ...state
            }
        case type.LOGIN_SUCCESS:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}
