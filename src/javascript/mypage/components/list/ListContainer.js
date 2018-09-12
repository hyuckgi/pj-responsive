import React from 'react';

import { service } from '../../../commons/configs';
import { MypageTop } from '../';

class ListContainer extends React.Component {

    render() {
        const type = service.getValue(this.props, 'match.params.type', false);

        return (
            <div className="list-wrapper">
                <MypageTop type={type}/>
            </div>
        );
    }

}

export default ListContainer;
