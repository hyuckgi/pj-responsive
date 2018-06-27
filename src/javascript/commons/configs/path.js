import {service} from './';

export const path = {
    baseName : '/html',
    home : '/',
    main : '/main',

    story : '/story',
    storyitem : '/story/item',
    storyList : '/story/list',
    propose : '/story/propose',

    // recieve
    list: (prefix, params = null) => {
        return `${prefix}/:type/${service.toQuery(params)}`;
    },
    item : (prefix) => (`${prefix}/:id/:mode`),

    // move
    moveCate : (prefix, type, categoryNo = 0) => (`${prefix}/${type}?category=${categoryNo}`),
    moveItem : (prefix, id, mode = 'read') => (`${prefix}/${id}/${mode}`),

    // rank
    rank : '/rank',
    userRank : '/rank/user',
    sponsorRank : '/rank/sponsor',


    // service
    login : '/login',
    join : '/join',
    notFound : '/notFound',
    serverError : '/serverError',
};

export default {
    path
};
