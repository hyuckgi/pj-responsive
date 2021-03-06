const format = {
    FULL_DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
    DATETIME_FORMAT: 'YYYY-MM-DD HH:mm',
    DATE_FORMAT: 'YYYY-MM-DD',
    TIME_FORMAT: 'HH:mm',
    TIME_FORMAT_SEC : 'HH:mm:ss',
    DAY_FORMAT: 'ddd',
    LOCALE_KOR : `YYYY년 MM월 DD일`,
};

const validateUrl = /^(www.)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
const validateEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;


const spoons = {
    serviceName : '9spoons',
}

const platform = {
    MOBILE : 'mobile',
    PC : 'desktop',
}

const role = [
    {
        key : 1,
        name : 'LEVEL1',
        type : 'administrator',
        label : '어드민'
    },
    {
        key : 2,
        name : 'LEVEL2',
        type : 'local_administrator',
        label : '지역어드민'
    },
    {
        key : 3,
        name : 'LEVEL3',
        type : 'sponsor',
        label : '스폰서'
    },
    {
        key : 9,
        name : 'USER',
        type : 'user',
        label : '사용자'
    }
]

const sns = {
    facebook : {
        appId : '264915647586595',
    }
}

const mock = {
    stories : Array(50).fill('').map((item, inx) => {
        if(inx % 2 === 0){
            return{
                id: inx + 1,
                title : `test_${inx}`,
                src : 'https://picsum.photos/480/320?random',
                descript : `테스트 샘플 입니다.${inx} 테스트 샘플 입니다. 테스트 샘플 입니다. 테스트 샘플 입니다. 테스트 샘플 입니다.`,
                auth : `마크 주커버그_${inx}`,
                price : {
                    total : `${(inx + 1) * 10000} `,
                    present : `${(inx + 1) * 1000} `,
                    count : inx + 10,
                },
                mark : 'main',
                category : 'progress'
            }
        }else{
            return{
                id: inx + 1,
                title : `test_${inx}`,
                src : 'https://picsum.photos/480/320?gravity=east',
                descript : `테스트 샘플 입니다.${inx} 테스트 샘플 입니다. 테스트 샘플 입니다. 테스트 샘플 입니다. 테스트 샘플 입니다.`,
                auth : `마크 주커버그_${inx}`,
                price : {
                    total : `${(inx + 1) * 10000} `,
                    present : `${(inx + 1) * 1000} `,
                    count : inx + 10,
                },
                mark : '',
                category : inx % 3 === 0 ? 'complete' : 'ready'
            }
        }
    }),
}

const story = {
    options : [
        {
            path : 'all',
            status : 0,
            value : 0,
            label : '전체',
        },
        {
            path : 'ready',
            status : 1,
            value : 1,
            label : '등록대기'
        },
        {
            path : 'progress',
            status : 2,
            value : 2,
            label : '모금중'
        },
        {
            path : 'complete',
            status : 3,
            value : 3,
            label : '모금완료'
        }
    ],
    order : [
        {
            label : '추천순',
            value : 1,
        },
        {
            label : '최신순',
            value : 0,
        },
        {
            label : '종료임박',
            value : 2,
        },
    ],
}

const requestType = {
    'FIRST' : {
        label: '약관동의', step: 1,
    },
    'SECOND' : {
        label: '계정정보 입력', step: 2,
    },
    'THRID' : {
        label: '회원정보 입력', step: 3,
    },
};


const propose = {
    steps : [
        {
            id : 1,
            label : '1단계',
        },
        {
            id : 2,
            label : '2단계',
        },
        {
            id : 3,
            label : '3단계',
        }
    ],
}

const rank = {
    'user' : {
        types : [
            {type : 'all', title : '전체 기부왕', inx : 0},
            {type : 'year', title : '이번달 기부왕', inx : 1},
            {type : 'month', title : '지난달 기부왕', inx : 2},
            {type : 'week', title : '금주의 기부왕', inx : 3},
        ]
    },
    'sponsor' : {
        types : [
            {type : 'all', title : '최고의 스폰서', inx : 0},
            {type : 'year', title : '올해의 스폰서', inx : 1},
            {type : 'month', title : '이달의 스폰서', inx : 2},
            {type : 'week', title : '금주의 스폰서', inx : 3},
        ]
    },
}

const join = {
    'userType' : [
        { value : 11, label : '사용자'},
        { value : 12, label : '스폰서'}
    ],
    'options' : [
        {value : '', label : '직접입력'},
        {value : 'gmail.com', label : 'goole'},
        {value : 'naver.com', label : 'naver'},
        {value : 'daum.com', label : 'daum'},
    ]
}

const report = {
    categories : [
        {value : 11, label : '영리목적/홍보성'},
        {value : 12, label : '불법정보'},
        {value : 13, label : '음란성/선정성'},
        {value : 14, label : '욕설/인신공격'},
        {value : 15, label : '개인정보 노출'},
        {value : 16, label : '같은내용 도배'},
        {value : 17, label : '권리침해 신고'},
        {value : 99, label : '기타'},
    ]
}

export {
    format,
    mock,
    role,
    platform,
    requestType,
    propose,
    story,
    sns,
    rank,
    spoons,
    join,
    report,
    validateUrl,
    validateEmail
};
