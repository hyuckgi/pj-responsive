import React from 'react';

import { ServiceTop } from '../common';

class CsContainer extends React.Component {

    render() {
        const { type } = this.props;

        return (
            <div className='cs-wrapper'>
                <ServiceTop type={type} />
            </div>
        );
    }

}

export default CsContainer;
