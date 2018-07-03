import React from 'react';

import { service, api } from '../../configs';

class Report extends React.Component {

    render() {
        const { item } = this.props;

        console.log("item", item);

        return (
            <div>신고하기</div>
        );
    }

}

export default Report;
