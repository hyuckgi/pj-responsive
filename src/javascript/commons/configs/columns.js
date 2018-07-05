
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
    {title: '참여일자', dataIndex: 'donateDate', key: 'donateDate', width: 150},
    {title: '참여스토리', dataIndex: 'storyTitle', key: 'storyTitle'},
    {title: '참여횟수', dataIndex: 'donateCount', key: 'donateCount', width: 100},
    {title: '기부금액', dataIndex: 'totalDonation', key: 'totalDonation', width: 150},
];

export {
    userRankList,
    sponsorRankList,
    donationList
}
