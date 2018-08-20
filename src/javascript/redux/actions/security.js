import { security as creator }  from '../creators';
import { SecurityService, SessionService } from '../../commons/configs/security';


export const login = (params) => {
    return (dispatch, getState) => {
        // 로그인 시작
        dispatch(creator.loginRequest());
        return SecurityService.login(params)
            .then(data => {
                if(data){
                    dispatch(creator.loginSuccess(data));
                    SessionService.login(getState().security);
                }
            })
    };
};


export const logout = () => {
    return (dispatch) => {
        dispatch(creator.logout());
        SessionService.logout();
    };
}
