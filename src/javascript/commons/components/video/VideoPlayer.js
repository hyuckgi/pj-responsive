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
    'click',
    'tap',
    'touchstart'
];

class VideoPlayer extends React.Component {

    constructor(props) {
        super(props);

        this.makeInstance = this.makeInstance.bind(this);
        this.getOptions = this.getOptions.bind(this);

        this.onChange = this.onChange.bind(this);
        this.onStart = this.onStart.bind(this);

        this.onEvents = this.onEvents.bind(this);
        this.changeFullscreen = this.changeFullscreen.bind(this);
    }

    componentDidMount() {
        this.makeInstance();
    }

    getOptions(){
        const { url, controls = true, autoplay = false } = this.props;

        const sources = [{
            src : `https://www.youtube.com/watch?v=${url}`,
            type : "video/youtube",
        }];

        return {
            ...defaultProps,
            autoplay : autoplay,
            controls : controls,
            aspectRatio : "16:9",
            youtube : {
                ytControls : 0,
                origin : `https://${window.location.hostname}`
            },
            sources,
        }
    }

    changeFullscreen(){
        const { fullscreen } = this.props;
        if(fullscreen){
            this.player.requestFullscreen();
        }
    }

    makeInstance(){
        this.player = videojs(this.refs.player, this.getOptions(), () => {
            eventList.forEach(ev => this.player.on(ev, this.onEvents));
        });
    }

    onEvents(event){
        const { type } = event;

        switch (type) {
            case 'firstplay':
                return this.onStart();
            case 'ended' :
                this.player.exitFullscreen();
                return this.onEnded();
            case 'click':
            case 'tap':
            case 'touchstart':
                return this.changeFullscreen();
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
