import React from 'react';


import { RuleContainer, CsContainer } from './';
import { service } from '../../commons/configs';

class ServiceContainer extends React.Component {

    renderContainer(){
        const type = service.getValue(this.props, 'match.params.type', false);

        if(!type){
            return;
        }

        switch (type) {
            case 'cs':
                return (<CsContainer type={type}/>);
            case 'rules':
                return (<RuleContainer type={type}/>);
            default:
                break;
        }
    }

    render() {
        return (
            <div className="servie-container">
                {this.renderContainer()}
            </div>
        );
    }

}

export default ServiceContainer;
