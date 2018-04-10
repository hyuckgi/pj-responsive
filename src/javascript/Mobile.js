import React from 'react';
import { DatePicker, List } from 'antd-mobile';

const maxDate = new Date(2018, 11, 3, 22, 0);
const minDate = new Date(2015, 7, 6, 8, 30);

class App extends React.Component {

    render() {
        return (
            <DatePicker
                mode="date"
                title="Select date"
                minDate={minDate}
                maxDate={maxDate}
            >
                <List.Item arrow="horizontal">datePicker</List.Item>
            </DatePicker>
        );
    }

}

export default App;
