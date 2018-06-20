import React from 'react';

import { service } from '../../commons/configs';
import { CustomIcon } from '../../commons/components';

class StoryTop extends React.Component {

    render() {
        const { item } = this.props;
        const src = service.getValue(item, 'imageUrl', false);
        const percent = item.totalDonation !== 0
            ? service.toPercentage(item.goalDonation / item.totalDonation)
            : '0%'

        return (
            <div className="story-top" style={{backgroundImage : src ? `url(${src})` : 'none'}}>
                {src ? <div className="overlay"></div> : null}
                <div className="top-contents">
                    <h2>{item.title}</h2>
                    <p><CustomIcon type="MdMonetizationOn" />{service.amount(item.totalDonation)}원 / {percent}</p>
                    <p><CustomIcon type="MdFlag" />{service.amount(item.goalDonation)}원</p>
                </div>
            </div>
        );
    }

}

export default StoryTop;
