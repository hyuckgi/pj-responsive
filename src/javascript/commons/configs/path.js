import {service} from './';

export const path = {
    baseName : '/',
    home : '/',
    main : '/main',

    story : '/story',
    storyItem : '/story/item',
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
    rankItem : '/rank/item',
    rankList : '/rank/list',

    // board
    board : '/board',
    boardItem : '/board/item',
    boardList : '/board/list',


    // service
    service : '/service',

    // mypage
    mypage : '/mypage',
    mypageList :  '/mypage/list',
    setting : '/mypage/setting',

    // utils
    login : '/login',
    join : '/join',
    search : '/search',
    notFound : '/notFound',
    serverError : '/serverError',
    logout : '/logout',
    withdrawal : '/withdrawal',

};

export default {
    path
};
