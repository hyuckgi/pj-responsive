export const path = {
    home : '/',
    main : '/main',

    story : '/story',
    storyList : '/story/list',
    progress : '/story/list/progress',
    complete : '/story/list/complete',
    drop : '/story/list/drop',

    // List
    list : (list) => (`${list}/:type`),
    item : (list) => (`${list}/:type/:id`),
    listItem : (path, id) => (`${path}/${id}`),

    // service
    login : '/login',
    notFound : '/notFound',
    serverError : '/serverError',
};

export default {
    path
};
