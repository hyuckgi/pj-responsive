import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import { LocalNavigationBar } from '../../../layout/web';

import { service, values } from '../../../commons/configs';

import { Tabs } from 'antd-mobile';


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

        console.log("type", type);
        console.log("selected", selected);

        if(!type || !selected){
            return;
        }

        switch (selected) {
            case '4010100':
                return (<div>{selected}</div>)
            case '4010200':
                return (<div>{selected}</div>)
            case '4020100':
                return (<div>{selected}</div>)
            case '4020200':
                return (<div>{selected}</div>)
            default:
                break;
        }
    }

    render() {
        const { parentMenu, subMenu } = this.props;

        console.log("subMenu", subMenu);

        return (
            <div className="service-wrapper-top">
                <p>{`${values.spoons.serviceName} ${parentMenu.name}`}</p>

                <Tabs
                    tabs={subMenu}
                    initialPage={0}
                    swipeable={false}
                    onChange={this.onChange}
                    onTabClick={this.onTabClick}
                    prerenderingSiblingsNumber={0}
                    destroyInactiveTab={true}
                >
                    {this.renderContent}
                </Tabs>
            </div>
        );
    }

}

export default withRouter(connect(mapStateToProps, mapDispatchProps)(ServiceTop));
