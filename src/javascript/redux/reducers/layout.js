import {layout as type, security as securityType} from '../types';

const list = [
    {id: '9000000', name: '업무', link: '/works', level: 0, defaultLink: '/works/todo'},
    {id: '9010000', name: '나의업무', link: '/works/todo', level: 1, parent: '9000000'},
    {id: '9020000', name: '팀업무', link: '/works/teamTodo', level: 1, parent: '9000000'},

    {id: '1000000', name: '회원관리', link: '/members', level: 0, defaultLink: '/members/member/students'},
    {id: '1010000', name: '서비스회원', level: 1, parent: '1000000'},
    // {id: '1010100', name: '학생회원', link: '/members/member/students', level: 2, parent: '1010000'},
    {id: '1010100', name: '학생회원', link: '/members/member/students', level: 2, parent: '1010000'},
    {id: '1010200', name: '학부모회원', link: '/members/member/parents', level: 2, parent: '1010000'},
    {id: '1020000', name: '관리자', link: '/members/admin', level: 1, parent: '1000000'},

    {id: '2000000', name: '교사관리', link: '/teachers', level: 0, defaultLink: '/teachers/organization/manage/teacher'},
    {id: '2010000', name: '인사/조직 관리', level: 1, parent: '2000000'},
    {id: '2010100', name: '팀/교사 관리', link: '/teachers/organization/manage', level: 2, parent: '2010000', defaultLink: '/teachers/organization/manage/teacher'},
    {id: '2010200', name: '윙크폰 및 사용자 관리', link: '/teachers/organization/phone', level: 2, parent: '2010000', defaultLink: '/teachers/organization/phone/readyPhone'},
    {id: '2010300', name: '교사 목표치 설정', link: '/teachers/organization/goal', level: 2, parent: '2010000'},
    {id: '2010400', name: '팀 평가', link: '/teachers/organization/rating', level: 2, parent: '2010000'},
    // {id: '2010500', name: '워크플래너 등록', link: '/teachers/organization/planner', level: 2, parent: '2010000'},
    {id: '2010600', name: '팀 게시판 관리', link: '/teachers/organization/board', level: 2, parent: '2010000', defaultLink: '/teachers/organization/board/team'},
    // {id: '2020000', name: '승인', level: 1, parent: '2000000'},
    // {id: '2020100', name: '팀장 승인 확인', link: '/teachers/approval/confirm', level: 2, parent: '2020000'},
    {id: '2030000', name: '수수료 관리', level: 1, parent: '2000000'},
    {id: '2030100', name: '윙크교사 수수료 입력', link: '/teachers/commission/base-teacher-fees', level: 2, parent: '2030000'},
    {id: '2030200', name: '팀장 수수료 입력', link: '/teachers/commission/base-leader-fees', level: 2, parent: '2030000'},
    {id: '2030300', name: '윙크교사 수수료 조회/수정', link: '/teachers/commission/teachers-fees', level: 2, parent: '2030000'},
    {id: '2030400', name: '팀장 수수료 조회/수정', link: '/teachers/commission/leaders-fees', level: 2, parent: '2030000'},
    {id: '2040000', name: '문의/요청', link: '/teachers/request', level: 1, parent: '2000000'},

    {id: '5000000', name: '콘텐츠(LCMS)관리', link: '/lcms', level: 0, defaultLink: '/lcms/curriculum/오늘의공부'},
    {id: '5010000', name: '커리큘럼 관리', link: '/lcms/curriculum', level: 1, parent: '5000000', defaultLink: '/lcms/curriculum/오늘의공부'},
    {id: '5020000', name: '콘텐츠 리소스 관리', link: '/lcms/contents', level: 1, parent: '5000000', defaultLink: '/lcms/contents/Service'},
    {id: '5030000', name: '콘텐츠 검수/배포', link: '/lcms/distribution', level: 1, parent: '5000000', defaultLink: '/lcms/distribution'},
    // {id: '5040000', name: '순차학습 순서관리', link: '/lcms/sequence', level: 1, parent: '5000000'},
    // {id: '5050000', name: '보상관리', link: '/lcms/benefits', level: 1, parent: '5000000'},
    {id: '5060000', name: '교재/교보재 관리', link: '/lcms/material', level: 1, parent: '5000000'},

    {id: '6000000', name: '서비스(운영)관리', link: '/services', level: 0, defaultLink: '/services/students/main'},
    {id: '6010000', name: '학생', level: 1, parent: '6000000'},
    {id: '6010100', name: '메인관리', link: '/services/students/main', level: 2, parent: '6010000'},
    {id: '6010200', name: '학습기 설정', link: '/services/students/winkbot', level: 2, parent: '6010000'},
    {id: '6010300', name: '이벤트 관리', link: '/services/students/event', level: 2, parent: '6010000'},
    {id: '6020000', name: '학무보',  level: 1, parent: '6000000'},
    {id: '6020100', name: '메인관리', link: '/services/parents/main', level: 2, parent: '6020000'},
    {id: '6020200', name: '게시글 관리', link: '/services/parents/board', level: 2, parent: '6020000', defaultLink: '/services/parents/board/notice'},
    {id: '6020250', name: '육아교육백과', link: '/services/parents/dictionary', level: 2, parent: '6020000', defaultLink: '/services/parents/dictionary/recommend'},
    {id: '6020300', name: '이벤트 관리', link: '/services/parents/event', level: 2, parent: '6020000'},
    {id: '6020400', name: '선생님지원관리', link: '/services/parents/teacher', level: 2, parent: '6020000'},
    {id: '6020500', name: '특별회원관리', link: '/services/parents/special', level: 2, parent: '6020000'},
    {id: '6030000', name: '공통관리',  level: 1, parent: '6000000'},
    {id: '6030100', name: '문의관리', link: '/services/common/inquire', level: 2, parent: '6030000'},
    {id: '6030200', name: '설문관리', link: '/services/common/survey', level: 2, parent: '6030000'},
    {id: '6030300', name: '알림관리', link: '/services/common/notice', level: 2, parent: '6030000'},

    {id: '7000000', name: '마케팅 관리', link: '/marketing', level: 0, defaultLink: '/marketing/coupon'},
    {id: '7010000', name: '쿠폰 관리', link: '/marketing/coupon', level: 1, parent: '7000000'},

    {id: '8000000', name: '시스템 관리', link: '/systems', level: 0, defaultLink: '/systems/version'},
    {id: '8010000', name: '버전 관리', link: '/systems/version', level: 1, parent: '8000000'},
    {id: '8020000', name: '화상수업 관리', link: '/systems/web-lesson', level: 1, parent: '8000000'},
    {id: '8030000', name: 'CDN 퍼지', link: '/systems/purge', level: 1, parent: '8000000'},
    {id: '8040000', name: '관리자 비밀번호', link: '/systems/password', level: 1, parent: '8000000'},

    {id: '-1000000', name: '마이페이지', link: '/home/profile', level: 1},
];

