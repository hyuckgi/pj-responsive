
const makeList = (mock, count) => {
    return new Array(count).fill(mock).map((item, idx) => {
        return Object.keys(item).reduce((result, key) => {
            result[key] = item[key];
            if(typeof item[key] === 'number' && key !== 'status' && key !== 'likeCount' && key !== 'replyCount'){
                result[key] = item[key] + idx;
            }
            if(key === 'username' || key === 'nickname' || key === 'userId' || key === 'noticeTitle' ||  key === 'storyTitle' || key === 'title' || key === 'contents' || key === 'bankName' || key === 'depositor'){
                result[key] = `${item[key]}_${idx}`;
            }
            return result;
        }, {});
    });
}

export const mock = {
    '/api/sponsor/ranking/summary' : (count) => {
        return {
            "resultCode" : 200,
            "resultMsg" : "SUCCESS",
            "data" : {
                "totalDonation": 30000000,
                "rankerList" : [
                    {
                        "rankTerm": "month",
                        "userNo": 10000001,
                        "userId": "스폰서 랭커_1",
                        "profileUrl": "https://picsum.photos/480/320?random",
                        "sponsorCount": 10000,
                        "totalDonation": 1000000
                    },
                    {
                        "rankTerm": "year",
                        "userNo": 10000002,
                        "userId": "스폰서 랭커_2",
                        "profileUrl": "https://picsum.photos/480/320?random",
                        "sponsorCount": 20000,
                        "totalDonation": 2000000
                    },
                    {
                        "rankTerm": "week",
                        "userNo": 10000003,
                        "userId": "스폰서 랭커_3",
                        "profileUrl": "https://picsum.photos/480/320?random",
                        "sponsorCount": 5000,
                        "totalDonation": 50000
                    }
                ]
            }
        }
    },

    '/api/sponsor/ranking/page/1/size' :  (count) => {
        return {
            "resultCode" : 200,
            "resultMsg" : "SUCCESS",
            "totalPage" : 5,
            "totalSize" : count * 5,
            "page" : 1,
            "size" : count,
            "list" : makeList({
               "ranking": 1,
               "userNo": 10000001,
               "username": "스폰서",
               "nickname": "닉네임1",
               "profileUrl": "https://picsum.photos/480/320?random",
               "donateCount": 1000000,
               "totalDonation": 100000000
           }, count),
        }
    },

    '/api/donate/ranking/summary': (count) => {
        return {
            "resultCode" : 200,
            "resultMsg" : "SUCCESS",
            "data" : {
                "totalDonation": 3000000,
                "rankerList": [
                    {
                        "rankTerm": "month",
                        "userId": "사용자 랭커_1",
                        "profileUrl": "https://picsum.photos/480/320?random",
                        "count": 10000,
                        "totalDonation": 10000000
                    },
                    {
                        "rankTerm": "year",
                        "userId": "사용자 랭커_2",
                        "profileUrl": "https://picsum.photos/480/320?random",
                        "count": 1000000,
                        "totalDonation": 20000000000
                    },
                    {
                        "rankTerm": "week",
                        "userId": "사용자 랭커_3",
                        "profileUrl": "https://picsum.photos/480/320?random",
                        "count": 100000,
                        "totalDonation": 200000000
                    }
                ]
            }
        }
    },

    '/api/donate/ranking/page/1/size' : (count) => {
        return {
            "resultCode" : 200,
            "resultMsg" : "SUCCESS",
            "totalPage" : 5,
            "totalSize" : count * 5,
            "page" : 1,
            "size" : count,
            "list" : makeList({
                "ranking": 1,
                "userId": "사용자",
                "thumbnailUrl": "https://picsum.photos/480/320?random",
                "donateCount": 100000,
                "totalDonation": 100000
            }, count)
        }
    },

    '/api/notice/page/1/size' : (count) => {
        return {
            "resultCode" : 200,
            "resultMsg" : "SUCCESS",
            "totalPage" : 5,
            "totalSize" : count * 5,
            "page" : 1,
            "size" : count,
            "list" : makeList({
                "noticeNo": 10000001,
                "noticeTitle": "공지",
                "updateDate": "2018-06-17 22:48:09",
                "createDate": "2018-06-17 22:48:09"
            }, count)
        }
    },

    '/api/donate/activity/page/1/size' : (count) => {
        return {
            "resultCode" : 200,
            "resultMsg" : "SUCCESS",
            "totalPage" : 5,
            "totalSize" : count * 5,
            "page" : 1,
            "size" : count,
            "list" : makeList({
                "username": "사용자",
                "nickname": "닉네임",
                "storyTitle": "스토리 제목",
                "thumbnailUrl": "https://picsum.photos/480/320?random",
                "donateCount": 1000,
                "totalDonation": 100000,
                "donateDate": "2018.06.17"
            }, count)
        }
    },

    '/api/member/story/page/1/size' : (count) => {
        return {
            "resultCode" : 200,
            "resultMsg" : "SUCCESS",
            "totalPage" : 5,
            "totalSize" : count * 5,
            "page" : 1,
            "size" : count,
            "list" : makeList({
                "storyNo": 1,
                "userNo": 1,
                "username": "사용자 이름",
                "nickname": "사용자 닉네임",
                "categoryNo": 1000000001,
                "categoryName": "카테고리 - 1",
                "title": "제목",
                "imageUrl": "https://picsum.photos/480/320?random",
                "contents": "내용",
                "totalDonation": 0,
                "goalDonation": 100,
                "fundraisingPeriod": 7,
                "likeCount": 0,
                "replyCount": 0,
                "status": 1,
                "isUpdate": false,
                "isDelete": false,
                "updateDate": "2018-06-19 12:01:42",
                "createDate": "2018-06-19 12:01:42"
            }, count)
        }
    },

    '/api/member/comment/page/1/size' : (count) => {
        return {
            "resultCode": 200,
            "resultMsg": "SUCCESS",
            "totalPage": 5,
            "totalSize": count * 5,
            "page": 1,
            "size": count,
            "list": makeList({
                "commentNo": 10000001,
                "profileUrl": "https://picsum.photos/480/320?random",
                "storyTitle": "스토리 제목",
                "updateDate": "2018-06-17 22:48:09",
                "createDate": "2018-06-17 22:48:09",
                "contents" : "댓글 내용"
            }, count),
        }
    },

    '/api/account' : (count) => {
        return {
            "resultCode" : 200,
            "resultMsg" : "SUCCESS",
            "list" : makeList({
                "accountNo": 10000001,
                "accountNumber": "1234-1111-3333",
                "bankName": "국민은행",
                "depositor": "아마존",
                "updateDate": "2018-06-17 22:48:09",
                "createDate": "2018-06-17 22:48:09"
            }, count)
        }
    },

    '/api/sponsor/donate/page/1/size' : (count) => {
        return {
            "resultCode" : 200,
            "resultMsg" : "SUCCESS",
            "totalPage" : 5,
            "totalSize" : count * 5,
            "page" : 1,
            "size" : count,
            "list" : makeList({
                "storyNo": 1,
                "storyTitle": "스토리 제목",
                "adNo": 11,
                "adTitle": "광고 제목",
                "donationPerTime": 1500,
                "donateCount": 10,
                "totalDonation": 199999,
                "createDate": "2018년 4월 27일 10시 10분"
            }, count)
        }
    }


}


export default mock;
