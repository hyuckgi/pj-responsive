import React from 'react';

import videojs from 'video.js';
import 'videojs-youtube/dist/Youtube.min.js';
import 'video.js/dist/video-js.min.css';


const defaultProps = {
    controlBar : {
        'volumePanel' : false,
        'currentTimeDisplay' : true,
        'durationDisplay' : false,
    },
    errorDisplay : false,
    techOrder : ['youtube'],
};

const eventList = [
    'ended',
    'error',
    'playing',
    'firstplay',
];

class VideoPlayer extends React.Component {

    constructor(props) {
        super(props);

        this.makeInstance = this.makeInstance.bind(this);
        this.getOptions = this.getOptions.bind(this);

        this.onChange = this.onChange.bind(this);
        this.onStart = this.onStart.bind(this);

        this.onEvents = this.onEvents.bind(this);
    }

    componentDidMount() {
        this.makeInstance();
    }

    getOptions(){
        const { url, controls = true } = this.props;

        const sources = [{
            src : `https://www.youtube.com/watch?v=${url}`,
            type : "video/youtube",
        }];

        return {
            ...defaultProps,
            autoplay : !controls,
            controls : controls,
            aspectRatio : "16:9",
            youtube : {
                ytControls : 0,
                origin : `https://${window.location.hostname}`
            },
            sources,
        }
    }

    makeInstance(){
        const { fullscreen } = this.props;

        this.player = videojs(this.refs.player, this.getOptions(), () => {
            eventList.forEach(ev => this.player.on(ev, this.onEvents));
            if(fullscreen){
                this.player.requestFullscreen();
            }
        });
    }

    onEvents(event){
        const { type } = event;

        switch (type) {
            case 'firstplay':
                return this.onStart();
            case 'ended' :
                return this.onEnded();
            default:
                break;
        }
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

    render() {
        return (
            <div className="video-wrapper">
                <div data-vjs-player>
                    <video
                        ref="player"
                        className="video-js vjs-fluid"
                    ></video>
                </div>
            </div>

        );
    }
}

export default VideoPlayer;
