import {service} from './';
import queryString from 'query-string';

export const path = {
    baseName : '/',
    home : '/',
    main : '/main',

    story : '/story',
    storyItem : '/story/item',
    storyList : '/story/list',
    propose : '/story/propose',
    review : '/story/review',

    // recieve
    list: (prefix, params = null) => {
        return `${prefix}/:type/${service.toQuery(params)}`;
    },
    itemStory : `/story/item/:page/:id/:mode`,
    item : (prefix) => (`${prefix}/:id/:mode`),
    fullList : (prefix, params = null) => {
        return `${prefix}${service.toQuery(params)}`;
    },

    // move
    moveParams : (prefix, type, params = null) => {
        console.log("params", params);
        return `${prefix}/${type}?${queryString.stringify(params)}`
    },
    moveItem : (prefix, id, mode = 'read') => (`${prefix}/${id}/${mode}`),
    moveItemStory : (page = 'detail', id, mode = 'read') => (`/story/item/${page}/${id}/${mode}`),

    // rank
    rank : '/rank',
    rankItem : '/rank/item',
    rankList : '/rank/list',

    // board
    board : '/board',
    boardItem : '/board/item',
    boardList : '/board/list',


    // service
    service : '/service',
    serviceList : (prefix, params = null) => {
        return `${prefix}/:type/:page/:id/${service.toQuery(params)}`;
    },

    // mypage
    mypage : '/mypage',
    mypageList :  '/mypage/list',
    defaultMypageList : '/mypage/list/support',
    withdrawal : '/mypage/withdrawal',

    // setting
    setting : '/setting',


    // utils
    admin : '/admin',
    login : '/login',
    join : '/join',

    search : '/search',
    result : '/search/result',

    notFound : '/notFound',
    serverError : '/serverError',
    logout : '/logout',


};

export default {
    path
};
