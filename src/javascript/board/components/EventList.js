import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';

import { fetch } from '../../redux/actions';
import { service, values, api, path } from '../../commons/configs';

import { Flex } from 'antd-mobile';

const mapStateToProps = ({fetch}) => {
    const stories = service.getValue(fetch, 'multipleList.stories', {});

    return {
        stories
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});

class EventList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status : 'all',
            page : 1,
            size : 10,
        };
    }

    componentDidMount() {
        this.getList();
    }

    getList(){
        return this.props.multipleList([{id : 'eventList', url : api.getEventList(this.state), params : {} }]);
    }

    render() {
        return (
            <Flex className="board-wrapper event-wrapper" justify="center" direction="column" wrap="wrap">
                <Flex.Item>
                    event-wrapper
                </Flex.Item>
                <Flex.Item>
                    event-wrapper2
                </Flex.Item>
            </Flex>
        );
    }

}

export default withRouter(connect(mapStateToProps, mapDispatchProps)(EventList));
