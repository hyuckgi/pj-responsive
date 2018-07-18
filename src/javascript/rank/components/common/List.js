import React from 'react';
import { withRouter } from 'react-router';

import { service } from '../../../commons/configs';
import { DesktopLayout, MobileLayout } from '../../../commons/components';

import { Table, Select } from 'antd';
import { Flex } from 'antd-mobile';


const Option = Select.Option;

class List extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectValue : '전체'
        };

        this.onSelect = this.onSelect.bind(this);
    }

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

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.location.pathname !== this.props.location.pathname){
            this.setState({
                selectValue : '전체'
            })
        }
    }

    onSelect(value){
        const { onEvent } = this.props;
        const year = value === 'all' ? null : value;

        this.setState({
            selectValue : value
        })

        if(onEvent){
            onEvent({
                events : 'year',
                payload : {year : year}
            });
        }
    }

    renderSelect(){
        const { selectOptions } = this.props;
        const { selectValue } = this.state;
        const options = selectOptions || service.makeYearOption();

        return (
            <Select
                ref='select'
                value={selectValue}
                onSelect={this.onSelect}
                style={{ minWidth: 150 }}
            >
                {options.map((item, inx) => {
                    return (
                        <Option
                            key={item.value}
                            title={item.label}
                            value={item.value}
                        >{item.label}</Option>
                    )
                })}
            </Select>
        )
    }

    render() {
        const { data, columns, title, size } = this.props;
        const { list, pagination } = data;

        return (
            <div className="rank-list">
                <Flex justify="between" className="rank-list-top">
                    <Flex.Item >
                        <h3>{title} {data.total > 0 && `(${data.total} 건)`}</h3>
                    </Flex.Item>
                    <Flex.Item style={{textAlign : 'right'}}>
                        {this.renderSelect()}
                    </Flex.Item>
                </Flex>
                <DesktopLayout>
                    <Table
                        size={size || 'middle'}
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

export default withRouter(List);
