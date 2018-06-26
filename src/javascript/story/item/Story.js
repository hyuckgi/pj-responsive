import React from 'react';
import { connect } from 'react-redux';
import { StickyContainer, Sticky } from 'react-sticky';
import UAParser from 'ua-parser-js';

import { DesktopLayout, MobileLayout, FooterUtil } from '../../commons/components';
import { service, api } from '../../commons/configs';
import { fetch } from '../../redux/actions';
import { Tabs, WhiteSpace } from 'antd-mobile';

import { StoryTop } from './';
import Detail from './Detail';
import Review from './Review';

const parser = new UAParser();

const tabs = [
    {title : '상세보기', child : (<Detail />), key : 1,},
    {title : '후기보기', child : (<Review />), key : 2,},
];


const mapStateToProps = ({ fetch }) => {
    const item = service.getValue(fetch, 'item.data', {});

    return{
        item
    }
}

const mapDispatchProps = dispatch => ({
    getItem :(url) => dispatch(fetch.get(url)),
});

class Story extends React.Component {

    constructor(props) {
        super(props);


        this.getItem = this.getItem.bind(this);
        this.renderContent = this.renderContent.bind(this);
        this.renderUtils = this.renderUtils.bind(this);
    }

    componentDidMount() {
        const itemId = service.getValue(this.props, 'match.params.id', false);
        if(itemId){
            this.getItem(itemId);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.match.params.id !== this.props.match.params.id){
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
            <Sticky >
                {({ style }) => {
                    const newStyle = {
                        ...style,
                        top: 'auto',
                        bottom : 0,
                    }
                    return(
                        <div style={{ ...newStyle, zIndex: 998 }}>
                            <FooterUtil item={item}/>
                        </div>
                    )
                }}
            </Sticky>);
    }

    renderTabBar(props){
        const device = parser.getDevice();
        const type = service.getValue(device, 'type', false);

        return (
            <Sticky topOffset={0}>
                {({ style }) => {
                    const newStyle = {
                        ...style,
                        top: type === 'mobile' ? 45 : 80,
                        left:0,
                        width: '100%',
                        boxShadow : '1px 1px 1px rgba(0,0,0,0.2)'
                    }
                    return(
                        <div style={{ ...newStyle, zIndex: 998 }}>
                            <Tabs.DefaultTabBar
                                {...props}
                            />
                        </div>
                    )
                }}
            </Sticky>);
    }

    onTabClick(tab){
        window.scrollTo(0, 0);
    }

    renderContent(tab){
        return React.createElement('div', {}, tab.child);
    }

    render() {
        const { item } = this.props;

        return (
            <div className="story-detail">
                <WhiteSpace size="xs"/>
                <StoryTop item={item}/>
                <StickyContainer>
                    <Tabs
                        tabs={tabs}
                        initalPage={0}
                        destroyInactiveTab={true}
                        prerenderingSiblingsNumber={0}
                        onTabClick={this.onTabClick}
                        renderTabBar={this.renderTabBar}
                    >
                        {this.renderContent}
                    </Tabs>
                    {this.renderUtils(item)}
                </StickyContainer>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchProps)(Story);
