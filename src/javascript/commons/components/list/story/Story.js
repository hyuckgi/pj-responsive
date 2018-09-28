import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Card, Progress } from 'antd';

import { service, path } from '../../../configs';

import { BlankImage } from '../../';

const mapStateToProps = ({layout, router}) => {
    const pathname = service.getValue(router, 'location.pathname', false);

    return {
        pathname
    }
};

const mapDispatchProps = dispatch => ({
    move: (location) => dispatch(push(location)),
});

class Story extends React.Component {

    constructor(props) {
        super(props);

        this.renderDescription = this.renderDescription.bind(this);
        this.renderDonation = this.renderDonation.bind(this);
        this.renderProgressBar = this.renderProgressBar.bind(this);
    }

    onClick(item, e){
        e.preventDefault();
        const { prefixUrl, prefix } = this.props;

        if(!prefixUrl){
            return;
        }

        return this.props.move(path.moveItem(prefixUrl, item[`${prefix}No`] ));
    }

    renderProgressBar(status){
        if(!status || status === 1){
            return (<div></div>);
        }

        return(
            <Progress percent={50} showInfo={false} status={status === 2 ? 'active' : 'normal'} size='small'/>
        )
    }

    renderText(status, item){

        const percent = item.totalDonation !== 0
            ? service.toPercentage(item.goalDonation / item.totalDonation)
            : '0%'

        return(
            <div className="donation-price">
                <div className="price-wrapper">
                    <p>{status === 1 ? '목표금액' : percent}</p>
                    <p>{status === 1
                        ? service.amount(service.getValue(item, 'goalDonation', 0))
                        : service.amount(service.getValue(item, 'totalDonation', 0))} 원</p>
                </div>
            </div>
        )
    }

    renderDonation(item){
        const status = service.getValue(item, 'status', false);

        return(
            <div className="donations">
                {this.renderProgressBar(status, item)}
                {this.renderText(status, item)}
            </div>
        )
    }

    renderDescription(item){
        return(
            <div className="story-descript">
                <p className="username">{service.getValue(item, 'username', '')}</p>
                {this.renderDonation(item)}
            </div>
        )
    }

    render() {
        const { item } = this.props;
        const imgSrc = service.getValue(item, 'thumbnailUrl', false);

        return(
            <div className="list-item" onClick={this.onClick.bind(this, item)}>
                 <Card
                    hoverable
                    cover={imgSrc ? <img alt={item.title} src={imgSrc} /> : <BlankImage />}
                >
                    <Card.Meta
                        title={item.title}
                        description={this.renderDescription(item)}
                    />
                </Card>
            </div>
        )
    }

}

export default connect(mapStateToProps, mapDispatchProps)(Story);
