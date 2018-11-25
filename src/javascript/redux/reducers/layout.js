import {layout as type, security as securityType} from '../types';

// // TODO:  defaultLink progress로 수정

const list = [

    {id: '10000', name: '아동',  level: 0,  link:'/story/list/children', defaultLink: '/story/list/children/ready', idx : 1, mobile : true},
    {id: '10100', name: 'Prepare', link: '/story/list/children/ready', level: 1, parent: '10000'},
    {id: '10200', name: 'Fund-raising', link: '/story/list/children/progress', level: 1, parent: '10000'},
    {id: '10300', name: 'Completion', link: '/story/list/children/complete', level: 1, parent: '10000'},

    {id: '20000', name: '난치병',  level: 0,  link:'/story/list/disease', defaultLink: '/story/list/disease/progress', idx : 2, mobile : true},
    {id: '20100', name: 'Prepare', link: '/story/list/disease/ready', level: 1, parent: '20000'},
    {id: '20200', name: 'Fund-raising', link: '/story/list/disease/progress', level: 1, parent: '20000'},
    {id: '20300', name: 'Completion', link: '/story/list/disease/complete', level: 1, parent: '20000'},

    {id: '30000', name: '저소득층',  level: 0,  link: '/story/list/group', defaultLink: '/story/list/group/progress', idx : 3, mobile : true},
    {id: '30100', name: 'Prepare', link: '/story/list/group/ready', level: 1, parent: '30000'},
    {id: '30200', name: 'Fund-raising', link: '/story/list/group/progress', level: 1, parent: '30000'},
    {id: '30300', name: 'Completion', link: '/story/list/group/complete', level: 1, parent: '30000'},

    {id: '40000', name: '교육지원',  level: 0,  link:'/story/list/education', defaultLink: '/story/list/education/ready', idx : 4, mobile : true},
    {id: '40100', name: 'Prepare', link: '/story/list/education/ready', level: 1, parent: '40000'},
    {id: '40200', name: 'Fund-raising', link: '/story/list/education/progress', level: 1, parent: '40000'},
    {id: '40300', name: 'Completion', link: '/story/list/education/complete', level: 1, parent: '40000'},

    {id: '50000', name: '재난',  level: 0,  link:'/story/list/disaster', defaultLink: '/story/list/disaster/progress', idx : 5, mobile : true},
    {id: '50100', name: 'Prepare', link: '/story/list/disaster/ready', level: 1, parent: '50000'},
    {id: '50200', name: 'Fund-raising', link: '/story/list/disaster/progress', level: 1, parent: '50000'},
    {id: '50300', name: 'Completion', link: '/story/list/disaster/complete', level: 1, parent: '50000'},

    {id: '60000', name: '캠페인',  level: 0,  link: '/story/list/campaign', defaultLink: '/story/list/campaign/complete', idx : 6, mobile : true},
    {id: '60100', name: 'Prepare', link: '/story/list/campaign/ready', level: 1, parent: '60000'},
    {id: '60200', name: 'Fund-raising', link: '/story/list/campaign/progress', level: 1, parent: '60000'},
    {id: '60300', name: 'Completion', link: '/story/list/campaign/complete', level: 1, parent: '60000'},

    {id: '70000', name: 'Rank',  level: 0, link:'/rank', defaultLink : '/rank/list/user', idx : 7, mobile : true},
    {id: '70100', name: 'User Rank',  level: 1, link:'/rank/list/user', parent: '70000'},
    {id: '70200', name: 'Sponsor Rank',  level: 1, link:'/rank/list/sponsor', parent: '70000'},

    {id: '4000000', name: 'More',  level: 0, link:'/service', defaultLink: '/service/cs', hasChild:true},

    {id: '4010000', name: 'Support', link : '/service/cs', defaultLink : '/service/cs/faq', level: 1,  parent: '4000000', hasChild:true},
    {id: '4010100', name: 'FAQ', link : '/service/cs/faq',  level: 2,  parent: '4010000'},
    {id: '4010200', name: 'QNA', link : '/service/cs/qna',  level: 2,  parent: '4010000'},

    {id: '4020000', name: 'Terms / Policy', level: 1, link : '/service/rules',  defaultLink : '/service/rules/terms', parent: '4000000', hasChild:true},
    {id: '4020100', name: 'Terms', level: 2, link : '/service/rules/terms', parent: '4020000'},
    {id: '4020200', name: 'Policy', level: 2, link : '/service/rules/policy', parent: '4020000'},

    {id: '4040000', name: '9Spoons',  level: 1, link:'/service/company', defaultLink: '/service/company/intro',  hasChild:true, parent: '4000000',},
    {id: '4040100', name: '9Spoons 소개', level: 2, link : '/service/company/intro', parent: '4040000'},
    {id: '4040200', name: '9Spoons 정신', level: 2, link : '/service/company/spirit', parent: '4040000'},

    {id: '4050000', name: '투명성',  level: 1, link:'/service/integrity', defaultLink: '/service/integrity',  parent: '4000000',},

    {id: '4060000', name: '자체 기부 & 봉사 내역',  level: 1, link:'/service/charity', defaultLink: '/service/charity',  parent: '4000000',},

    {id: '4070000', name: 'Event / Notice',  level: 1, link:'/board/list', defaultLink: '/board/list/event',  hasChild:true, parent: '4000000',},
    {id: '4070100', name: 'Event', level: 2, link : '/board/list/event', parent: '4070000'},
    {id: '4070200', name: 'Notice', level: 2, link : '/board/list/notice', parent: '4070000'},

];

const mypageMenus = [
    {id: '500000000', name: 'Mypage', link : '/mypage/list', defaultLink : '/mypage/list/support', level: 1, hasChild : true },
    {id: '501000000', name: 'Statistic', link : '/mypage/list/sponsor', level: 2, parent : '500000000', masterLevel : 3},
    {id: '502000000', name: 'Manage', link : '/mypage/list/manage', level: 2, parent : '500000000', masterLevel : 3},
    {id: '503000000', name: 'History', link : '/mypage/list/support', level: 2, parent : '500000000'},
    {id: '504000000', name: 'Story', link : '/mypage/list/story', level: 2, parent : '500000000'},
    {id: '505000000', name: 'Comment', link : '/mypage/list/comment', level: 2, parent : '500000000'},

    {id: '600000000', name: 'Setting', link : '/setting', level: 1, defaultLink : '/setting/profile', hasChild : true},
    {id: '601000000', name: 'Profile', link : '/setting/profile', level: 2, parent : '600000000', descript : '수정하려는 항목의 열쇠를 누른 후 수정하세요.'},
    {id: '602000000', name: 'Account', link : '/setting/account', level: 2, parent : '600000000', descript : '자주 쓰는 계좌는 최대 5개까지만 등록됩니다.'},

    {id: '700000000', name: 'ServiceManage', link : '/admin', linkTo : 'direct', level: 1, masterLevel : 1, defaultLink : 'http://admindev.9spoons.com/main'},

    {id: '900000000', name: 'Logout', link : '/logout', level: 1, linkTo : 'direct'},
];

const serviceMenu = [
    {id : '1000', name : 'Join', link : '/join', level: 1},
    {id : '2000', name : 'Login', link : '/login', level: 1},
    {id : '3000', name : 'Search', link : '/search', level: 1},
    {id : '4000', name : 'Withdrawal', link : '/withdrawal', level: 1},
]


const getMasterMenus = (level) => {
    return mypageMenus.filter((item) => !item.masterLevel || item.masterLevel >= level);
}

export const layout = (state = {list, mypageMenus, serviceMenu}, action) => {
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
