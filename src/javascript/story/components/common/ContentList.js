import React from 'react';

import { Content } from './';

class ContentList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            length : 1,
        };

        this.onCreate = this.onCreate.bind(this);
        this.onRemove = this.onRemove.bind(this);
    }

    onCreate(inx){
        this.setState({
            length : this.state.length + 1,
        });
    }

    onRemove(){
        this.setState({
            length : this.state.length - 1,
        });
    }

    render() {
        const { form } = this.props;
        const { length } = this.state;

        return(
            <div className="content-list-wrapper">
                {Array.from({length : length}).map((item, inx) => {
                    return (<Content key={inx} inx={inx} length={length} onCreate={this.onCreate} form={form} onRemove={this.onRemove}/>);
                })}
            </div>
        );
    }

}

export default ContentList;
