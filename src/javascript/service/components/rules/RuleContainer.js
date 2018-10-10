import React from 'react';
import { connect } from 'react-redux';

import { fetch } from '../../../redux/actions';
import { service, api } from '../../../commons/configs';
import { CommonEditor} from '../../../commons/components';

const list = [
    { key : "4020100", name : '이용약관'},
    { key : "4020200", name : '개인정보보호'},
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
        const { rule, id } = this.props;
        const current = list.filter(item => item.key === id).find(item => item);

        return rule.filter(item => item.title === current.name).find(item => item);
    }

    render() {
        const current = this.getCurrent();

        return (
            <div className="rule-wrapper">
                <p className="title">{service.getValue(current, 'title', '')}</p>
                <CommonEditor value={service.getValue(current, 'terms', '')} readOnly={true}/>
            </div>

        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(RuleContainer);
