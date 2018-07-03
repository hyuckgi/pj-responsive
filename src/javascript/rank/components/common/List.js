import React from 'react';

import { DesktopLayout, MobileLayout } from '../../../commons/components';
import { Table } from 'antd';

class List extends React.Component {

    getRowKey(record){
        return record.key;
    }

    onChange(...args) {
        // TODO 서버의 리스트 스키마가 변경되면 리스트 갯수맞추기 다시 해야됨
        console.log("onChange", args);
        // const limit = pagination.pageSize;
        // const params = {limit, offset: (pagination.current - 1) * limit};
        // this.search(params);
    }

    render() {
        const { data, columns, currentPage } = this.props;
        const { list, pagination } = data;
        pagination.current = currentPage || 1;

        return (
            <div className="rank-list">
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

export default List;
