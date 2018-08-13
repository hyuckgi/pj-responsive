import React from 'react';
import { connect } from 'react-redux';

import { fetch } from '../../../redux/actions';

import { api, service } from '../../../commons/configs';

import { List, ListView , Icon, Badge } from 'antd-mobile';

import { ListItem } from './';

const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});

const mapStateToProps = ({fetch}) => {
    const event = service.getValue(fetch, 'multipleList.event', false);
    const isFetching = service.getValue(fetch, 'isFetching', false);

    return {
        event,
        isFetching
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});


class EventList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            status : 'going',
            dataSource : dataSource,
            size : 10,
            page : 1,
            hasMore : false,
        };

        this.renderRow = this.renderRow.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.onEndReached = this.onEndReached.bind(this);
        this.getList = this.getList.bind(this);
    }

    componentDidMount() {
        this.getList();
    }

    componentWillReceiveProps(nextProps) {
        const nextList = service.getValue(nextProps, 'event.list', []);

        return this.setState({
            dataSource: this.state.dataSource.cloneWithRows(nextList)
        });
    }

    getList(){
        const { status, page, size } = this.state;

        return this.props.multipleList([{id : `event`, url : api.getEventList({status, page, size}), params : {} }])
            .then(() => {
                const total = service.getValue(this.props, `event.totalSize`, 1);
                const current = service.getValue(this.props, `event.list`, []);
                const hasMore = total > current.length ? true : false;

                return this.setState({
                    hasMore
                });
            });
    }

    renderRow(rowData, sectionID, rowID){
        const { type } = this.props;

        return(
            <ListItem item={rowData} type={type}/>
        );
    }

    onEndReached(e){
        console.log("onEndReached");
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

    renderHeader(){
        return(
            <List.Item>
                <Badge text={11}>이벤트 리스트</Badge>
            </List.Item>
        );
    }

    renderFooter(){
        const { isFetching } = this.props;

        return(
            <div className="footer">
                {isFetching ? (<Icon  type="loading" />) : null}
            </div>
        );
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
            <div className={`board-wrapper event-board-wrapper`} >
                <ListView
                    initialListSize={5}
                    dataSource={dataSource}
                    className="board-list"
                    pageSize={4}
                    scrollRenderAheadDistance={500}
                    useBodyScroll={true}
                    onEndReachedThreshold={200}
                    onEndReached={this.onEndReached}
                    renderHeader={this.renderHeader}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    renderFooter={this.renderFooter}
                    delayTime={10}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchProps)(EventList);
