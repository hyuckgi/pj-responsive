import React from 'react';

import { service } from '../../commons/configs';
import { User, Sponsor } from './';

class RankContainer extends React.Component {

    render() {
        const { match } = this.props;
        const type = service.getValue(match, 'params.type', false);

        return type && type === 'sponsor' ? (<Sponsor />) : (<User />)
    }

}

export default RankContainer;
