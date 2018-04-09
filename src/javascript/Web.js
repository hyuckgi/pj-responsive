import React from 'react';
import { DatePicker } from 'antd';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;



class Web extends React.Component {

    onChange(date, dateString) {
      console.log(date, dateString);
    }

    render() {
        return (
            <div>
                <DatePicker onChange={this.onChange} />
            </div>
        );
    }

}

export default Web;
