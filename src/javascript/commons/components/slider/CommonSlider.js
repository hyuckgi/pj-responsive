import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { DesktopLayout, MobileLayout, ButtonWrapper, CustomIcon } from '../';

import { Carousel as WebCarousel } from 'antd';
import { Carousel as MobileCarousel, Flex } from 'antd-mobile';

import { path, service } from '../../configs';
import { FormButton } from '../../types';

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
        this.getButtons = this.getButtons.bind(this);
        this.renderImage = this.renderImage.bind(this);
    }

    onClick(item){
        const { prefixUrl, prefix } = this.props;

        if(!prefixUrl){
            return;
        }

        if(prefix === 'story'){
            return this.props.move(path.moveItemStory('detail', item[`${prefix}No`]));
        }

        return this.props.move(path.moveItem(prefixUrl, item[`${prefix}No`] ));
    }

    onClickButton(id){
        switch (id) {
            case FormButton.PREV:
                return this.refs.webCarousel.prev();
            case FormButton.NEXT:
                return this.refs.webCarousel.next();
            default:
                break;
        }
    }

    getButtons(){
        return [
            { id : FormButton.PREV, label : null, className : 'btn-prev', icon : (<CustomIcon type="MdChevronLeft" />), type : 'ghost' },
            { id : FormButton.NEXT, label : null, className : 'btn-next', icon : (<CustomIcon type="MdChevronRight" />), type : 'ghost'}
        ];
    }

    renderImage(list){
        const { path = false } = this.props;

        if(path === 'main'){
            return list.map((item, inx) => {
                console.log("item", item);
                return (
                    <a
                        key={inx}
                        onClick={this.onClick.bind(this, item)}
                    >
                        <div className="main-slider">
                            <div className="img-area">
                                <img
                                    src={item.imageUrl || item.thumbnailUrl}
                                    alt={item.title}
                                    onLoad={() => {
                                        window.dispatchEvent(new Event('resize'));
                                    }}
                                />
                            </div>
                            <div className="text-area">
                                <div>
                                    {`${service.getValue(item, 'title', '')}`}
                                </div>
                            </div>
                        </div>
                    </a>
                )
            })
        }

        return list.map((item, inx) => {
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
            });
    }

    render() {
        const { list = [], autoplay = true, path = false} = this.props;
        const isMain = path === 'main' ? true : false;

        return (
            <div className="common-slider">
                <DesktopLayout>
                    <WebCarousel
                        ref="webCarousel"
                        autoplay={autoplay}
                        dots={isMain}
                        effect={isMain ? 'fade' : 'scrollx'}
                    >
                        {this.renderImage(list)}
                    </WebCarousel>
                    {!isMain && list.length > 1 ? (<ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>) : null }
                </DesktopLayout>
                <MobileLayout>
                    <MobileCarousel
                        autoplay={autoplay}
                        infinite
                        // beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                        // afterChange={index => console.log('slide to', index)}
                    >
                        {list.map((item, inx) => {
                            return (
                                <a
                                    key={inx}
                                    onClick={this.onClick.bind(this, item)}

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
