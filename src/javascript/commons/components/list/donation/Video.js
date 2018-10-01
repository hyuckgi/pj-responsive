import React from 'react';

import { Player, BigPlayButton } from 'video-react';
import { service } from '../../../configs';

class Video extends React.Component {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onStart = this.onStart.bind(this);

    }

    componentDidMount() {
        this.refs.player.subscribeToStateChange(this.onChange);
    }

    onChange(state, prevState){
        this.setState({
            player : state,
        });
    }

    onStart(){
        const { onEvents } = this.props;

        if(onEvents){
            onEvents({
                events : 'start',
            })
        }
    }

    onEnded(){
        const { onEvents } = this.props;

        if(onEvents){
            onEvents({
                events : 'ended',
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { player } = this.state;

        if(service.getValue(prevState, 'player.hasStarted', false) !== service.getValue(player, 'hasStarted', false)){
            this.onStart();
        }

        if(service.getValue(prevState, 'player.ended', false) !== service.getValue(player, 'ended', false)){
            this.onEnded();
        }
    }

    render() {
        const { src } = this.props;

        return (
            <Player
                ref={'player'}
                playsInline={true}
                autoPlay={true}
            >
                <source src={src} />
                <BigPlayButton position="center" />
            </Player>
        );
    }

}

export default Video;
