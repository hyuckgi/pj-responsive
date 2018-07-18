import React from 'react';
import { ServiceTop } from '../common';

class RuleContainer extends React.Component {

    render() {
        const { type } = this.props;

        return (
            <div className='rules-wrapper'>
                <ServiceTop type={type} />
            </div>
        );
    }

}

export default RuleContainer;
