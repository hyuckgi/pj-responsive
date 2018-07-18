import React from 'react';

import { EventList, NoticeList } from './';

import { service } from '../../../commons/configs';

class BoardListContainer extends React.Component {

    renderList(){
        const type = service.getValue(this.props, 'match.params.type', false);

        if(!type){
            return;
        }

        switch (type) {
            case 'event':
                return (<EventList type={type}/>);
            case 'notice':
                return (<NoticeList type={type}/>);
            default:
                break;
        }
    }

    render() {
        return (
            <div className="board-list-container">
                {this.renderList()}
            </div>
        );
    }

}

export default BoardListContainer;
