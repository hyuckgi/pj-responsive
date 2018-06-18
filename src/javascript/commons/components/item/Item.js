import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Card as WebCard } from 'antd';
import { Card as MobileCard, WhiteSpace } from 'antd-mobile';


import { values, service } from '../../configs';

const mapStateToProps = ({layout, router}) => {
    const pathname = service.getValue(router, 'location.pathname', false);

    return {
        pathname
    }
};

const mapDispatchProps = dispatch => ({
    move: (location) => dispatch(push(location)),
});

class Item extends React.Component {

    onClick(item, e){
        e.preventDefault();
        console.log("item", item);
        const { pathname } = this.props;

        console.log("pathname", pathname);
        if(!pathname){
            return;
        }

        return this.props.move(`${pathname}/${item.id}`);
    }

    render() {
        const { item, platform } = this.props;

        console.log("item", item);

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
            <div>
                <MobileCard
                    full
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
            </div>
        )
    }

}

export default connect(mapStateToProps, mapDispatchProps)(Item);
