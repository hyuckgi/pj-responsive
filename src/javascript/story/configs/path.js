import { path as globalPath } from '../../commons/configs';

export const path = {
    list : (type = null) => (`${globalPath.list}/${type}`),
    item : () => (`${globalPath.list}/:type/:id`),
    story : (type, id) => {
        return `${globalPath.list}/${type}/${id}`
    }
}


export default path;
