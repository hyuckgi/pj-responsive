import React from 'react';

import { service } from '../../../commons/configs';
import { User, Sponsor } from './';

class RankItemContainer extends React.Component {

    render() {
        const { match } = this.props;
        const type = service.getValue(match, 'params.mode', false);

        return type && type === 'sponsor' ? (<Sponsor type={type} />) : (<User type={type} />)
    }

}

export default RankItemContainer;
