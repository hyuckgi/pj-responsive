import React from 'react';

import { service } from '../../commons/configs';

import { Flex } from 'antd-mobile';
import { Tag } from 'antd';

class HashTag extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            colors : [],
        };

        this.renderTag = this.renderTag.bind(this);
        this.generateColor = this.generateColor.bind(this);
    }

    componentDidMount() {
        this.generateColor();
    }

    componentDidUpdate(prevProps, prevState) {
        if(service.getValue(prevProps, 'tags.length') !== service.getValue(this.props, 'tags.length')){
            this.generateColor();
        }
    }

    onClickTag(item, e){
        e && e.preventDefault();
        const { onEvents } = this.props;

        if(!Object.keys(item).length){
            return;
        }
        return onEvents({
            events : 'hash',
            payload : {hashtag : item.tag}
        });
    }

    generateColor () {
        const { tags } = this.props;
        const colors = tags.reduce((result, item) => {
            item = `#${Math.random().toString(16).substr(-6)}`;
            result.push(item);
            return result;
        }, []);

        return this.setState({
            colors
        });
    }

    renderTag(tags){
        const { colors } = this.state;

        return tags.map((item, idx) => {
            return (<Flex.Item key={idx} onClick={this.onClickTag.bind(this, item)}><Tag color={colors[idx]}>{`#${item.tag}`}</Tag></Flex.Item>)
        })
    }

    render() {
        const { title, tags } = this.props;
        // console.log("tags", tags);

        return (
            <Flex direction="column" wrap="wrap" className="search-wrap tag-wrap" align="stretch">
                <Flex.Item className="title">
                    {title}
                </Flex.Item>
                <Flex.Item className="list">
                    <Flex wrap="wrap">
                        {tags.length > 0 ? this.renderTag(tags) : null}
                    </Flex>
                </Flex.Item>
            </Flex>
        );
    }

}

export default HashTag;
