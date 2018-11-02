import React from 'react';

import { SearchBar, Toast } from 'antd-mobile';
import { Input } from 'antd';

import { DesktopLayout, MobileLayout } from '../../commons/components';


const Search = Input.Search;

class SearchBox extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value : '',
        }

        this.onCancel = this.onCancel.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(value){
        this.setState({
            value
        })
    }

    onCancel(){
        this.setState({
            value : '',
        })
    }

    onSubmit(value){
        console.log("value", value);

        if(!value){
            return Toast.fail('검색어를 입력하세요.', 1);
        }

        const { onEvents } = this.props;

        if(value && onEvents){
            onEvents({
                events : 'search',
                payload : { keyword : value }
            });
        }
    }

    render() {
        const { value } = this.state;

        return (
            <div className="search-box-area">
                <DesktopLayout>
                    <Search
                        placeholder="Search"
                        onSearch={this.onSubmit}
                        enterButton={true}
                        size="large"
                    />
                </DesktopLayout>
                <MobileLayout>
                    <SearchBar
                        value={value}
                        ref={ref => this.manualFocusInst = ref}
                        placeholder="Search"
                        onSubmit={this.onSubmit}
                        onCancel={this.onCancel}
                        cancelText={'Cancel'}
                        onChange={this.onChange}
                    />
                </MobileLayout>
            </div>
        );
    }

}

export default SearchBox;
