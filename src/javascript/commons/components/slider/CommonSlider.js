import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { DesktopLayout, MobileLayout, ButtonWrapper, CustomIcon } from '../';

import { Carousel as WebCarousel, Progress } from 'antd';
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
        this.renderItem = this.renderItem.bind(this);
        this.renderMainItem = this.renderMainItem.bind(this);
        this.renderImage = this.renderImage.bind(this);
        this.renderProgressBar = this.renderProgressBar.bind(this);
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

    renderImage(item, style = {}){
        return (
            <img
                src={item.imageUrl || item.thumbnailUrl}
                alt={item.title}
                style={style}
                onLoad={() => {
                    window.dispatchEvent(new Event('resize'));
                }}
            />
        )
    }

    getButtons(){
        return [
            { id : FormButton.PREV, label : null, className : 'btn-prev', icon : (<CustomIcon type="MdChevronLeft" />), type : 'ghost' },
            { id : FormButton.NEXT, label : null, className : 'btn-next', icon : (<CustomIcon type="MdChevronRight" />), type : 'ghost'}
        ];
    }

    renderProgressBar(item){
        const status = service.getValue(item, 'status', false);
        const percent = service.toPercentage(item.goalDonation / item.totalDonation);

        return(
            <Flex.Item>
                <div className="float-wrapper">
                    <p>목표금액</p>
                    <p>{service.amount(service.getValue(item, 'goalDonation', 0))} 원</p>
                </div>
                {status && status !== 2
                    ? (
                        <Progress percent={parseInt(percent, 10)} showInfo={false} status={status === 2 ? 'active' : 'normal'} size='small'/>
                    ) : null
                }
            </Flex.Item>
        )
    }

    renderMainItem(list){
        return list.map((item, inx) => {
            return (
                <a
                    key={inx}
                    onClick={this.onClick.bind(this, item)}
                >
                    <div className="main-slider">
                        <div className="img-area">
                            {this.renderImage(item)}
                        </div>
                        <div className="text-area">
                            <Flex direction="column" align="start" >
                                <Flex.Item className="category">
                                    {service.getValue(item, 'categoryName', '')}
                                </Flex.Item>
                                <Flex.Item className="title">
                                    {service.getValue(item, 'title', '')}
                                </Flex.Item>
                                <Flex.Item className="contents">
                                    {service.getValue(item, 'contents', '')}
                                </Flex.Item>
                                {this.renderProgressBar(item)}
                                <Flex.Item>
                                    <span className="link" onClick={this.onClick.bind(this, item)}>기부하기</span>
                                </Flex.Item>
                            </Flex>
                        </div>
                    </div>
                </a>
            )
        })
    }

    renderItem(list){
        return list.map((item, inx) => {
            return (
                <div key={inx} onClick={this.onClick.bind(this, item)}>
                    {this.renderImage(item)}
                </div>
                )
            });
    }

    onTouchStart(e){
        e && e.stopPropagation();
    }

    render() {
        const { list = [], autoplay = true, path = false} = this.props;
        const isMain = path === 'main' ? true : false;
        // TEMP:
        const newList = list.slice(0, 3);

        return (
            <div className="common-slider" onTouchMove={this.onTouchStart.bind(this)}>
                <DesktopLayout>
                    <WebCarousel
                        ref="webCarousel"
                        autoplay={autoplay}
                        dots={isMain}
                        effect={isMain ? 'fade' : 'scrollx'}
                    >
                        {isMain ? this.renderMainItem(newList) : this.renderItem(newList)}
                    </WebCarousel>
                    {list.length > 1 ? (<ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>) : null }
                </DesktopLayout>
                <MobileLayout>
                    <MobileCarousel
                        className={`${path === 'main' ? 'main' : '' }`}
                        autoplay={false}
                        infinite
                        dots={list.length > 1 ? true : false}
                    >
                        {list.map((item, inx) => {
                            return (
                                <div
                                    style={{cursor:'pointer'}}
                                    key={inx}
                                    onClick={this.onClick.bind(this, item)}
                                >
                                    {this.renderImage(item, { width: '100%', verticalAlign: 'top', minHeight : 220})}
                                    {isMain
                                        ? (
                                            <Flex className="text-area" justify="between" >
                                                <Flex.Item className="title">
                                                    <p>{`${service.getValue(item, 'title', '')}`}</p>
                                                </Flex.Item>
                                                <Flex.Item className="link">
                                                    <span>기부하기</span>
                                                </Flex.Item>
                                            </Flex>
                                        )
                                        : null
                                    }
                                </div>
                            );
                        })}
                    </MobileCarousel>
                </MobileLayout>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(CommonSlider);
