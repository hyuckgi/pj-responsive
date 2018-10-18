import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import { DesktopLayout, MobileLayout } from '../../';
import { service } from '../../../configs';

import { Table } from 'antd';
import { List, ListView , Icon, Badge } from 'antd-mobile';

const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});

class TableList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dataSource : dataSource,
            hasMore : true,
        };

        this.renderRow = this.renderRow.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.onEndReached = this.onEndReached.bind(this);

        this.onChange = this.onChange.bind(this);
    }

    // componentDidMount() {
    //     console.log("document.documentElement.clientHeight", document.documentElement.clientHeight);
    //     console.log("document.documentElement.dd", ReactDOM.findDOMNode(this.refs.listView).parentNode);
    //     console.log("hei", hei);
    //
    //     this.setState({
    //         height : hei,
    //         loading : false,
    //     });
    // }

    componentWillReceiveProps(nextProps) {
        const nextList = service.getValue(nextProps, 'data.list', []);

        return this.setState({
            dataSource: this.state.dataSource.cloneWithRows(nextList)
        });
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

    renderSeparator(sectionID, rowID){
        return(
            <div
                className="separator"
                key={`${sectionID}-${rowID}`}
            />
        );
    }

    renderRow(rowData, sectionID, rowID){
        return(
            <div>{sectionID}</div>
        );
    }

    onEndReached(e){
        console.log("onEndReached", e);
    }

    renderFooter(){
        const { hasMore } = this.state;

        return (
            <div>
                {hasMore ? (<Icon  type="loading" />) : null}
            </div>
        )
    }

    render() {
        const { data, columns, size = 'middle'} = this.props;
        const { list, pagination } = data;
        const { dataSource, hasMore } = this.state;

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
                        useBodyScroll
                        dataSource={dataSource}
                        pageSize={5}
                        renderRow={this.renderRow}
                        renderSeparator={this.renderSeparator}
                        renderFooter={this.renderFooter}
                    />
                    {hasMore ? <p className="btn-more">More</p> : null}
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
