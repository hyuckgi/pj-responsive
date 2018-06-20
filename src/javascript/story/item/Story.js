import React from 'react';
import { connect } from 'react-redux';
import { StickyContainer, Sticky } from 'react-sticky';

import { DesktopLayout, MobileLayout } from '../../commons/components';
import { service, api } from '../../commons/configs';
import { fetch } from '../../redux/actions';
import { Tabs, WhiteSpace } from 'antd-mobile';

import { StoryTop } from './';

const tabs = [
    {title : '상세보기'},
    {title : '후기보기'},
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
    }

    componentDidMount() {
        const itemId = service.getValue(this.props, 'match.params.id', false);
        if(itemId){
            this.getItem(itemId);
        }
    }

    getItem(id){
        return this.props.getItem(api.getStory(id))
    }

    renderTabBar(props){
        return (
            <Sticky>
                {({ style }) => {
                    const newStyle = {
                        ...style,
                        top: 80,
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

    onTabClick(tab, inx){
        console.log('onTabClick', tab, inx);
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
                        initalPage={2}
                        prerenderingSiblingsNumber={0}
                        destroyInactiveTab={true}
                        onTabClick={this.onTabClick}
                        renderTabBar={this.renderTabBar}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                            Content of first tab
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                            Content of second tab
                        </div>
                    </Tabs>
                </StickyContainer>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchProps)(Story);
