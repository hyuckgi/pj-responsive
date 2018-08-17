import { APICaller } from '../../api';
import { api } from './'

export default class SecurityService {

    static login(params) {
        return APICaller.post(api.login(), params)
            .then(({data}) => {
                if(data.result_code === 200){
                    return {
                        token : data.token,
                        countryCode : data.countryCode,
                        role : data.role,
                        resultCode : data.resultCode,
                    }
                }
                return;
            });
    }
}
