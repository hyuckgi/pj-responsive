import React from 'react';

import { service } from '../../commons/configs';
import { SettingTop } from './';

class SettingContainer extends React.Component {

    render() {
        const type = service.getValue(this.props, 'match.params.type', false);

        if(!type){
            return;
        }

        return (
            <div className="list-wrapper">
                <SettingTop type={type}/>
            </div>
        );
    }
}

export default SettingContainer;