const masterList = [
    {id: '9000000', name: '업무', link: '/works', level: 0, defaultLink: '/works/todo'},
    {id: '9010000', name: '나의업무', link: '/works/todo', level: 1, parent: '9000000'},
    {id: '9020000', name: '팀업무', link: '/works/teamTodo', level: 1, parent: '9000000'},

    {id: '1000000', name: '회원관리', link: '/members', level: 0, defaultLink: '/members/member/students'},
    {id: '1010000', name: '서비스회원', level: 1, parent: '1000000'},
    // {id: '1010100', name: '학생회원', link: '/members/member/students', level: 2, parent: '1010000'},
    {id: '1010100', name: '학생회원', link: '/members/member/students', level: 2, parent: '1010000'},
    {id: '1010200', name: '학부모회원', link: '/members/member/parents', level: 2, parent: '1010000'},
    {id: '1020000', name: '관리자', link: '/members/admin', level: 1, parent: '1000000'},

    {id: '2000000', name: '교사관리', link: '/teachers', level: 0, defaultLink: '/teachers/organization/manage/teacher'},
    {id: '2010000', name: '인사/조직 관리', level: 1, parent: '2000000'},
    {id: '2010100', name: '팀/교사 관리', link: '/teachers/organization/manage', level: 2, parent: '2010000', defaultLink: '/teachers/organization/manage/teacher'},
    {id: '2010200', name: '윙크폰 및 사용자 관리', link: '/teachers/organization/phone', level: 2, parent: '2010000', defaultLink: '/teachers/organization/phone/readyPhone'},
    {id: '2010300', name: '교사 목표치 설정', link: '/teachers/organization/goal', level: 2, parent: '2010000'},
    {id: '2010400', name: '팀 평가', link: '/teachers/organization/rating', level: 2, parent: '2010000'},
    // {id: '2010500', name: '워크플래너 등록', link: '/teachers/organization/planner', level: 2, parent: '2010000'},
    {id: '2010600', name: '팀 게시판 관리', link: '/teachers/organization/board', level: 2, parent: '2010000', defaultLink: '/teachers/organization/board/team'},
    // {id: '2020000', name: '승인', level: 1, parent: '2000000'},
    // {id: '2020100', name: '팀장 승인 확인', link: '/teachers/approval/confirm', level: 2, parent: '2020000'},
    {id: '2030000', name: '수수료 관리', level: 1, parent: '2000000'},
    {id: '2030100', name: '윙크교사 수수료 입력', link: '/teachers/commission/base-teacher-fees', level: 2, parent: '2030000'},
    {id: '2030200', name: '팀장 수수료 입력', link: '/teachers/commission/base-leader-fees', level: 2, parent: '2030000'},
    {id: '2030300', name: '윙크교사 수수료 조회/수정', link: '/teachers/commission/teachers-fees', level: 2, parent: '2030000'},
    {id: '2030400', name: '팀장 수수료 조회/수정', link: '/teachers/commission/leaders-fees', level: 2, parent: '2030000'},
    {id: '2040000', name: '문의/요청', link: '/teachers/request', level: 1, parent: '2000000'},

    {id: '3000000', name: '매출(회비)관리', link: '/sales', level: 0, defaultLink: '/sales/payments'},
    {id: '3010000', name: '결제내역', link: '/sales/payments', level: 1, parent: '3000000'},

    {id: '4000000', name: '통계관리', link: '/statistics', level: 0, defaultLink: '/statistics/member'},
    {id: '4010000', name: '회원 통계관리', link: '/statistics/member', level: 1, parent: '4000000'},

    {id: '5000000', name: '콘텐츠(LCMS)관리', link: '/lcms', level: 0, defaultLink: '/lcms/curriculum/오늘의공부'},
    {id: '5010000', name: '커리큘럼 관리', link: '/lcms/curriculum', level: 1, parent: '5000000', defaultLink: '/lcms/curriculum/오늘의공부'},
    {id: '5020000', name: '콘텐츠 리소스 관리', link: '/lcms/contents', level: 1, parent: '5000000', defaultLink: '/lcms/contents/Service'},
    {id: '5030000', name: '콘텐츠 검수/배포', link: '/lcms/distribution', level: 1, parent: '5000000', defaultLink: '/lcms/distribution'},
    // {id: '5040000', name: '순차학습 순서관리', link: '/lcms/sequence', level: 1, parent: '5000000'},
    // {id: '5050000', name: '보상관리', link: '/lcms/benefits', level: 1, parent: '5000000'},
    {id: '5060000', name: '교재/교보재 관리', link: '/lcms/material', level: 1, parent: '5000000'},

    {id: '6000000', name: '서비스(운영)관리', link: '/services', level: 0, defaultLink: '/services/students/main'},
    {id: '6010000', name: '학생', level: 1, parent: '6000000'},
    {id: '6010100', name: '메인관리', link: '/services/students/main', level: 2, parent: '6010000'},
    {id: '6010200', name: '학습기 설정', link: '/services/students/winkbot', level: 2, parent: '6010000'},
    {id: '6010300', name: '이벤트 관리', link: '/services/students/event', level: 2, parent: '6010000'},
    {id: '6020000', name: '학무보',  level: 1, parent: '6000000'},
    {id: '6020100', name: '메인관리', link: '/services/parents/main', level: 2, parent: '6020000'},
    {id: '6020200', name: '게시글 관리', link: '/services/parents/board', level: 2, parent: '6020000', defaultLink: '/services/parents/board/notice'},
    {id: '6020250', name: '육아교육백과', link: '/services/parents/dictionary', level: 2, parent: '6020000', defaultLink: '/services/parents/dictionary/recommend'},
    {id: '6020300', name: '이벤트 관리', link: '/services/parents/event', level: 2, parent: '6020000'},
    {id: '6020400', name: '선생님지원관리', link: '/services/parents/teacher', level: 2, parent: '6020000'},
    {id: '6020500', name: '특별회원관리', link: '/services/parents/special', level: 2, parent: '6020000'},
    {id: '6030000', name: '공통관리',  level: 1, parent: '6000000'},
    {id: '6030100', name: '문의관리', link: '/services/common/inquire', level: 2, parent: '6030000'},
    {id: '6030200', name: '설문관리', link: '/services/common/survey', level: 2, parent: '6030000'},
    {id: '6030300', name: '알림관리', link: '/services/common/notice', level: 2, parent: '6030000'},

    {id: '7000000', name: '마케팅 관리', link: '/marketing', level: 0, defaultLink: '/marketing/coupon'},
    {id: '7010000', name: '쿠폰 관리', link: '/marketing/coupon', level: 1, parent: '7000000'},

    {id: '8000000', name: '시스템 관리', link: '/systems', level: 0, defaultLink: '/systems/version'},
    {id: '8010000', name: '버전 관리', link: '/systems/version', level: 1, parent: '8000000'},
    {id: '8020000', name: '화상수업 관리', link: '/systems/web-lesson', level: 1, parent: '8000000'},
    {id: '8030000', name: 'CDN 퍼지', link: '/systems/purge', level: 1, parent: '8000000'},
    {id: '8040000', name: '관리자 비밀번호', link: '/systems/password', level: 1, parent: '8000000'},

    {id: '-1000000', name: '마이페이지', link: '/home/profile', level: 1},
];

export const layout = (state = {list}, action) => {
    switch(action.type) {
        case type.MASTER_LEVEL_1:
        case type.MASTER_LEVEL_2:
        case type.MASTER_LEVEL_3:
            return {
                ...state,
                list: [...masterList]
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
