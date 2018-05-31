import React from 'react';
import { connect } from 'react-redux';

import Gesture from 'rc-gesture';
import { StickyContainer } from 'react-sticky';

import { Spinner, WrapperContainer, MobileWrapper } from './layout';
import { HeaderContainer } from './layout/mobile';

const mapStateToProps = ({ fetch }) => ({
    // spinning : fetch.isFetching || fetch.isPosting,

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
        const { spinning } = this.props;
        return (
            <Gesture
                direction='all'
                onSwipe = {this.onSwipe.bind(this)}
                >
                <div className="mobile-container">
                    <HeaderContainer />

                    <StickyContainer className="section">
                        <MobileWrapper {...this.props} swipeObj={this.state.swipeObj}>
                            <WrapperContainer {...this.props}/>
                        </MobileWrapper>
                    </StickyContainer>

                    <Spinner
                        toast={true}
                        tip="Loading..."
                        spinning={spinning}
                    />
                </div>
            </Gesture>
        );
    }

}

export default  connect(mapStateToProps, mapDispatchProps)(Mobile);
