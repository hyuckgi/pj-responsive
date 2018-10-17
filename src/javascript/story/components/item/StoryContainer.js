import React from 'react';
import { connect } from 'react-redux';
import { StickyContainer, Sticky } from 'react-sticky';
import { push } from 'react-router-redux';

import { FooterUtil, DesktopLayout, MobileLayout } from '../../../commons/components';
import { service, api, path } from '../../../commons/configs';
import { fetch } from '../../../redux/actions';
import { Tabs } from 'antd-mobile';

import { StoryTop } from './';
import Detail from './Detail';
import Review from './Review';


const tabs = [
    {title : 'Detail', key : 1,},
    {title : 'Review', key : 2,},
];

const mapStateToProps = ({ fetch }) => {
    const item = service.getValue(fetch, 'item.data', {});

    return{
        item
    }
}

const mapDispatchProps = dispatch => ({
    getItem :(url) => dispatch(fetch.get(url)),
    reset : () => dispatch(fetch.reset()),
    move: (location) => dispatch(push(location)),
});

class StoryContainer extends React.Component {

    constructor(props) {
        super(props);

        this.getItem = this.getItem.bind(this);
        this.renderContent = this.renderContent.bind(this);
        this.renderUtils = this.renderUtils.bind(this);
        this.onEvent = this.onEvent.bind(this);
        this.renderTab = this.renderTab.bind(this);

        this.onTabClick = this.onTabClick.bind(this);
    }

    componentDidMount() {
        const itemId = service.getValue(this.props, 'match.params.id', false);
        if(itemId){
            window.scroll(0, 0);
            this.getItem(itemId);
        }
    }

    componentWillUnmount() {
        this.props.reset();
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.match.params.id !== this.props.match.params.id){
            const itemId = service.getValue(this.props, 'match.params.id', false);
            if(itemId){
                this.getItem(itemId);
            }
        }
    }

    onEvent(obj){
        const { payload } = obj;
        const type = service.getValue(payload, 'type', false);
        if(type === 'update'){
            const itemId = service.getValue(this.props, 'match.params.id', false);
            if(itemId){
                this.getItem(itemId);
            }
        }
    }

    getItem(id){
        return this.props.getItem(api.getStory(id))
    }

    renderUtils(item){
        if(!Object.keys(item).length){
            return;
        }
        return (
            <Sticky>
                {({ style }) => {
                    const newStyle = {
                        ...style,
                        top: 'auto',
                        bottom : 10,
                    }
                    return(
                        <div style={{ ...newStyle, zIndex: 100 }}>
                            <FooterUtil item={item} onEvent={this.onEvent}/>
                        </div>
                    )
                }}
            </Sticky>
        );
    }

    renderTabBar(props){
        return (
            <Sticky>
                {({ style, isSticky }) => {
                    const newStyle = {
                        ...style,
                        top: 81,
                        left : 0,
                        boxShadow: '1px 1px 1px rgba(0,0,0,0.2)',
                        width : '100%'
                    };

                    return(
                        <div
                            style={{...newStyle, zIndex: 100}}
                            className={`story-tab-bar ${isSticky ? 'story-tab-bar-sticky' : 'story-tab-bar-relative'}`}
                        >
                            <Tabs.DefaultTabBar
                                {...props}
                            />
                        </div>
                    )
                }}
            </Sticky>);
    }

    onTabClick(tab){
        const id = service.getValue(this.props, 'match.params.id', false);

        if(!id){
            return
        }

        return this.props.move(path.moveItemStory(tab.title.toLowerCase(), id));

    }

    renderContent(tab){
        const { match } = this.props;
        const page = service.getValue(match, 'params.page', 'detail');

        switch (page) {
            case 'detail':
                return (<Detail />);
            case 'review':
                return (<Review />);
            default:
                break;
        }
    }

    renderTab(reviewData){
        return (
            <Tabs
                tabs={Object.keys(reviewData).length ? tabs : tabs.slice(0, 1)}
                initalPage={0}
                destroyInactiveTab={true}
                prerenderingSiblingsNumber={0}
                onTabClick={this.onTabClick}
                renderTabBar={this.renderTabBar}
            >
                {this.renderContent}
            </Tabs>
        )
    }

    render() {
        const { item } = this.props;
        const reviewData = service.getValue(item, 'reviewData', {});

        return (
            <div className="story-detail" ref="detail">
                <DesktopLayout>
                    <StoryTop item={item}/>

                    <StickyContainer>
                        {this.renderTab(reviewData)}
                        {this.renderUtils(item)}
                    </StickyContainer>
                </DesktopLayout>
                <MobileLayout>
                    {this.renderContent()}
                </MobileLayout>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchProps)(StoryContainer);
