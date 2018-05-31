import {security as creator}  from '../creators';
import {SecurityService} from '../../commons/configs/security';


export const login = (params) => {
    return (dispatch, getState) => {
        // 로그인 시작
        dispatch(creator.loginRequest());
        return SecurityService.login(params)
            .then(data => {
                dispatch(creator.loginSuccess(data));
                return data;
            })
    };
};
