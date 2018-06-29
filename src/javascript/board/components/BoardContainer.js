import React from 'react';

import { service } from '../../commons/configs';
import { EventList, NoticeList } from './';

class BoardContainer extends React.Component {

    render() {
        const { match } = this.props;
        const type = service.getValue(match, 'params.type', false);

        return type && type === 'event' ? (<EventList />) : (<NoticeList />)
    }

}

export default BoardContainer;
