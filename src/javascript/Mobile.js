import '../stylesheet/mobile.less';

import React from 'react';
import { connect } from 'react-redux';


import Gesture from 'rc-gesture';


import { List, ActivityIndicator } from 'antd-mobile';

const mapStateToProps = ({ fetch }) => ({
    spinning : fetch.isFetching || fetch.isPosting,

});

const mapDispatchProps = dispatch => ({
    // initialize: () => dispatch(action.tag()),
});


class Mobile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            swipeObj : {},
        };

        this.onSwipe = this.onSwipe.bind(this);
    }

    componentDidMount() {
        // this.props.initialize();

    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0)
        }
    }
    onSwipe(swipeObj){
        this.setState({
            swipeObj
        });
    }

    render() {
        return (
            <Gesture
                direction='all'
                onSwipe = {this.onSwipe.bind(this)}
                >
                <div className="mobile-container">
                    <HeaderContainer />

                    <WrapperContainer {...this.props} swipeObj={this.state.swipeObj}>
                        <Wrapper {...this.props}/>
                    </WrapperContainer>

                    <FooterContainer />
                    <FooterNavigation />

                    <ActivityIndicator
                        toast
                        text="Loading..."
                        animating={this.props.spinning}
                    />
                </div>
            </Gesture>
        );
    }

}

export default Mobile;
