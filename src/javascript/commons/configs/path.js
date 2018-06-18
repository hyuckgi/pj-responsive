export const path = {
    baseName : '/html',
    home : '/',
    main : '/main',

    story : '/story',
    storyList : '/story/list',
    progress : '/story/list/progress/0',
    complete : '/story/list/complete/0',
    ready : '/story/list/ready/0',
    propose : '/story/propose',

    // List
    // recieve
    list : (path) => (`${path}/:type/:categoryNo`),
    item : (path) => (`${path}/:id`),

    // move
    moveList : (path, type, categoryNo = 0) => (`${path}/${type}/${categoryNo}`),
    moveItem : (path, id) => (`${path}/${id}`),

    // service
    login : '/login',
    join : '/join',
    notFound : '/notFound',
    serverError : '/serverError',
};

export default {
    path
};
