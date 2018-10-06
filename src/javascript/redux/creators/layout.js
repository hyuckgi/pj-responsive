import {layout as type} from "../types";

export const masterLevel1 = (permission) => {
    return {
        type: type.MASTER_LEVEL_1,
        payload: {...permission}
    }
};
export const masterLevel2 = (permission) => {
    return {
        type: type.MASTER_LEVEL_2,
        payload: {...permission}
    }
};
export const masterLevel3 = (permission) => {
    return {
        type: type.MASTER_LEVEL_3,
        payload: {...permission}
    }
};
export const userDefault = (permission) => {
    return {
        type: type.USER,
        payload: {...permission}
    }
};
