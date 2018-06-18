import React from 'react';
import { connect } from 'react-redux';

import { ItemList, ListTop } from '../../commons/components/item';

import { fetch } from '../../redux/actions';
import { service, values, api } from '../../commons/configs';

import { WhiteSpace } from 'antd-mobile';

const mapStateToProps = ({fetch}) => {
    const stories = service.getValue(fetch, 'multipleList.stories', {});

    return {
        stories
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});

class StoryList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            order : 0,
            page : 1,
            size : 10
        }

        this.getList = this.getList.bind(this);
        this.onChangeParams = this.onChangeParams.bind(this);
    }

    componentDidMount() {
        return this.getList();
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.match.params.type !== this.props.match.params.type){
            this.getList();
        }
        if(prevProps.match.params.categoryNo !== this.props.match.params.categoryNo){
            this.getList();
        }

        if(prevState !== this.state){
            this.getList();
        }
    }

    onChangeParams(params){
        this.setState({
            ...this.state,
            ...params,
        });
    }

    getList(){
        const { match } = this.props;
        const { order, page, size } = this.state;

        const type = service.getValue(match, 'params.type', 'all');
        const categoryNo = service.getValue(match, 'params.categoryNo', 0);
        const current = service.getValue(values,  'story.status')
            .filter(item => item.path === type)
            .find(item => item);

        console.log("categoryNo", categoryNo);
        const obj = api.getList(
            {status : current.status, order : order},
            page,
            size,
            parseInt(categoryNo, 10)
        );

        console.log("obj", obj);

        return this.props.multipleList([
            {id : 'stories', url : obj.url, params : obj.params }
        ]);
    }

    render() {
        const { stories } = this.props;
        const { order } = this.state;

        return (
            <div className='story-list-wrapper'>
                <WhiteSpace size="xl" />
                <ListTop order={order} onChange={this.onChangeParams}/>
                <ItemList count={4} data={stories} />
            </div>

        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(StoryList);
