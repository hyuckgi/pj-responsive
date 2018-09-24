import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { DesktopLayout, MobileLayout } from '../response';

import { Carousel as WebCarousel } from 'antd';
import { Carousel as MobileCarousel, Flex, Button } from 'antd-mobile';

import { path, service } from '../../configs';

const mapStateToProps = ({fetch}) => {

    return {
    }
};

const mapDispatchProps = dispatch => ({
    move: (location) => dispatch(push(location)),
});

class CommonSlider extends React.Component {

    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick(item){
        const { prefixUrl, prefix } = this.props;

        if(!prefixUrl){
            return;
        }

        return this.props.move(path.moveItem(prefixUrl, item[`${prefix}No`] ));
    }

    render() {
        const { list = [] } = this.props;

        return (
            <div className="common-slider">
                <DesktopLayout>
                    <WebCarousel
                        autoplay
                    >
                        {list.map((item, inx) => {
                            return (
                                <div key={inx} onClick={this.onClick.bind(this, item)}>
                                    <img
                                        src={item.imageUrl || item.thumbnailUrl}
                                        alt={item.title}
                                        onLoad={() => {
                                            window.dispatchEvent(new Event('resize'));
                                        }}
                                    />
                                </div>
                            )
                        })}
                    </WebCarousel>
                </DesktopLayout>
                <MobileLayout>
                    <MobileCarousel
                        autoplay={true}
                        infinite
                        // beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                        // afterChange={index => console.log('slide to', index)}
                    >
                        {list.map((item, inx) => {
                            return (
                                <a
                                    key={inx}
                                    onClick={this.onClick.bind(this, item)}
                                    style={{ display: 'inline-block', width: '100%', height: 'auto'}}
                                >
                                    <img
                                        src={item.imageUrl || item.thumbnailUrl}
                                        alt={item.title}
                                        style={{ width: '100%', verticalAlign: 'top', maxHeight: 220}}
                                        onLoad={() => {
                                            window.dispatchEvent(new Event('resize'));
                                        }}
                                    />
                                    <Flex className="text-area" justify="between" >
                                        <Flex.Item className="title">
                                            {`${service.getValue(item, 'title', '')}`}
                                        </Flex.Item>
                                        <Flex.Item className="link">
                                            <span>참여하기</span>
                                        </Flex.Item>
                                    </Flex>
                                </a>
                            );
                        })}
                    </MobileCarousel>
                </MobileLayout>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(CommonSlider);
