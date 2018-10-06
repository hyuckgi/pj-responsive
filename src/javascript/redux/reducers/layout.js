import {layout as type, security as securityType} from '../types';

const list = [
    {id: '1000000', name: 'Story',  level: 0,  link:'/story', defaultLink: '/story/list/progress', idx : 2},
    {id: '1010000', name: 'Prepare', link: '/story/list/ready', level: 1, parent: '1000000'},
    {id: '1020000', name: 'Fund-raising', link: '/story/list/progress', level: 1, parent: '1000000'},
    {id: '1030000', name: 'Completion', link: '/story/list/complete', level: 1, parent: '1000000'},

    {id: '2000000', name: 'History',  level: 0, link:'/rank', idx : 3, defaultLink : '/rank/list/user'},
    {id: '2010000', name: 'Rank',  level: 1, link:'/rank/list/user', parent: '2000000'},
    {id: '2020000', name: 'Sponsor Rank',  level: 1, link:'/rank/list/sponsor', parent: '2000000'},

    {id: '3000000', name: 'Event / Notice',  level: 0, link:'/board/list', defaultLink: '/board/list/event',  idx : 4},
    {id: '3010000', name: 'Event', level: 1, link : '/board/list/event', parent: '3000000'},
    {id: '3020000', name: 'Notice', level: 1, link : '/board/list/notice', parent: '3000000'},

    {id: '4000000', name: 'More',  level: 0, link:'/service', defaultLink: '/service/cs', hasChild:true},

    {id: '4010000', name: 'Support', link : '/service/cs', defaultLink : '/service/cs/faq', level: 1,  parent: '4000000', hasChild:true},
    {id: '4010100', name: 'FAQ', link : '/service/cs/faq',  level: 2,  parent: '4010000'},
    {id: '4010200', name: 'QNA', link : '/service/cs/qna',  level: 2,  parent: '4010000'},

    {id: '4020000', name: 'Terms / Policy', level: 1, link : '/service/rules',  defaultLink : '/service/rules/terms', parent: '4000000', hasChild:true},
    {id: '4020100', name: 'Terms', level: 2, link : '/service/rules/terms', parent: '4020000'},
    {id: '4020200', name: 'Policy', level: 2, link : '/service/rules/policy', parent: '4020000'},
];

// const masterList = [
//     {id: '8000000', name: '시스템 관리', link: '/systems', level: 0, defaultLink: '/systems/version'},
//     {id: '8010000', name: '버전 관리', link: '/systems/version', level: 1, parent: '8000000'},
//     {id: '8020000', name: '화상수업 관리', link: '/systems/web-lesson', level: 1, parent: '8000000'},
//     {id: '8030000', name: 'CDN 퍼지', link: '/systems/purge', level: 1, parent: '8000000'},
//     {id: '8040000', name: '관리자 비밀번호', link: '/systems/password', level: 1, parent: '8000000'},
//
//     {id: '-1000000', name: '마이페이지', link: '/home/profile', level: 1},
// ];

const mypageMenus = [
    {id: '500000000', name: 'Mypage', link : '/mypage/list', defaultLink : '/mypage/list/support', level: 1, hasChild : true },
    {id: '501000000', name: 'Statistic', link : '/mypage/list/sponsor', level: 2, parent : '500000000', masterLevel : 3},
    {id: '502000000', name: 'Manage', link : '/mypage/list/manage', level: 2, parent : '500000000', masterLevel : 3},
    {id: '503000000', name: 'History', link : '/mypage/list/support', level: 2, parent : '500000000'},
    {id: '504000000', name: 'Story', link : '/mypage/list/story', level: 2, parent : '500000000'},
    {id: '505000000', name: 'Comment', link : '/mypage/list/comment', level: 2, parent : '500000000'},

    {id: '600000000', name: 'Setting', link : '/mypage/setting', level: 1, defaultLink : '/mypage/setting/profile', hasChild : true},
    {id: '601000000', name: 'Profile', link : '/mypage/setting/profile', level: 2, parent : '600000000'},
    {id: '602000000', name: 'Account', link : '/mypage/setting/account', level: 2, parent : '600000000'},

    {id: '700000000', name: 'ServiceManage', link : '/admin', linkTo : 'direct', level: 1, masterLevel : 1, defaultLink : 'http://admindev.9spoons.com/main'},

    {id: '900000000', name: 'Logout', link : '/logout', level: 1, linkTo : 'direct'},
];


const getMasterMenus = (level) => {
    return mypageMenus.filter((item) => !item.masterLevel || item.masterLevel >= level);
}

export const layout = (state = {list, mypageMenus}, action) => {
    switch(action.type) {
        case type.MASTER_LEVEL_1:
        case type.MASTER_LEVEL_2:
        case type.MASTER_LEVEL_3:
        case type.USER:
            return {
                ...state,
                mypageMenus : getMasterMenus(action.payload.key),
            }
        case securityType.LOGOUT:
            return {
                ...state,
                list: [...list],
                mypageMenus : [...mypageMenus]
            };
        default:
            return state;
    }
}
