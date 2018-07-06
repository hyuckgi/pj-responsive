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
    const event = service.getValue(fetch, 'multipleList.eventList', false);
    const eventList = service.getValue(event, 'list', []);

    const notice = service.getValue(fetch, 'multipleList.noticeList', false);
    const noticeList = service.getValue(notice, 'list', []);

    const isFetching = service.getValue(fetch, 'isFetching', false);

    return {
        event,
        eventList,
        notice,
        noticeList,
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
            status : 'all',
            dataSource : dataSource,
            boardId : '',
            size : 7,
            page : 1,
        };

        this.renderRow = this.renderRow.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.onEndReached = this.onEndReached.bind(this);
        this.getList = this.getList.bind(this);
    }

    componentDidMount() {
        const type = service.getValue(this.props, 'match.params.type', false);
        if(type){
            return this.setState({
                type : type
            }, () => {
                return this.getList();
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const type = service.getValue(this.props, 'match.params.type', false);

        if(type && prevProps.match.params.type !== type){
            return this.setState({
                type : type
            }, () => {
                return this.getList();
            })
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const type = service.getValue(this.props, 'match.params.type', false);
        const list = type && `${type}List`

        if (this.props[list].length !== nextProps[list].length){
            return this.setState({
                dataSource: this.state.dataSource.cloneWithRows(nextProps[list])
            });
        }
    }

    getList(){
        const { status, page, size, type } = this.state;
        const url = type === 'event' ? api.getEventList({status, page, size}) : api.getNoticeList({page, size});

        return this.props.multipleList([{id : `${type}List`, url : url, params : {} }])
            .then(() => {
                const total = service.getValue(this.props, `${type}.totalPage`, 1);
                const current = service.getValue(this.props, `${type}.page`, 1);
                const hasMore = total > current ? true : false;

                return this.setState({
                    hasMore
                });
            });
    }

    renderRow(rowData, sectionID, rowID){
        const { type } = this.state;

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
        const { type } = this.state;
        const title = type && type === 'event' ? '이벤트 리스트' : '공지사항 리스트'

        return(
            <List.Item>
                <Badge text={11}>{title}</Badge>
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
        const { dataSource, type } = this.state;

        return (
            <div className={`board-wrapper ${type}-board-wrapper`} >
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
