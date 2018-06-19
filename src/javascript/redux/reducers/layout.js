import {layout as type, security as securityType} from '../types';

const list = [
    {id: '1000000', name: '윙크소개',  level: 0,  link:'/story', defaultLink: '/story/list/progress', idx : 2},
    {id: '1010000', name: '연령별 학습', link: '/story/list/ready', level: 1, parent: '1000000'},
    {id: '1020000', name: '윙크 한눈에 보기', link: '/story/list/progress', level: 1, parent: '1000000'},
    {id: '1030000', name: '과목별 학습', link: '/story/list/complete', level: 1, parent: '1000000'},

    {id: '2000000', name: '우리아이 현황',  level: 0, link:'/mykids', idx : 3, defaultLink : '/mykids/abc'},
    {id: '2010000', name: '우리아이 현황1',  level: 1, link:'/mykids/abc', parent: '2000000'},


    {id: '3000000', name: '우리아이 선생님',  level: 0, link:'/teacher', defaultLink: '/teacher/kor',  idx : 4, hasChild:true},
    {id: '3010000', name: '한글·수학', level: 1, link : '/teacher/kor', parent: '3000000'},
    {id: '3020000', name: '영어', level: 1, link : '/teacher/en', parent: '3000000'},

    {id: '4000000', name: '육아·교육마당',  level: 0, link:'/info', defaultLink: '/info/main',  idx : 5, hasChild:true},
    {id: '4010000', name: '육아·교육백과', link : '/info/main',  level: 1,  parent: '4000000'},
    {id: '4020000', name: '언론보도', level: 1, link : '/info/press', parent: '4000000'},

    {id: '5000000', name: '고객센터',  level: 0, link:'/cs', defaultLink: '/cs/notice', idx : 6, hasChild:true},
    {id: '5010000', name: '공지사항', link : '/cs/notice',  level: 1,  parent: '5000000'},
    {id: '5020000', name: '이벤트', level: 1, link : '/cs/event', parent: '5000000'},
    {id: '5030000', name: '자주하는 질문', level: 1, link : '/cs/faq', parent: '5000000'},
    {id: '5040000', name: '신고·건의·문의', level: 1, link : '/cs/qa', parent: '5000000'},
    {id: '5050000', name: '앱 다운로드', level: 1, link : '/cs/download', parent: '5000000'},
    {id: '5060000', name: '선생님 지원', level: 1, link : '/cs/recruit', parent: '5000000'},
];

const footerList = [
    {id: '100000000', name: '1:1실시간 상담', link : 'https://api.happytalk.io/api/kakao/chat_open?yid=%40winkedu&site_id=4000000177&category_id=64405&division_id=64406', level: 0 },
    {id: '200000000', name: '무료학습 알아보기', link : '/experience', level: 0 },
    {id: '300000000', name: '합리적 비용의 학습 신청', link : '/apply', level: 0 },
];

const service = [
    {id: '400000000', name: '상세보기', link : '/boards', level: 0 },
    {id: '500000000', name: '무료학습 신청하기', link : '/request', level: 0 },
    {id: '600000000', name: '무료학습 신청완료', link : '/complete', level: 0 },
    {id: '700000000', name: '회사소개', link : '/company', level: 0 },
]

const masterList = [
    {id: '8000000', name: '시스템 관리', link: '/systems', level: 0, defaultLink: '/systems/version'},
    {id: '8010000', name: '버전 관리', link: '/systems/version', level: 1, parent: '8000000'},
    {id: '8020000', name: '화상수업 관리', link: '/systems/web-lesson', level: 1, parent: '8000000'},
    {id: '8030000', name: 'CDN 퍼지', link: '/systems/purge', level: 1, parent: '8000000'},
    {id: '8040000', name: '관리자 비밀번호', link: '/systems/password', level: 1, parent: '8000000'},

    {id: '-1000000', name: '마이페이지', link: '/home/profile', level: 1},
];

export const layout = (state = {list, footerList, service}, action) => {

    switch(action.type) {
        case type.MASTER_LEVEL_1:
        case type.MASTER_LEVEL_2:
        case type.MASTER_LEVEL_3:
            return {
                ...state,
                list: [masterList]
            };
        case securityType.LOGOUT:
            return {
                ...state,
                list: [...list]
            };
        default:
            return state;
    }
}
