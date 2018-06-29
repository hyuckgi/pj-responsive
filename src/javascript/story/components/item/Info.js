import React from 'react';

import { service } from '../../../commons/configs';

import { Tag } from 'antd';



class Info extends React.Component {

    constructor(props) {
        super(props);

        this.renderInfo = this.renderInfo.bind(this);
    }

    renderHash(hashs){
        if(!hashs.length){
            return;
        }
        return hashs.map((item, inx) => {
            return (<Tag key={inx} color="cyan">{item.tag}</Tag>)
        })
    }


    renderInfo(){
        const { item } = this.props;

        if(!Object.keys(item).length){
            return
        }

        const hashs = service.getValue(item, 'hashtagList', []);

        return(
            <div className="story-info">
                <h2>{item.categoryName}</h2>
                <div className="hash-area">
                    {this.renderHash(hashs)}
                </div>
                <div className="info-detail">
                    <p className="user-name">{item.username}</p>
                    <p>모금기간 : 데이터없음</p>
                    <p>사업기간 : 데이터없음</p>
                    <p>모금후기 : 데이터없음</p>

                    <div className="total-price">
                        <h3>총 모금액</h3>
                        <h3 className="price">{service.amount(service.getValue(item, 'totalDonation', 0))}원</h3>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="story-info-wrapper">
                {this.renderInfo()}
            </div>
        );
    }

}

export default Info;
