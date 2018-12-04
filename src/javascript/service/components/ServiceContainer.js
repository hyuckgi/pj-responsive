import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { service } from '../../commons/configs';

import { RuleContainer, Faq, Qna, ServiceTop, CompanyContainer } from './';

class ServiceContainer extends React.Component {

    render() {
        const { match } = this.props;
        const type = service.getValue(match, 'params.type', 'cs');

        return (
            <div className="service-container">
                {type !== 'company' ? (<ServiceTop />) : null}
                <Switch>
                    <Route path="/service/cs/qna" component={Qna} />
                    <Route path="/service/cs/faq" component={Faq} />
                    <Route path="/service/rules/:page" component={RuleContainer} />
                    <Route path="/service/company/:page" component={CompanyContainer} />
                </Switch>
            </div>
        );
    }

}

export default ServiceContainer;
