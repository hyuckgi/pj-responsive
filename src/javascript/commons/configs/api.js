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

    // category

    //list
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






    getAuth : (params = null) => ({
        url : `/account/auths/`,
        params : {...params}
    }),
    getActor : (id=null, params = null) => ({
        url : `/account/actors/${id}`,
        params : {...params}
    }),
    getBoard : (boardType, params = null) => ({
        url : `/board/board_types/${boardType}/get_named/`,
        params : {...params}
    }),
    getPostList : (boardId, params = null) => ({
        url : `/board/boards/${boardId}/posts/`,
        params : {status__ne : 2, ...params}
    }),
    getPost : (postId, params = null) => ({
        url : `/board/posts/${postId}/`,
        params : {...params}
    }),
    getIssue : (issueId, params = null) => ({
        url : `/issue/issues/${issueId}/`,
        params : {...params}
    }),
    completeWork : (workId, params=null) => ({
        url : `/issue/works/${workId}/complete/`,
        params : {...params}
    }),

    modifyIssue : (issueId, params = null) => ({
        url : `/issue/issues/${issueId}/modify/`,
        params : {...params}
    }),


    //휴대폰 인증번호 발송
    sendOneTimePassword : (params = null) => ({
        url : `/account/auths/send_sms_onetime_password/`,
        params : {...params}
    }),

	//인증번호 체크
    checkOneTimePassword : (params = null) => ({
        url : `/account/auths/check_mdn/`,
        params : {...params}
    }),

    // Family Group Actor 조회 / 생성
    getFamilyActor : (actorId) => (`/account/actors/${actorId}/get_or_create_family/`),
    getTagName : (tag, params=null) => ({
        url : `/aux/tag_types/${tag}/`,
        params : {...params}
    }),
    getMembers : (actorId, params=null) => ({
        url : `/account/actors/${actorId}/members/`,
        params : {...params}
    }),

    modifyAuth : (authId, params=null) => ({
        url : `/account/auths/${authId}/modify/`,
        params : {...params}
    }),
    modifyActor : (actorId, params=null) => ({
        url : `/account/actors/${actorId}/modify/`,
        params : {...params}
    }),
    addStudent : (familyId, params=null) => ({
        url : `/account/actors/${familyId}/add_student_member/`,
        params : {...params}
    }),
    setStudent : (familyId, params=null) => ({
        url : `/account/actors/${familyId}/set_student_member/`,
        params : {...params}
    }),
    addExperience : (studentId, params=null) => ({
        url : `/account/actors/${studentId}/experience_application/`,
        params : {...params}
    }),









    getStudents : (params=null) => ({
        url:`/account/actors/`,
        params : {modelType :1, ...params}
    }),
    getParent : (params = null) => ({
        url : `/account/actors/`,
        params : {modelType :2, ...params}
    }),


    getDeviceMapping : (params = null) => ({
        url : `/item/items/temporary_device_mapping/`,
        params : {...params}
    }),
};


export default api;
