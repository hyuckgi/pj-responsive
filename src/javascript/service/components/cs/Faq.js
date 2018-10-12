import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { fetch } from '../../../redux/actions';
import { service, api } from '../../../commons/configs';

import { Flex } from 'antd-mobile';
import { Menu, Table } from 'antd';


const columns = [
    { title: 'title', dataIndex: 'title', key: 'title' },
];

const mapStateToProps = ({fetch}) => {
    const csObj = service.getValue(fetch, 'multipleList.csObj', {});
    const list = service.getValue(csObj, 'list', []);
    const dataSource = list.length && list.map(item => {
        item['help'] = item['help'].map((inner, idx) => {
            inner = {
                ...inner,
                key : idx,
            }
            return inner;
        });
        return item;
    });

    return {
        list,
        dataSource
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});

class Faq extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            page : 1,
            size : 10,
            seletedKey : '0',
            dataSource : [],
        }

        this.getList = this.getList.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    componentDidMount() {
        this.getList();
    }

    getList(){
        const { page, size, seletedKey } = this.state;

        return this.props.multipleList([{id : 'csObj', url : api.getCslist({page, size}), params : {}}])
            .then(() => {
                const dataSource = service.getValue(this.props, `dataSource.${seletedKey}`, []);
                this.setState({
                    dataSource
                })
            })
    }

    onSelect({selectedKeys}){
        const { dataSource } = this.props;
        const key = selectedKeys[0];

        this.setState({
            seletedKey : key,
            dataSource : dataSource[key]
        });
    }

    render() {
        const { list } = this.props;
        const { seletedKey, dataSource } = this.state;

        return (
            <Flex className="faq-wrapper" align="stretch" alignContent="start">
                <Flex.Item className="faq-navigation">
                    <Menu
                        onSelect={this.onSelect}
                        defaultSelectedKeys={[seletedKey]}
                    >
                        {list.map((item, idx) => {
                            return (
                                <Menu.Item
                                    key={idx}
                                >
                                    {service.getValue(item, 'itemName', '')}
                                </Menu.Item>
                            )
                        })}
                    </Menu>
                </Flex.Item>
                <Flex.Item className="faq">
                    <Table
                        defaultExpandedRowKeys={[0]}
                        title={() => service.getValue(list[seletedKey], `itemName`, '')}
                        columns={columns}
                        showHeader={false}
                        expandedRowRender={record => <p>{record.text}</p>}
                        dataSource={dataSource['help']}
                        onExpand={this.onExpand}
                        expandRowByClick={true}
                    />
                </Flex.Item>
            </Flex>
        );
    }

}

export default withRouter(connect(mapStateToProps, mapDispatchProps)(Faq));
