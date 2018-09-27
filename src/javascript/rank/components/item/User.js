import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetch } from '../../../redux/actions';

import { api, service } from '../../../commons/configs';
import { Tabs } from 'antd-mobile';

import { ItemTop } from '../common';
import DonationList from './DonationList'
import ProposeList from './ProposeList'
import MyCommentList from './MyCommentList'

const tabs = [
    {title : '기부내역', child : (<DonationList />), key : 1},
    {title : '스토리 제안', child : (<ProposeList />), key : 2},
    {title : '댓글', child : (<MyCommentList />), key : 3},
];

const mapStateToProps = ({fetch}) => {
    const item = service.getValue(fetch, 'item.data', {});

    return {
        item
    }
};

const mapDispatchProps = dispatch => ({
    getItem :(url, params) => dispatch(fetch.get(url, params)),
});

class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userNo : service.getValue(this.props, 'match.params.id', false)
        }

        this.getItem = this.getItem.bind(this);
    }

    componentDidMount() {
        const { userNo } = this.state;
        if(userNo){
            return this.getItem();
        }
    }

    getItem(){
        const { userNo } = this.state;
        const obj = api.getDonate(userNo);

        return this.props.getItem(obj.url, obj.params);
    }

    componentDidUpdate(prevProps, prevState) {
        const prevId = service.getValue(prevProps, 'match.params.id', false);
        const currentId = service.getValue(this.props, 'match.params.id', false);
        if(prevId !== currentId){
            return this.getItem(currentId);
        }
    }

    renderContent(tab){
        return React.createElement('div', {}, tab.child);
    }

    render() {
        const { item, type } = this.props;

        return (
            <div className={`rank-wrapper ${type}-detail-wrapper`}>
                {Object.keys(item).length > 0 &&  (<ItemTop item={item} type={type} />)}

                <Tabs
                    tabs={tabs}
                    initalPage={1}
                    destroyInactiveTab={true}
                    prerenderingSiblingsNumber={0}
                >
                    {this.renderContent}
                </Tabs>
            </div>
        );
    }

}

export default withRouter(connect(mapStateToProps, mapDispatchProps)(User));
