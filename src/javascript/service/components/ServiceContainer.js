import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { service } from '../../commons/configs';

import { RuleContainer, Faq, Qna, ServiceTop } from './';

class ServiceContainer extends React.Component {

    render() {
        const type = service.getValue(this.props, 'match.params.type', false);
        console.log("this.props", this.props);

        return (
            <div className="service-container">
                <ServiceTop />
                <Switch>
                    <Route path="/service/cs/qna" component={Qna} />
                    <Route path="/service/cs/faq" component={Faq} />
                    <Route path="/service/rules/:page" component={RuleContainer} />
                </Switch>
            </div>
        );
    }

}

export default ServiceContainer;
