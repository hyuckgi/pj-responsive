export const path = {
    baseName : '/html',
    home : '/',
    main : '/main',

    story : '/story',
    storyList : '/story/list',
    progress : '/story/list/progress',
    complete : '/story/list/complete',
    ready : '/story/list/ready',
    propose : '/story/propose',

    // List
    // recieve
    list : (basePath) => (`${basePath}/:type`),
    item : (basePath) => (`${basePath}/:id`),

    // move
    moveList : (basePath, type) => (`${basePath}/${type}`),
    moveCate : (basePath, type, categoryNo = 0) => (`${basePath}/${type}?category=${categoryNo}`),
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
