import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'antd/lib/icon';

class Spinner extends React.Component {

    renderSpin() {
        const {covered, size, label} = {...this.props};
        return(
            <div className={`spinning-warp ${covered ? 'spinning-full' : ''}`} >
                <div className='spin'>
                    <Icon type="loading" style={{fontSize: `${size}px` }} />
                    {label ? <p className='spinning-text' style={{fontSize: `${size - 5}px` }}>{label}</p> : null}
                </div>
            </div>
        );
    }

    render() {
        const {spinning} = {...this.props};

        return (
            <div className={`spinning ${spinning ? 'spinning-active' : ''}`}>
                {spinning ? this.renderSpin() : null}
            </div>
        );
    }
}

Spinner.defaultProps = {
    spinning : true,
    covered: true,
    size: 40,
};

Spinner.propTypes = {
    spinning: PropTypes.bool,
    covered: PropTypes.bool,
    label: PropTypes.string,
    size: PropTypes.number,
};
export default Spinner;
