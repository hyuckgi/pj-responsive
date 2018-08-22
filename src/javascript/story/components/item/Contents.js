import React from 'react';
import { Player, BigPlayButton } from 'video-react';

import { service } from '../../../commons/configs';
import { CommonEditor } from '../../../commons/components';

import UAParser from 'ua-parser-js';

const parser = new UAParser();


class Contents extends React.Component {

    constructor(props) {
        super(props);

        this.renderContainer = this.renderContainer.bind(this);
        this.renderDom = this.renderDom.bind(this);
        this.renderVideo = this.renderVideo.bind(this);
    }

    renderContainer(){
        const contents = service.getValue(this.props, 'item.contentsList', []);

        return contents.map((item, inx) => {
            return this.renderDom(item, inx);
        });
    }

    renderDom(obj, inx){
        const title = service.getValue(obj, 'title', '');
        const contents = service.getValue(obj, 'contents', '');
        const images = service.getValue(obj, 'imageList', []);
        const videos = service.getValue(obj, 'videoList', []);

        return (
            <div key={inx} className="contents-area">
                {<CommonEditor value={title} />}
                {<CommonEditor value={contents} />}
                {this.renderImage(images)}
                {this.renderVideo(videos)}
            </div>
        )
    }

    renderVideo(videos){
        return(
            <div className="video-area">
                {
                    videos.map((item, idx) => {
                        const os = parser.getOS();
                        // TODO 임시 src
                        // const src = os.name === 'iOS' ? service.getIosUrl(item) : item;
                        const src = "https://www.w3schools.com/html/mov_bbb.mp4"
                        const poster = os.name === 'iOS' ? service.getIosPoster(item) : '';
                        const isVideo =  (/\.(mp4|avi|mpg|mpeg|mpe|wmv|asf|asx|flv|rm|mov|dat|webm|m3u8)$/i).test(src);

                        if(!isVideo){
                            return null;
                        }

                        return(
                            <Player
                                key={idx}
                                preload={'auto'}
                                poster={poster}
                                playsInline={true}
                            >
                                <source src={src} />
                                <BigPlayButton position="center" />
                            </Player>
                        )
                    })
                }
            </div>
        )
    }

    renderImage(images){
        return(
            <div className="img-area">
                {images.map((item, inx) => {
                    return (<img src={item} alt={inx} key={inx}/>)
                })}
            </div>
        )
    }

    render() {
        return (
            <div className="contents-wrppper">
                {this.renderContainer()}
            </div>
        );
    }
}

export default Contents;
