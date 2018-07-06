import React from 'react';

import { Flex } from 'antd-mobile';

class BlankImage extends React.Component {

    render() {
        return (
            <Flex className="blank-image" justify="center">
                <Flex.Item>No Image</Flex.Item>
            </Flex>
        );
    }

}

export default BlankImage;
