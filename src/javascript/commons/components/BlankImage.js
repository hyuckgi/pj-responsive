import React from 'react';

import { Flex } from 'antd-mobile';
import NoImg from '../../../resource/commons/no_image_available.png';

class BlankImage extends React.Component {

    render() {
        return (
            <img src={NoImg} alt="blank-image" className="blank-image" />
        );
    }
}

export default BlankImage;
