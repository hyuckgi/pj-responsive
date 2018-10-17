import React from 'react';

import { service } from '../../../commons/configs';
import { CommonEditor, CommonSlider, VideoPlayer } from '../../../commons/components';

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
                {this.renderImage(images, title)}
                {this.renderVideo(videos)}
            </div>
        )
    }

    renderVideo(videos){
        return(
            <div className="video-area">
                {
                    videos.map((item, idx) => {
                        if(!item){
                            return null;
                        }
                        return(
                            <VideoPlayer url={item} key={idx} />
                        )
                    })
                }
            </div>
        )
    }

    renderImage(images, title){
        if(!images.length){
            return;
        }
        const newImages = images.reduce((result, item) => {
            const newItem = {
                imageUrl : item,
                text : title,
            }
            result.push(newItem);
            return result;
        }, []);

        return(
            <div className="img-area">
                <CommonSlider list={newImages} autoplay={false}/>
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
