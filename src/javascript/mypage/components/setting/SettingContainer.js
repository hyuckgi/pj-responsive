import React from 'react';

import { service } from '../../../commons/configs';


class SettingContainer extends React.Component {

    renderContainer(){
        const type = service.getValue(this.props, 'match.params.type', false);

        console.log("type", type);
        if(!type){
            return null;
        }

        // switch (type) {
        //     case 'cs':
        //         return (<CsContainer type={type}/>);
        //     case 'rules':
        //         return (<RuleContainer type={type}/>);
        //     default:
        //         break;
        // }
    }

    render() {
        return (
            <div className="setting-wrapper">
                setting
                {this.renderContainer()}
            </div>
        );
    }

}

export default SettingContainer;
