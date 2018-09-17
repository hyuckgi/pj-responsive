export const api = {

    // join
    join : (params = null) => ({
        url : `/api/member/join/submit`,
        params : {...params}
    }),
    checkValidate : (key, params) => ({
        url : `/api/member/validate/${key}`,
        params : {...params}
    }),
    getTerms : () => `/api/member/terms`,
    getCountry : () => `/api/member/country/code`,

    //story
    getList : (params = null, page = 1, size = 10, categoryNo = 0) => {
        if(categoryNo){
            return {
                url : `/api/story/category/${categoryNo}/page/${page}/size/${size}`,
                params : {...params}
            }
        }
        return{
            url : `/api/story/page/${page}/size/${size}`,
            params : {...params}
        }
    },
    getStory  : (id) => `/api/story/${id}`,
    postStory : (params = null) => ({
        url : `/api/story/`,
        params : {...params}
    }),

    postLike : (params = null) => ({
        url : `/api/story/like`,
        params : {...params}
    }),
    postComment : (params) => ({
        url : `/api/story/reply`,
        params : {...params}
    }),
    deleteComment : (replyNo) => `/api/story/reply/${replyNo}`,
    getComments : (storyNo, page = 1, size = 10) => `/api/story/${storyNo}/reply/page/${page}/size/${size}`,
    postReport : (params = null) => ({
        url : `/api/story/illegal`,
        params : {...params}
    }),


    // rank
    getRank : (type = 'donate', term = 'all') => `/api/${type}/ranking/summary?rank_term=${term}`,

    getRankList : ({type = 'donate', page = 1, size = 30, term = 'all'}) => `/api/${type}/ranking/page/${page}/size/${size}?rank_term=${term}`,

    getDonate : (userNo) => ({
        url : `/api/donate/activity`,
        params : {USER_NO : userNo}
    }),

    getUserHistory : ({page = 1, size = 30, year = null}) => {
        if(year){
            return `/api/donate/activity/year/${year}/page/${page}/size/${size}`;
        }
        return `/api/donate/activity/page/${page}/size/${size}`;
    },

    getMyStory :  ({page = 1, size = 10, params = null}) => ({
        url : `/api/member/story/page/${page}/size/${size}`,
        params : {...params}
    }),

    getProposeList : ({page = 1, size = 30, year = null}) => {
        if(year){
            return `/api/stroy/history/year/${year}/page/${page}/size/${size}`;
        }
        return `/api/stroy/history/page/${page}/size/${size}`;
    },
    getMyComments : ({page = 1, size = 10, params = null}) => ({
        url : `/api/member/comment/page/${page}/size/${size}`,
        params : {...params}
    }),

    // sponsor
    getSponList : ({page = 1, size = 30, year = null}) => {
        if(year){
            return `/api/sponsor/donate/year/${year}/page/${page}/size/${size}`;
        }
        return `/api/sponsor/donate/page/${page}/size/${size}`;
    },

    getADList :  ({page = 1, size = 10}) => `/api/sponsor/ad/page/${page}/size/${size}`,
    deleteAD : (adNo) => `/api/sponsor/ad/${adNo}`,

    // event & notice
    getEventList : ({status = 'going', page = 1, size = 10}) => `/api/event/status/${status}/page/${page}/size/${size}`,
    getNoticeList : ({page = 1, size = 10}) => `/api/notice/page/${page}/size/${size}`,


    // more
    getCslist : ({page = 1, size = 10}) => `/api/help/page/${page}/size/${size}`,

    //profile
    getProfile : () => `/api/profile`,

};


export default api;
