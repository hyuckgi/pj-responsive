import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Tabs } from 'antd-mobile';
import { service, path } from '../../../commons/configs';

const mapStateToProps = ({fetch}) => {
    const story = service.getValue(fetch, 'item.data', {});

    return {
        story
    }
};

const mapDispatchProps = dispatch => ({
    move: (location) => dispatch(push(location))
});

class SubNavigation extends React.Component {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.renderTab = this.renderTab.bind(this);
        this.moveTab = this.moveTab.bind(this);
    }

    onChange(layout, idx){
        return this.moveTab(layout);
    }

    renderTab(props){
        return(
            <Tabs.DefaultTabBar
                {...props}
                renderTab={tab => <span className="navigation-menu">{tab.name}</span>}
            />
        );
    }

    moveTab(layout){
        const { location } = this.props;
        const link = service.getValue(layout, 'defaultLink', false) || service.getValue(layout, 'link', '/');

        if(link.indexOf(path.storyItem) === 0){
            const pathName = service.getValue(location, 'pathname', '').split('/');
            return this.props.move(path.moveItemStory(layout.name.toLowerCase(), pathName[pathName.length - 2]))
        }

        return this.props.move(link);
    }

    render() {
        const { tabs, page } = this.props;

        return (
            <div className="sub-navigations" >
                <Tabs
                    tabs={tabs}
                    page={page}
                    swipeable={false}
                    onChange={this.onChange}
                    renderTabBar={this.renderTab}
                    tabBarTextStyle={{fontSize:'12px'}}
                    tabBarBackgroundColor="#f7f8f9"
                />
            </div>
        );
    }

}

export default withRouter(connect(mapStateToProps, mapDispatchProps)(SubNavigation));
