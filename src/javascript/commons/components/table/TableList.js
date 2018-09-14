import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import { DesktopLayout, MobileLayout } from '../';

import { Table } from 'antd';

class TableList extends React.Component {

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

    render() {
        const { data, columns, size } = this.props;
        const { list, pagination } = data;

        return (
            <div>
                <DesktopLayout>
                    <Table
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
};

TableList.defaultProps = {
    size : 'middle',
};


export default withRouter(TableList);
