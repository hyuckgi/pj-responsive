import React from 'react';

import NoImg from '../../../resource/commons/no_image_available.png';

class BlankImage extends React.Component {

    render() {
        return (
            <img src={NoImg} alt="blank" className="blank-image" />
        );
    }
}

export default BlankImage;
