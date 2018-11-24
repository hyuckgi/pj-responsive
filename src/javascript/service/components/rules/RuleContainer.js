import React from 'react';
import { connect } from 'react-redux';

import { fetch } from '../../../redux/actions';
import { service, api } from '../../../commons/configs';
import { CommonEditor} from '../../../commons/components';

const list = [
    { key : "4020100", name : '이용약관', page : 'terms'},
    { key : "4020200", name : '개인정보보호', page : 'policy'},
];

const mapStateToProps = ({fetch}) => {
    const rule = service.getValue(fetch, 'multipleList.rule.list', []);

    return {
        rule
    }
};


const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});

class RuleContainer extends React.Component {

    constructor(props) {
        super(props);

        this.getTerms = this.getTerms.bind(this);
        this.getCurrent = this.getCurrent.bind(this);
    }

    componentDidMount() {
        this.getTerms();
    }

    getTerms(){
        const { rule } = this.props;

        if(!rule.length){
            return this.props.multipleList([{id : 'rule', url : api.getTerms(), params : {}}]);
        }
    }

    getCurrent(){
        const { rule, match } = this.props;
        const current = list.filter(item => item.page === service.getValue(match, 'params.page')).find(item => item);

        console.log("current", current);

        return rule.filter(item => item.title === current.name).find(item => item);
    }

    render() {
        const current = this.getCurrent();
        console.log("this.props", this.props, current);

        return (
            <div className="rule-wrapper">
                <p className="sub-title">{service.getValue(current, 'title', '')}</p>
                <CommonEditor value={service.getValue(current, 'terms', '')} readOnly={true}/>
            </div>

        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(RuleContainer);
