import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push, goBack } from 'react-router-redux';

import { path } from '../../../commons/configs';
import { CustomIcon } from '../../../commons/components';

import { NavBar } from 'antd-mobile';

const mapStateToProps = ({fetch}) => {
    return {
    }
};

const mapDispatchProps = dispatch => ({
    move: (location) => dispatch(push(location)),
    goBack : () => dispatch(goBack())
});

class SubHeader extends React.Component {

    onLeftClick(e){
        e.preventDefault();
        const { onLeftClick } = this.props;
        if(onLeftClick){
            return onLeftClick();
        }
        return this.props.goBack();
    }

    onRightClick(e){
        e.preventDefault();
        return this.props.move(path.main);
    }

    onOpenClick(){
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
        const { title } = this.props;

        return (
            <NavBar
                 mode="light"
                 className="header-wrap"
                 icon={<CustomIcon type="FaAngleLeft" roots="FontAwesome" style={{fontSize : '1.5em', verticalAlign : 'top' }}/>}
                 onLeftClick={this.onLeftClick.bind(this)}
                 rightContent={[
                   <CustomIcon type="FaHome" sizes="lg" key="1" className="am-icon-right" roots="FontAwesome" onClick={this.onRightClick.bind(this)} style={{fontSize : '1.5em', marginTop: 5}}/>,
                   <CustomIcon type="MdDehaze" sizes="lg" key="2" className="am-icon-right"  onClick={this.onOpenClick.bind(this, 'mypage')} style={{fontSize : '1.5em', marginTop: 5}}/>
                 ]}
            >
            <span>{title}</span>
           </NavBar>
        );
    }
}

SubHeader.propTypes = {
    title : PropTypes.string.isRequired,
    onLeftClick : PropTypes.func,
};

SubHeader.defaultProps = {
    title : ''
};

export default connect(mapStateToProps, mapDispatchProps)(SubHeader);
