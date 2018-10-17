import React from 'react';
import { Sticky } from 'react-sticky';
import { connect } from 'react-redux';

import { service, api, path } from '../../../commons/configs';
import { FooterUtil } from '../../../commons/components';

import { fetch } from '../../../redux/actions';


const mapStateToProps = ({ fetch, security }) => {
    const item = service.getValue(fetch, 'item.data', {});

    return{
        item,
    }
}

const mapDispatchProps = dispatch => ({
    getItem :(url) => dispatch(fetch.get(url)),
});

class FooterNavigation extends React.Component {

    constructor(props) {
        super(props);

        this.onEvent = this.onEvent.bind(this);
    }

    onEvent(obj){
        const { item } = this.props;
        const { payload } = obj;
        const type = service.getValue(payload, 'type', false);
        if(type === 'update'){
            const itemId = service.getValue(item, 'storyNo', false);
            if(itemId){
                this.getItem(itemId);
            }
        }
    }

    getItem(id){
        return this.props.getItem(api.getStory(id))
    }

    render() {
        const { item, currentPath } = this.props;
        const flag = currentPath.indexOf(path.storyItem) === 0;

        if(flag){
            return (
                <div className="footer-navigation">
                    <Sticky topOffset={0}>
                        {({ style }) => {
                            const newStyle = {
                                ...style,
                                top: 'auto',
                                bottom : 0,
                            }
                            return(
                                <div style={{ ...newStyle, zIndex: 100 }}>
                                    <FooterUtil item={item} onEvent={this.onEvent}/>
                                </div>
                            )
                        }}
                    </Sticky>
                </div>
            );
        }
        return null;
    }

}

export default connect(mapStateToProps, mapDispatchProps)(FooterNavigation);
