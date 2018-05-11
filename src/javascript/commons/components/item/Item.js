import React from 'react';

import { DesktopLayout, MobileLayout } from '../response';

import { Card as WebCard, Col } from 'antd';
import { Card as MobileCard, WingBlank, WhiteSpace } from 'antd-mobile';


import { values, service } from '../../configs';


class Item extends React.Component {

    constructor(props) {
        super(props);

        // this.onClick = this.onClick.bind(this);
    }

    onClick(item, e){
        e.preventDefault();
        console.log('onClick', item );
    }

    render() {
        const { item, platform } = this.props;

        if(platform === values.platform.PC){
            return(
                <div className="item" onClick={this.onClick.bind(this, item)}>
                     <WebCard
                        hoverable

                        cover={<img alt={item.title} src={item.src}/>}
                    >
                        <WebCard.Meta
                            title={item.title}
                            description={item.descript}
                        />
                    </WebCard>
                </div>
            )
        }
        return(
            <WingBlank size="sm" >
                <WhiteSpace size="lg" />
                <MobileCard
                    onClick={this.onClick.bind(this, item)}
                >
                    <MobileCard.Header
                        title={item.title}
                        thumb={item.src}
                        extra={<span>extra</span>}
                    />
                    <MobileCard.Body>
                        <div>{item.descript}</div>
                    </MobileCard.Body>
                    <MobileCard.Footer content="footer" extra={<span>footer ds</span>}/>
                </MobileCard>
                <WhiteSpace size="lg" />
            </WingBlank>
        )
    }

}

export default Item;
