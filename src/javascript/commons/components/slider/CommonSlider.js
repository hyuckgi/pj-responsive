import React from 'react';
import { Link } from 'react-router-dom';

import { DesktopLayout, MobileLayout } from '../response';

import { Carousel as WebCarousel } from 'antd';
import { Carousel as MobileCarousel } from 'antd-mobile';

import { service } from '../../configs';


class CommonSlider extends React.Component {

    render() {
        const { data } = this.props;

        return (
            <div className="common-slider">
                <DesktopLayout>
                    <WebCarousel
                        autoplay
                    >
                        {data.map((item, inx) => {
                            const path = service.getValue(item, 'link', false);
                            if(path){
                                return (
                                    <div key={inx}>
                                        <Link
                                            key={item.inx}
                                            to={item.link}
                                            target="_self"
                                        >
                                            <img
                                                src={item.url}
                                                alt={item.text}
                                                onLoad={() => {
                                                    window.dispatchEvent(new Event('resize'));
                                                }}
                                            />
                                        </Link>
                                    </div>
                                )
                            }

                            return(
                                <div key={inx}>
                                    <img
                                        src={item.url}
                                        alt={item.text}
                                        onLoad={() => {
                                            window.dispatchEvent(new Event('resize'));
                                        }}
                                    />
                                </div>
                            )
                        })}
                    </WebCarousel>
                </DesktopLayout>
                <MobileLayout>
                    <MobileCarousel
                        autoplay={true}
                        infinite
                        // beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                        // afterChange={index => console.log('slide to', index)}
                    >
                        {data.map((item, inx) => {
                            const path = service.getValue(item, 'link', false);
                            if(path){
                                return (
                                    <Link
                                        key={inx}
                                        to={item.link}
                                        target="_self"
                                    >
                                        <img
                                            src={item.url}
                                            alt={item.text}
                                            onLoad={() => {
                                                window.dispatchEvent(new Event('resize'));
                                            }}
                                        />
                                    </Link>
                                );
                            }
                            return(
                                <img
                                    key={inx}
                                    src={item.url}
                                    alt={item.text}
                                    onLoad={() => {
                                        window.dispatchEvent(new Event('resize'));
                                    }}
                                />
                            )
                        })}
                    </MobileCarousel>
                </MobileLayout>
            </div>
        );
    }

}

export default CommonSlider;
