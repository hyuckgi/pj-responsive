import React from 'react';

import { service } from '../../../commons/configs';
import { values } from '../../configs';

import { Row, Col } from 'antd';

class CompanyContainer extends React.Component {

    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
        this.renderHead = this.renderHead.bind(this);
        this.renderText = this.renderText.bind(this);
    }

    renderText(txt, idx = Math.random()){
        if(typeof txt === 'object'){
            return <Col key={idx}>{txt}</Col>;
        }
        return(<p className="txt" key={idx}>{txt}</p>)
    }

    renderContents(contents){
        if(!contents.length){
            return null;
        }

        return contents.map((item, idx) => {
            return this.renderText(item, idx);
        });
    }

    renderBody(body){
        const text = service.getValue(body, 'text', false);
        const subTitle = service.getValue(body, 'subTitle', false);

        return(
            <div className="company-container-body">
                {subTitle ? this.renderText(subTitle) : null}
                {text ? this.renderText(text) : null}
                {this.renderContents(service.getValue(body, 'contents', []))}
            </div>
        )
    }

    renderHead(header){
        const title = service.getValue(header, 'title', false);
        const color = service.getValue(header, 'bgColor', 'fff');

        return(
            <Row
                className="company-container-head"
                style={{backgroundColor : `rgb(${color})`}}
                align="middle"
                justify="center"
                type="flex"
            >
                {title ? this.renderText(title) : null}
            </Row>
        )
    }

    renderItem(){
        const { match } = this.props;
        const page = service.getValue(match, 'params.page', 'intro');
        const target = service.getValue(values.company, `${page}`);

        return(
            <div className={service.getMobileClassName(`company-container ${page}`)}>
                {service.getValue(target, 'header', false) ? this.renderHead(target.header) : null}
                {service.getValue(target, 'body', false) ? this.renderBody(target.body) : null}
            </div>
        )

    }


    render() {
        return this.renderItem();
    }

}

export default CompanyContainer;
