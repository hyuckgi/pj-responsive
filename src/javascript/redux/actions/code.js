import {code as creator}  from '../creators';
import { APICaller } from '../../commons/api';

export const tag = (cookies) => {
    return (dispatch) => {
        const list = [
            {id : 'categories', url : '/api/category/list', params : {}},
        ];
        return APICaller.all(list.map(item => APICaller.get(item.url, item.params)))
            .then(docs => {
                const result = docs || {};
                const data = Object.keys(result).reduce((result, key) => {
                    result[list[key].id] = docs[key].data || null;
                    return result;
                }, {});
                dispatch(creator.code(data));
            })
            .then(docs => dispatch(creator.codeEnd()));
    };
};
