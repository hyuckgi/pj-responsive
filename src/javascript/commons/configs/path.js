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
    list : (list) => (`${list}/:type`),
    item : (list) => (`${list}/:type/:id`),
    listItem : (path, id) => (`${path}/${id}`),

    // service
    login : '/login',
    join : '/join',
    notFound : '/notFound',
    serverError : '/serverError',
};

export default {
    path
};
