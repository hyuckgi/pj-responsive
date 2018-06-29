import React from 'react';
import { connect } from 'react-redux';

import { fetch } from '../redux/actions';

import { api, service } from '../commons/configs';

import { RankTop, RankList } from './';

const mapStateToProps = ({fetch}) => {
    const ranks = service.getValue(fetch, 'multipleList.sponsorRanks.data', {});

    return {
        ranks
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});

class Sponsor extends React.Component {

    constructor(props) {
        super(props);

        this.getRank = this.getRank.bind(this);
    }

    componentDidMount() {
        this.getRank();
    }

    getRank(){
        return this.props.multipleList([{id : 'sponsorRanks', url : api.getRank(), params : {}}])
    }

    render() {
        const { ranks } = this.props;

        return (
            <div className="rank-wrapper user-rank-wrapper">
                {Object.keys(ranks).length > 0 &&  (<RankTop item={ranks}/>)}
                <RankList from={'user'}/>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(Sponsor);
