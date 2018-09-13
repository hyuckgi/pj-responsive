import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import { service } from '../../configs';
import { DesktopLayout, MobileLayout } from '../';

import { Table } from 'antd';

class TableList extends React.Component {

    getRowKey(record){
        return record.key;
    }

    onChange(pagination) {
        // TODO 서버의 리스트 스키마가 변경되면 리스트 갯수맞추기 다시 해야됨
        console.log("pagination", pagination);
        const { onEvent } = this.props;
        const size = pagination.pageSize;
        const params = {size, page: pagination.current};

        if(onEvent){
            onEvent({
                events : 'change',
                payload : params
            })
        }
    }

    render() {
        const { data, columns, size, className } = this.props;
        const { list, pagination } = data;

        console.log("this.props", this.props);

        return (
            <div className={className}>
                <DesktopLayout>
                    <Table
                        size={size}
                        columns={columns}
                        dataSource={list}
                        pagination={pagination}
                        rowKey={this.getRowKey}
                        onChange={this.onChange.bind(this)}
                    />
                </DesktopLayout>
                <MobileLayout>
                    mobile...wait
                </MobileLayout>
            </div>
        );
    }

}

TableList.propTypes = {
    size : PropTypes.string,
    className : PropTypes.string,
};

TableList.defaultProps = {
    size : 'middle',
    className : 'table-list',
};


export default withRouter(TableList);
