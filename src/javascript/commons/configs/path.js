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
    list : (basePath) => (`${basePath}/:type/:categoryNo`),
    item : (basePath) => (`${basePath}/:id`),

    // move
    moveList : (basePath, type, categoryNo = 0) => (`${basePath}/${type}/${categoryNo}`),
    moveItem : (basePath, id) => (`${basePath}/${id}`),

    // service
    login : '/login',
    join : '/join',
    notFound : '/notFound',
    serverError : '/serverError',
};

export default {
    path
};
