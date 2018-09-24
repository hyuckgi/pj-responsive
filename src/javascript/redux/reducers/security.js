import axios from 'axios';
import {security as type} from '../types';
import { SessionService } from '../../commons/configs/security';
import { service } from '../../commons/configs';

const initialState = SessionService.userInfo || {};

export const security = (state = initialState, action) => {
    switch(action.type)	 {
        case type.LOGIN_REQUEST:
            return {
                ...state
            }
        case type.LOGIN_SUCCESS:
            axios.defaults.headers.common['X-Auth-Token'] = service.getValue(action.payload, 'token', '');
            return {
                ...state,
                ...action.payload
            };
        case type.LOGOUT :
            axios.defaults.headers.common['X-Auth-Token'] = '';
            return {};
        default:
            return state;
    }
}
