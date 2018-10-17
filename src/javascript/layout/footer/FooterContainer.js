import React from 'react';
import { withRouter } from 'react-router';

import { Flex } from 'antd-mobile';
import { service, path } from '../../commons/configs';

const hideList = [path.storyItem]

class FooterContainer extends React.Component {

    render() {
        const { location } = this.props;
        const currentPath = service.getValue(location, 'pathname', '/main');
        const isHide = hideList.filter(item => currentPath.indexOf(item) === 0).find(item => item);

        if(isHide){
            return null;
        }

        return (
            <div className="footer-container">
                <Flex className="footer-wrapper">
                    <Flex.Item>footerfooterfooter</Flex.Item>
                </Flex>
            </div>

        );
    }

}

export default withRouter(FooterContainer);
