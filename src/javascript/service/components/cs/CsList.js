import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { fetch } from '../../../redux/actions';
import { service, api } from '../../../commons/configs';

import { ListView , Icon, Accordion } from 'antd-mobile';

const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});

const mapStateToProps = ({fetch}) => {
    const csObj = service.getValue(fetch, 'multipleList.csObj', {});
    const isFetching = service.getValue(fetch, 'isFetching', false);

    return {
        csObj,
        isFetching
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});

class CsList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            page : 1,
            size : 10,
            dataSource : dataSource,
            hasMore : false,
        }

        this.renderRow = this.renderRow.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.onEndReached = this.onEndReached.bind(this);
        this.getList = this.getList.bind(this);
    }

    componentDidMount() {
        this.getList();
    }

    componentWillReceiveProps(nextProps) {
        const nextList = service.getValue(nextProps, 'csObj.list', []);
        // console.log('nextList', nextList);

        return this.setState({
            dataSource: this.state.dataSource.cloneWithRows(nextList)
        });
    }

    getList(){
        const { page, size } = this.state;

        return this.props.multipleList([{id : 'csObj', url : api.getCslist({page, size}), params : {}}])
        .then(() => {
            const total = service.getValue(this.props, `csObj.totalSize`, 1);
            const current = service.getValue(this.props, `csObj.list`, []);
            const hasMore = total > current.length ? true : false;

            return this.setState({
                hasMore
            });
        });
    }

    renderRow(rowData, sectionID, rowID){
        return (
            <Accordion>
                <Accordion.Panel header={rowData.title}>
                    <div>{rowData.content}</div>
                </Accordion.Panel>
            </Accordion>
        )
    }

    renderFooter(){
        const { isFetching } = this.props;

        return(
            <div className="footer">
                {isFetching ? (<Icon  type="loading" />) : null}
            </div>
        );
    }

    onEndReached(e){
        const { hasMore } = this.state;
        const { isFetching } = this.props;

        if (isFetching || !hasMore) {
            return;
        }

        return this.setState(prevState => {
            return {
                page : prevState.page =+ 1,
            }
        }, () => {
            return this.getList();
        });
    }

    renderSeparator(sectionID, rowID){
        return(
            <div
                className="separator"
                key={`${sectionID}-${rowID}`}
            />
        );
    }

    render() {
        const { dataSource } = this.state;

        return (
            <div className="cs-list-wrapper">
                <ListView
                    initialListSize={5}
                    dataSource={dataSource}
                    className="cs-list"
                    pageSize={4}
                    scrollRenderAheadDistance={500}
                    useBodyScroll={true}
                    onEndReachedThreshold={200}
                    onEndReached={this.onEndReached}
                    renderHeader={() => (<span>서비스 이용 문의</span>)}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    renderFooter={this.renderFooter}
                    delayTime={10}
                />
            </div>
        );
    }

}

export default withRouter(connect(mapStateToProps, mapDispatchProps)(CsList));
