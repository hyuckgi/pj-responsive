import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import imgLogo from '../../../../resource/commons/logo2.png';

import { NavBar } from 'antd-mobile';

import { CustomIcon } from '../../../commons/components';
import { path } from '../../../commons/configs';


const mapDispatchProps = dispatch => ({
    move: (location) => dispatch(push(location))
});

class HeaderContainer extends React.Component {

    constructor(props) {
        super(props);

        this.onOpenClick = this.onOpenClick.bind(this);
        this.getRightContent = this.getRightContent.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onClickSearch = this.onClickSearch.bind(this);
    }

    onClickSearch(e){
        e && e.preventDefault();
        return this.props.move(path.search);
    }

    getRightContent(){
        return [
            <CustomIcon type="MdSearch" sizes="lg" key="0" className="am-icon-right"  onClick={this.onClickSearch} style={{fontSize : '1.5em', marginTop: 5}}/>,
            <CustomIcon type="MdDehaze" sizes="lg" key="1" className="am-icon-right"  onClick={this.onOpenClick.bind(this, 'mypage')} style={{fontSize : '1.5em', marginTop: 5}}/>
        ]
    }

    onClick(e){
        e && e.preventDefault();
        return this.props.move(path.main);
    }


    onOpenClick(target = null){
        const { onEvents } = this.props;

        if(onEvents){
            onEvents({
                events : 'open',
                payload : {
                    name : 'drawer'
                }
            })
        }
    }

    render() {
        const { isGlobalMenu } = this.props;

        if(!isGlobalMenu){
            return null;
        }

        return (
            <div className="header-container">
                <NavBar
                    mode="light"
                    className="header-wrap"
                    leftContent={(<a onClick={this.onClick}><img src={imgLogo} alt="logo" />9Spoons</a>)}
                    rightContent={this.getRightContent()}
                />
            </div>
        );
    }

}

export default connect(null, mapDispatchProps)(HeaderContainer);
