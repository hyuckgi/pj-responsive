import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import { DesktopLayout, MobileLayout } from '../../';
import { service } from '../../../configs';

import { Table } from 'antd';
import { ListView , Icon } from 'antd-mobile';

import { ListItem } from './';


class TableList extends React.Component {

    constructor(props) {
        super(props);

        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.state = {
            dataSource : dataSource,
            hasMore : true,
            loading : false,
            height: 400,
        };

        this.renderRow = this.renderRow.bind(this);
        this.renderFooter = this.renderFooter.bind(this);

        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onEndReached = this.onEndReached.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState){
        const nextData = service.getValue(nextProps, 'data', false);

        if(nextData && service.getValue(prevState, 'dataSource._cachedRowCount', 0) !== service.getValue(nextData, 'list.length', 0)){
            const hasMore = nextData.list.length < nextData.total;

            return {
                dataSource: prevState.dataSource.cloneWithRows(nextData.list),
                hasMore,
                loading : false,
            };
        }else{
            return {
                loading : false,
            };
        }
    }

    getRowKey(record){
        return record.key;
    }

    onChange(pagination) {
        const { onEvents } = this.props;
        const size = pagination.pageSize;
        const params = {size, page: pagination.current};

        if(onEvents){
            onEvents({
                events : 'change',
                payload : params
            })
        }
    }

    onClick(e){
        e && e.preventDefault();

        const { data, onEvents, defaultSize } = this.props;
        const size = service.getValue(data, 'pagination.pageSize', 10);

        if(onEvents){
            onEvents({
                events : 'change',
                payload : {size : size + defaultSize, page : 1}
            })
        };
    }

    renderSeparator(sectionID, rowID){
        return(
            <div
                className="separator"
                key={`${sectionID}-${rowID}`}
            />
        );
    }

    renderRow(rowData, sectionID, rowID){
        const { columns } = this.props;

        return(
            <ListItem item={rowData} columns={columns} />
        );
    }

    renderFooter(){
        const { loading } = this.state;

        return (
            <div className="footer">
                {loading ? (<Icon  type="loading" />) : null}
            </div>
        )
    }

    onEndReached(e){
        e && e.preventDefault();
        const { onEvents, data, defaultSize } = this.props;
        const { hasMore, loading } = this.state;
        const size = service.getValue(data, 'pagination.pageSize', 10);

        if (loading || !hasMore) {
            return;
        }
        this.setState({
            loading: true
        }, () => {
            if(onEvents){
                onEvents({
                    events : 'change',
                    payload : {size : size + defaultSize, page : 1}
                })
            };
        });
    }

    render() {
        const { data, columns, size = 'middle'} = this.props;
        const { list, pagination } = data;
        const { dataSource, height } = this.state;

        return (
            <div className="table-list">
                <DesktopLayout>
                    <Table
                        size={size}
                        columns={columns}
                        dataSource={list}
                        pagination={pagination}
                        rowKey={this.getRowKey}
                        onChange={this.onChange}
                    />
                </DesktopLayout>
                <MobileLayout>
                    <ListView
                        ref='view'
                        pageSize={4}
                        style={{
                            height: height,
                            overflow: 'auto',
                        }}
                        dataSource={dataSource}
                        scrollRenderAheadDistance={500}
                        onEndReachedThreshold={10}
                        renderRow={this.renderRow}
                        onEndReached={this.onEndReached}
                        renderSeparator={this.renderSeparator}
                        renderFooter={this.renderFooter}
                    />
                </MobileLayout>
            </div>
        );
    }

}

TableList.propTypes = {
    size : PropTypes.string,
};

TableList.defaultProps = {
    size : 'middle',
};


export default withRouter(TableList);
