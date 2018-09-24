import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetch } from '../redux/actions';
import { values, service, api, path } from '../commons/configs';

import { Flex } from 'antd-mobile';

import { CommonSlider } from '../commons/components';
import { ListTop } from '../rank/components/common';
import { ItemList } from '../commons/components/item';



const mapStateToProps = ({fetch}) => {
    // TODO: 메인 슬라이드 필터 추가
    const mainStory = service.getValue(fetch, 'multipleList.mainStory', {});
    const mainRank = service.getValue(fetch, 'multipleList.mainRank.data', {});

    return {
        mainStory,
        storyList : service.getValue(mainStory, 'list', []),
        mainRank
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
    getItem :(url, params) => dispatch(fetch.get(url, params)),
});


class MainContainer extends React.Component {

    componentDidMount() {
        this.getData();
    }

    getData(){
        const story = api.getList({page : 1, size : 10, status: 2, order : 0});

        return this.props.multipleList([
            {id : 'mainStory', url : story.url, params : story.params },
            {id : 'mainRank', url : api.getRank('donate', 'month'), params : {}},
        ]);
    }

    render() {
        const { mainStory, storyList, mainRank } = this.props;

        return (
            <div className="main-container">
                <CommonSlider list={storyList} prefixUrl={path.storyItem} prefix="story"/>

                <div className="rank-wrapper" >
                    <Flex  align="start" >
                        <Flex.Item className="main-title">사용자 랭킹 <span>{`(${moment().format('YYYY년 MM월')})`}</span></Flex.Item>
                    </Flex>

                    <ListTop item={mainRank} type={'user'} />

                    <Link to='/rank/list/user' className="main-link">랭킹 전체 보기 > </Link>

                    <Flex direction="column" className="rank-total">
                        <Flex.Item>우리가 함꼐 모은 기부금</Flex.Item>
                        <Flex.Item className="price">{service.amount(service.getValue(mainRank, 'totalDonation', 0))}원</Flex.Item>
                    </Flex>
                </div>

                <div className="event-wrapper">
                    이벤트 게시글이 없습니다.
                </div>

                <div className="list-wrapper">
                    <Flex justify="between">
                        <Flex.Item className="main-title">프로젝트 모금함</Flex.Item>
                        <Flex.Item className="main-link"><Link to='/story/list/progress'>더보기 ></Link></Flex.Item>
                    </Flex>

                    <ItemList count={4} data={mainStory} prefixUrl={path.storyItem} prefix="story"/>
                </div>


            </div>
        );
    }
}

export default  connect(mapStateToProps, mapDispatchProps)(MainContainer);
