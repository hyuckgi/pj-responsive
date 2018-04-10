import '../stylesheet/mobile.less';
import React from 'react';
import { DatePicker, List } from 'antd-mobile';

const maxDate = new Date(2018, 11, 3, 22, 0);
const minDate = new Date(2015, 7, 6, 8, 30);

class Mobile extends React.Component {

    render() {
        return (
            <div className="mobile-container">
                Mobile
            </div>
        );
    }

}

export default Mobile;
