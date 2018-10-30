import React from 'react';
import { List } from 'antd-mobile';
import { service } from '../../../configs';

const Item = List.Item;

class ListItem extends React.Component {

    render() {
        const { columns, item } = this.props;
        console.log("columns", columns);

        return (
            <Item wrap multipleLine>
                {columns.map((col, idx) => {
                    const key = service.getValue(col, 'dataIndex', false);
                    if(key === 'imageUrl' || key === 'thumbnailUrl'){
                        return (<img key={idx} src={item[key]} alt={col.title}/>)
                    }
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
