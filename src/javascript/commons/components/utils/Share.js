import React from 'react';
import { withRouter } from 'react-router';
import { CustomIcon } from '../';
import copy from 'copy-to-clipboard';

import { Button, Toast } from 'antd-mobile';
import { KaKaoStoryButton, TwitterButton, FacebookButton } from "react-social-kr";

import imgKakaoPage from '../../../../resource/commons/kakaostory_icon.png';

class Share extends React.Component {



    onClipBoard(e){
        e.preventDefault();
        copy(window.location.href);
        return Toast.success('링크가 복사되었습니다.', 1);
    }

    render() {
        const pathname = window.location.href;
        const commonStyle = {
            width : '3em',
            height : '3em'
        };

        return (
            <div className="share-wrapper">
                <KaKaoStoryButton pathname={pathname} title="kakaostory">
                    <span className="am-icon am-icon-lg am-icon-img">
                        <img src={imgKakaoPage} alt="kakaostory"/>
                    </span>
                </KaKaoStoryButton>
                <FacebookButton pathname={pathname} sharer={true} appId={'dsadasew'} title="facebook">
                    {/* TODO facebook appid */}
                    <CustomIcon
                        type='FaFacebookSquare'
                        roots="FontAwesome"
                        sizes="lg"
                        style={ {...commonStyle, color : '#4267B2'}}
                    />
                </FacebookButton>
                <TwitterButton pathname={pathname} title="twitter">
                    <CustomIcon
                        type='FaTwitterSquare'
                        roots="FontAwesome"
                        sizes="lg"
                        style={ {...commonStyle, color : '#08a0e9'}}
                    />
                </TwitterButton>

                <a onClick={this.onClipBoard} title="copy-link">
                    <CustomIcon
                        type='FaPaperclip'
                        roots="FontAwesome"
                        sizes="lg"
                        style={ {...commonStyle}}
                    />
                </a>
            </div>


        );
    }

}

export default withRouter(Share);
