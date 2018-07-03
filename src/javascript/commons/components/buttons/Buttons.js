import React from 'react';

import { Button } from 'antd-mobile';

class Buttons extends React.Component {

    onClickButton(item, e){
        e.preventDefault();
        return this.props.onClickButton(item.id);
    }

    render() {
        const { buttons } = this.props;

        return buttons.map((item, idx) => {
            return (
                <Button
                    key={idx}
                    type={item.type || 'primary'}
                    size={item.size || 'small'}
                    inline={item.inline || true}
                    onClick={this.onClickButton.bind(this, item)}
                    {...item}
                >{item.label}</Button>
            );
        });
    }

}

export default Buttons;
