import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';

import { service, values, api, path } from '../../../commons/configs';
import { fetch } from '../../../redux/actions';

import { Avatar } from 'antd';
import { Tabs, Flex, Button } from 'antd-mobile';

import { StoryList, CommentList, SupportList } from '../list';

const mapStateToProps = ({ fetch,  router, layout, security }) => {
    const mypageMenus = service.getValue(layout, 'mypageMenus', []);

    const currentPath = service.getValue(router, 'location.pathname', "/mypage/list/support");
    const currentMenu = mypageMenus.filter(item => item.link === currentPath).find(item => item);
    const parentMenu = mypageMenus.filter(item => item.id === currentMenu.parent).find(item => item);
    const subMenu = mypageMenus.filter(item => item.parent ===  currentMenu.parent)
        .map((item, inx) => {
            item['title'] = item.name;
            item['key'] = inx + 1;
            return item;
        });
    const userInfo = security || {}
    const profile = service.getValue(fetch, 'item.data', false);

    return{
        currentMenu,
        parentMenu,
        subMenu,
        userInfo,
        profile
    }
};

const mapDispatchProps = dispatch => ({
    move: (path) => dispatch(push(path)),
    getItem : (url) => dispatch(fetch.get(url)),
});

class MypageTop extends React.Component {

    constructor(props) {
        super(props);

        this.getUser = this.getUser.bind(this);

        this.onMove = this.onMove.bind(this);

        this.onChange = this.onChange.bind(this);
        this.onTabClick = this.onTabClick.bind(this);

        this.renderContent = this.renderContent.bind(this);
        this.renderText = this.renderText.bind(this);
    }

    componentDidMount() {
        const token = service.getValue(this.props, 'userInfo.token', false);
        if(token){
            this.getUser();
        }
    }

    onMove(path){
        return this.props.move(path);
    }

    getUser(){
        return this.props.getItem(api.getProfile());
    }

    onChange(item, inx){
        return this.onMove(item.link);
    }

    onTabClick(item, inx){
        return this.onMove(item.link);
    }

    renderContent(item){
        const { type } = this.props;
        const selected = service.getValue(item, 'id', '401000000');

        if(!type || !selected){
            return;
        }

        switch (selected) {
            case '402000000':
                return (<StoryList />)
            case '403000000':
                return (<CommentList />)
            default:
                return (<SupportList />);
        }
    }

    renderText(){
        const { profile, userInfo } = this.props;
        const userId = service.getMasking(service.getValue(profile, 'userid', false), 3);
        const nickName = service.getValue(profile, 'nickname', false);

        if(userInfo ===  3){
            return (
                <div>
                    <p>{userId ? `${userId} (${nickName})` : nickName}</p>
                    <p>참여 {service.getValue(profile, 'donateCount', 0)}회 | 기부 {service.amount(service.getValue(profile, 'totalDonation', 0))}원</p>
                </div>
            )
        }

        return(
            <div>
                <p>{userId ? `${userId} (${nickName})` : nickName}</p>
                <p>참여 {service.getValue(profile, 'donateCount', 0)}회 | 기부 {service.amount(service.getValue(profile, 'totalDonation', 0))}원</p>
            </div>
        )
    }

    render() {
        const { parentMenu, subMenu, currentMenu, profile } = this.props;
        const image = service.getValue(profile, 'profileUrl', false);

        return (
            <div className="mypage-container-top">
                <Flex className="top-wrap">
                    <Flex.Item className="profile-url" style={{textAlign : 'center'}}>
                        {image ? (<Avatar src={image} />) : <Avatar icon="user" size={120} />}
                    </Flex.Item>
                    <Flex.Item className="text-area">
                        {this.renderText()}
                    </Flex.Item>
                    <Flex.Item className="btn-area">
                        <Button type="ghost" inline onClick={() => this.onMove(`${path.setting}/profile`)}>프로필 설정</Button>
                        <Button type="ghost" inline style={{marginLeft : 10}} onClick={() => this.onMove(path.withdrawal)}>회원탈퇴</Button>
                    </Flex.Item>
                </Flex>

                <Tabs
                    tabs={subMenu}
                    page={subMenu.findIndex(item => item.id === currentMenu.id)}
                    swipeable={false}
                    onChange={this.onChange}
                    onTabClick={this.onTabClick}
                    prerenderingSiblingsNumber={0}
                    destroyInactiveTab={true}
                    tabBarBackgroundColor={'#FF6E59'}
                    tabBarUnderlineStyle={{display:'none'}}
                >
                    {this.renderContent}
                </Tabs>
            </div>
        );
    }

}

export default withRouter(connect(mapStateToProps, mapDispatchProps)(MypageTop));
