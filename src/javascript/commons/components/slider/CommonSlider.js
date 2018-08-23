import React from 'react';
import { Link } from 'react-router-dom';

import { DesktopLayout, MobileLayout } from '../response';

import { Carousel as WebCarousel } from 'antd';
import { Carousel as MobileCarousel } from 'antd-mobile';

import { service } from '../../configs';


// {this.state.data.map(val => (
//     <a
//         key={val}
//         href="http://www.alipay.com"
//         style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
//     >
//         <img
//             src={`https://zos.alipayobjects.com/rmsportal/${val}.png`}
//             alt=""
//             style={{ width: '100%', verticalAlign: 'top' }}
//             onLoad={() => {
//                 // fire window resize event to change height
//                 window.dispatchEvent(new Event('resize'));
//                 this.setState({ imgHeight: 'auto' });
//             }}
//         />
//     </a>
// ))}

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
