export const format = {
    FULL_DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
    DATETIME_FORMAT: 'YYYY-MM-DD HH:mm',
    DATE_FORMAT: 'YYYY-MM-DD',
    TIME_FORMAT: 'HH:mm',
    TIME_FORMAT_SEC : 'HH:mm:ss',
    DAY_FORMAT: 'ddd',
};

export const platform = {
    MOBILE : 'mobile',
    PC : 'desktop',
}

export const mock = {
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
                category : inx % 3 === 0 ? 'complete' : 'drop'
            }
        }
    }),
}

export const requestType = {
    'FIRST' : {
        label: '배송정보 입력', step: 1,
    },
    'SECOND' : {
        label: '아이정보 입력', step: 2,
    },
    'THRID' : {
        label: '학습단계 설정', step: 3,
    },
};

export const agreementValue = [
    { value: true, label: '이용약관', url : 'http://www.naver.com', name : 'usedAgreement' },
    { value: true, label: '개인정보보호', url : 'http://www.daum.net', name : 'privateAgreement'},
];


export default {
    format,
    mock,
    platform,
    requestType
};
