
const userRankList = [
    {title: 'Ranking', dataIndex: 'inx', key: 'inx', width: 100},
    {title: '회원명', dataIndex: 'userId', key: 'userId'},
    {title: '참여횟수', dataIndex: 'donateCount', key: 'donateCount', width: 200},
    {title: '기부금액', dataIndex: 'totalDonation', key: 'totalDonation', width: 200},
];

const sponsorRankList = [
    {title: 'Ranking', dataIndex: 'inx', key: 'inx', width: 100},
    {title: '스폰서명', dataIndex: 'username', key: 'username'},
    {title: '참여횟수', dataIndex: 'donateCount', key: 'donateCount', width: 200},
    {title: '기부금액', dataIndex: 'totalDonation', key: 'totalDonation', width: 200},
];

const donationList = [
    {title: 'thumbnail', dataIndex: 'thumbnailUrl', key: 'thumbnailUrl', width: 100, className: 'center'},
    {title: '참여일자', dataIndex: 'donateDate', key: 'donateDate', width: 150, className : 'center'},
    {title: '참여스토리', dataIndex: 'storyTitle', key: 'storyTitle'},
    {title: '참여횟수', dataIndex: 'donateCount', key: 'donateCount', width: 100, className : 'center'},
    {title: '기부금액', dataIndex: 'totalDonation', key: 'totalDonation', width: 150, className : 'center'},
];

const proposeList = [
    {title: '제안일자', dataIndex: 'proposeDate', key: 'proposeDate', width: 150},
    {title: '제목', dataIndex: 'storyTitle', key: 'storyTitle'},
    {title: '상태', dataIndex: 'status', key: 'status', width: 150},
    {title: '목표금액', dataIndex: 'goalDonation', key: 'goalDonation', width: 200},
    {title: '달성율', dataIndex: 'totalDonation', key: 'totalDonation', width: 150},
];

const myProposeList = [
    {title: '대표사진', dataIndex: 'imageUrl', key: 'imageUrl', width: 100, className: 'center'},
    {title: '제안일자', dataIndex: 'createDate', key: 'createDate', width: 200, className : 'center'},
    {title: '스토리 제목', dataIndex: 'title', key: 'title'},
    {title: '상태', dataIndex: 'status', key: 'status', width: 100, className : 'center'},
    {title: '목표금액', dataIndex: 'goalDonation', key: 'goalDonation', width: 150, className : 'center'},
    {title: '달성율', dataIndex: 'totalDonation', key: 'totalDonation', width: 150, className : 'center'},
];

const sponList = [
    {title: '기부일자', dataIndex: 'createDate', key: 'createDate', width: 250, className: 'center'},
    {title: '스토리 제목', dataIndex: 'storyTitle', key: 'storyTitle'},
    {title: '광고 제목', dataIndex: 'adTitle', key: 'adTitle'},
    {title: '단가', dataIndex: 'donationPerTime', key: 'donationPerTime', width: 150, className : 'center'},
    {title: '횟수', dataIndex: 'donateCount', key: 'donateCount', width: 150, className : 'center'},
    {title: '소계', dataIndex: 'total', key: 'total', width: 150, className : 'center'},
];


export {
    userRankList,
    sponsorRankList,
    donationList,
    proposeList,
    myProposeList,
    sponList
}
