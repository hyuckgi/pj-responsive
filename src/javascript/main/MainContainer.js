import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetch } from '../redux/actions';
import { service, api, path } from '../commons/configs';

import { Flex } from 'antd-mobile';

import { CommonSlider, StoryList } from '../commons/components';
import { ListTop } from '../rank/components/common';

const mapStateToProps = ({fetch}) => {
    // TODO: 메인 슬라이드 필터 추가
    const mainStory = service.getValue(fetch, 'multipleList.mainStory', {});
    const mainRank = service.getValue(fetch, 'multipleList.mainRank.data', {});
    const events = service.getValue(fetch, 'multipleList.event.list', []);

    return {
        mainStory,
        mainRank,
        events
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
    getList :(url, params) => dispatch(fetch.list(url, params)),
});


class MainContainer extends React.Component {

    componentDidMount() {
        this.getData();
    }

    getData(){
        const story = api.getList({page : 1, size : 10, status: 1, order : 0});

        return this.props.multipleList([{id : 'mainStory', url : story.url, params : story.params }])
            .then(() => {
                return this.props.multipleList([
                    {id : 'mainRank', url : api.getRank('donate', 'month'), params : {}},
                    {id : `event`, url : api.getEventList({status : 'going', page : 1, size : 5}), params : {} },
                ]);
            });
    }

    render() {
        const { mainStory, mainRank, events } = this.props;

        return (
            <div className="main-container">
                <div className="main-slider-area" >
                    <CommonSlider list={service.getValue(mainStory, 'list', [])} prefixUrl={path.storyItem} prefix="story" path="main"/>
                </div>

                <div className="rank-wrapper" >
                    <Flex  align="start" >
                        <Flex.Item className="main-title">사용자 랭킹 <span>{`(${moment().format('YYYY년 MM월')})`}</span></Flex.Item>
                    </Flex>

                    <ListTop item={mainRank} type={'user'} />

                    <Link to='/rank/list/user' className="main-link">More</Link>

                    <Flex direction="column" className="rank-total">
                        <Flex.Item>우리가 함께 모은 기부금</Flex.Item>
                        <Flex.Item className="price">{service.amount(service.getValue(mainRank, 'totalDonation', 0))}원</Flex.Item>
                    </Flex>
                </div>

                <div className="event-wrapper">
                    이벤트 등록시 배너 이미지 추가 등록??
                    <CommonSlider list={events} prefixUrl={path.boardItem} prefix="event" path="event"/>
                </div>

                <div className="list-wrapper">
                    <Flex justify="between">
                        <Flex.Item className="main-title">프로젝트 모금함</Flex.Item>
                    </Flex>

                    <StoryList count={4} data={mainStory} prefixUrl={path.storyItem} prefix="story"/>
                    <Link to='/story/list/progress' className="main-link">More</Link>
                </div>


            </div>
        );
    }
}

export default  connect(mapStateToProps, mapDispatchProps)(MainContainer);
