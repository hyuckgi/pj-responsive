import {layout as creator} from "../creators";
import { values, service } from '../../commons/configs';

const permission = service.getValue(values, 'role', []);

export const layout = (role) => {
    return (dispatch) => {
        const obj = permission.filter((item) => item.key === role).find(item => item);
        return new Promise(resolve => {
            switch (obj.name) {
                case 'LEVEL1':
                    dispatch(creator.masterLevel1());
                    break;
                case 'LEVEL2':
                    dispatch(creator.masterLevel2());
                    break;
                case 'LEVEL3':
                    dispatch(creator.masterLevel3());
                    break;
                default:
                    dispatch(creator.userDefault());
                    break;
            }
            resolve();
        });
    };
};
