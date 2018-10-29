import React from 'react';
import { List } from 'antd-mobile';
import { service } from '../../../configs';

const Item = List.Item;

class ListItem extends React.Component {

    render() {
        const { columns, item } = this.props;

        return (
            <Item wrap multipleLine>
                {columns.map((col, idx) => {
                    const key = service.getValue(col, 'dataIndex', false);
                    if(key){
                        return (<p key={idx} className="content">{`${col.title} : ${item[key]}`}</p>)
                    }
                    return '';
                })}
            </Item>
        );
    }

}

export default ListItem;
