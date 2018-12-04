import React from 'react';

import { service } from '../../../commons/configs';

class StoryTop extends React.Component {

    render() {
        const { item } = this.props;
        const src = service.getValue(item, 'imageUrl', false);

        return (
            <div className="story-top" style={{backgroundImage : src ? `url(${src})` : 'none'}}>
                {src ? <div className="overlay"></div> : null}
            </div>
        );
    }

}

export default StoryTop;
