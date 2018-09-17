import {layout as type, security as securityType} from '../types';

const list = [
    {id: '1000000', name: '스토리',  level: 0,  link:'/story', defaultLink: '/story/list/progress', idx : 2},
    {id: '1010000', name: '모금준비', link: '/story/list/ready', level: 1, parent: '1000000'},
    {id: '1020000', name: '모금중', link: '/story/list/progress', level: 1, parent: '1000000'},
    {id: '1030000', name: '모금완료', link: '/story/list/complete', level: 1, parent: '1000000'},

    {id: '2000000', name: '기부내역',  level: 0, link:'/rank', idx : 3, defaultLink : '/rank/list/user'},
    {id: '2010000', name: '기부 랭킹',  level: 1, link:'/rank/list/user', parent: '2000000'},
    {id: '2020000', name: '스폰서 랭킹',  level: 1, link:'/rank/list/sponsor', parent: '2000000'},

    {id: '3000000', name: '이벤트/공지',  level: 0, link:'/board/list', defaultLink: '/board/list/event',  idx : 4},
    {id: '3010000', name: '이벤트', level: 1, link : '/board/list/event', parent: '3000000'},
    {id: '3020000', name: '공지사항', level: 1, link : '/board/list/notice', parent: '3000000'},

    {id: '4000000', name: '더보기',  level: 0, link:'/service', defaultLink: '/service/cs', hasChild:true},

    {id: '4010000', name: '고객지원', link : '/service/cs', defaultLink : '/service/cs/faq', level: 1,  parent: '4000000', hasChild:true},
    {id: '4010100', name: '도움말', link : '/service/cs/faq',  level: 2,  parent: '4010000'},
    {id: '4010200', name: '문의하기', link : '/service/cs/qna',  level: 2,  parent: '4010000'},

    {id: '4020000', name: '약관 및 정책', level: 1, link : '/service/rules',  defaultLink : '/service/rules/terms', parent: '4000000', hasChild:true},
    {id: '4020100', name: '약관', level: 2, link : '/service/rules/terms', parent: '4020000'},
    {id: '4020200', name: '정책', level: 2, link : '/service/rules/policy', parent: '4020000'},
];

const masterList = [
    {id: '8000000', name: '시스템 관리', link: '/systems', level: 0, defaultLink: '/systems/version'},
    {id: '8010000', name: '버전 관리', link: '/systems/version', level: 1, parent: '8000000'},
    {id: '8020000', name: '화상수업 관리', link: '/systems/web-lesson', level: 1, parent: '8000000'},
    {id: '8030000', name: 'CDN 퍼지', link: '/systems/purge', level: 1, parent: '8000000'},
    {id: '8040000', name: '관리자 비밀번호', link: '/systems/password', level: 1, parent: '8000000'},

    {id: '-1000000', name: '마이페이지', link: '/home/profile', level: 1},
];

const mypageMenus = [
    {id: '400000000', name: '마이페이지', link : '/mypage/list', defaultLink : '/mypage/list/support', level: 1, hasChild : true },
    {id: '401000000', name: '스폰서 통계', link : '/mypage/list/sponsor', level: 2, parent : '400000000', masterLevel : 3},
    {id: '402000000', name: '광고관리', link : '/mypage/list/manage', level: 2, parent : '400000000', masterLevel : 3},
    {id: '403000000', name: '기부내역', link : '/mypage/list/support', level: 2, parent : '400000000'},
    {id: '404000000', name: '마이스토리', link : '/mypage/list/story', level: 2, parent : '400000000'},
    {id: '405000000', name: '댓글', link : '/mypage/list/comment', level: 2, parent : '400000000'},

    {id: '500000000', name: '사용자 설정', link : '/mypage/setting', level: 1, defaultLink : '/mypage/setting/profile', hasChild : true},
    {id: '501000000', name: '프로필 설정', link : '/mypage/setting/profile', level: 2, parent : '500000000'},
    {id: '502000000', name: '계좌 설정', link : '/mypage/setting/account', level: 2, parent : '500000000'},
    {id: '600000000', name: '로그아웃', link : '/logout', level: 1, },
];


export const layout = (state = {list, mypageMenus}, action) => {
    switch(action.type) {
        // case type.MASTER_LEVEL_1:
        // case type.MASTER_LEVEL_2:
        case type.MASTER_LEVEL_3:
            return {
                ...state,
                list: [...list],

            };
        case type.USER:
            return {
                ...state,
                mypageMenus : mypageMenus.filter(item => item.masterLevel !== 3),
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
