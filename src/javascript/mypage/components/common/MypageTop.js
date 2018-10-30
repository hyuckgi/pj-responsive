import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';

import { service, api, path } from '../../../commons/configs';
import { fetch, security } from '../../../redux/actions';

import { Avatar } from 'antd';
import { Tabs, Flex, Button, Modal } from 'antd-mobile';

import { StoryList, CommentList, SupportList, SponList } from '../list';
import { ADList } from '../../../commons/components';


const mapStateToProps = ({ fetch,  router, layout, security }) => {
    const mypageMenus = service.getValue(layout, 'mypageMenus', []);
    const currentPath = service.getValue(router, 'location.pathname', false);
    const currentMenu = currentPath && mypageMenus.filter(item => item.link === currentPath).find(item => item);
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
        subMenu,
        userInfo,
        profile
    }
};

const mapDispatchProps = dispatch => ({
    move: (path) => dispatch(push(path)),
    getItem : (url) => dispatch(fetch.get(url)),
    logout : () => dispatch(security.logout()),
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
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        const token = service.getValue(this.props, 'userInfo.token', false);
        if(token){
            return this.getUser();
        }
        return this.props.move(path.main);
    }

    componentDidUpdate(prevProps, prevState) {
        const token = service.getValue(this.props, 'userInfo.token', false);
        if(token !== service.getValue(this.props, 'userInfo.token', false)){
            if(token){
                return this.getUser();
            }
            return this.props.move(path.main);
        }
    }

    onLogout(){
        this.props.logout()
        return this.props.move(path.main);
    }

    onClick(){
        return Modal.alert('로그아웃', '로그아웃 하시겠습니까?', [
            { text : 'Cancel', onPress : () => console.log("cancel")},
            { text : 'OK', onPress : () => this.onLogout() }
        ]);
    }

    onMove(path){
        return this.props.move(path);
    }

    getUser(){
        const obj = api.getProfile();

        return this.props.getItem(obj.url);
    }

    onChange(item, inx){
        return this.onMove(item.link);
    }

    onTabClick(item, inx){
        return this.onMove(item.link);
    }

    renderContent(item){
        const { type } = this.props;
        const selected = service.getValue(item, 'id', '403000000');

        if(!type || !selected){
            return;
        }

        switch (selected) {
            case '501000000':
                return (<SponList />)
            case '502000000':
                return (<ADList path='manage'/>);
            case '504000000':
                return (<StoryList />);
            case '505000000':
                return (<CommentList />);
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
        const { subMenu, currentMenu, profile } = this.props;
        const image = service.getValue(profile, 'profileUrl', false);

        return (
            <div className="mypage-wrap">
                <Flex className="mypage-wrap-top">
                    <Flex.Item className="profile-url" style={{textAlign : 'center'}}>
                        {image ? (<Avatar src={image} />) : <Avatar icon="user" size={service.isMobile() ? 60 : 120} />}
                    </Flex.Item>
                    <Flex.Item className="text-area">
                        {this.renderText()}
                    </Flex.Item>
                    <Flex.Item className="btn-area">
                        <Button type="ghost" inline size={service.isMobile() ? 'small' : 'large'} onClick={() => this.onMove(`${path.setting}/profile`)}>프로필 설정</Button>
                        <Button type="ghost" inline size={service.isMobile() ? 'small' : 'large'} style={{marginLeft : 10}} onClick={() => this.onMove(path.withdrawal)}>회원탈퇴</Button>
                        {service.isMobile() ? (<Button type="ghost" inline size="small" style={{marginLeft : 10}} onClick={this.onClick}>로그아웃</Button>) : null}
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
                    tabBarBackgroundColor={service.isMobile() ? '#f7f8f9' : '#FF6E59'}
                    tabBarUnderlineStyle={service.isMobile() ? {} : {display:'none'}}
                >
                    {this.renderContent}
                </Tabs>
            </div>
        );
    }

}

export default withRouter(connect(mapStateToProps, mapDispatchProps)(MypageTop));
