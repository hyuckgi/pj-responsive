import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';

import { service, values } from '../../../commons/configs';

import { Tabs } from 'antd-mobile';

import { Policy, Agreement, CsList, MakeCs } from '../';

const mapStateToProps = ({ fetch, code, router, layout }) => {
    const allMenu = Object.keys(layout).reduce((result, item) => {
        result = result.concat(layout[item]);
        return result;
    }, [])

    const currentPath = service.getValue(router, 'location.pathname', "/main");
    const currentMenu = allMenu.filter(item => item.link === currentPath).find(item => item);
    const parentMenu = allMenu.filter(item => item.id === currentMenu.parent).find(item => item);
    const subMenu = allMenu.filter(item => item.parent ===  currentMenu.parent)
        .map((item, inx) => {
            item['title'] = item.name;
            item['key'] = inx + 1;
            return item;
        });

    return{
        currentMenu,
        parentMenu,
        subMenu
    }
};

const mapDispatchProps = dispatch => ({
    move: (path) => dispatch(push(path)),
});


class ServiceTop extends React.Component {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onTabClick = this.onTabClick.bind(this);
        this.renderContent = this.renderContent.bind(this);
    }


    onChange(item, inx){
        return this.props.move(item.link);
    }

    onTabClick(item, inx){
        return this.props.move(item.link);
    }

    renderContent(item){
        const { type } = this.props;
        const selected = service.getValue(item, 'id', false);

        if(!type || !selected){
            return;
        }

        switch (selected) {
            case '4010100':
                return (<CsList />)
            case '4010200':
                return (<MakeCs />)
            case '4020100':
                return (<Agreement />)
            case '4020200':
                return (<Policy />)
            default:
                break;
        }
    }

    render() {
        const { parentMenu, subMenu, currentMenu } = this.props;

        return (
            <div className="service-wrapper-top">
                <h2 className="title">{`${values.spoons.serviceName} ${parentMenu.name}`}</h2>

                <Tabs
                    tabs={subMenu}
                    page={subMenu.findIndex(item => item.id === currentMenu.id)}
                    swipeable={false}
                    onChange={this.onChange}
                    onTabClick={this.onTabClick}
                    prerenderingSiblingsNumber={0}
                    destroyInactiveTab={true}
                    tabBarUnderlineStyle={{display:'none'}}
                >
                    {this.renderContent}
                </Tabs>
            </div>
        );
    }

}

export default withRouter(connect(mapStateToProps, mapDispatchProps)(ServiceTop));
