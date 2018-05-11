import React from 'react';

import { CommonSlider } from '../commons/components/slider'
import { CommonLank } from '../commons/components/rank';
import { ItemList } from '../commons/components/item';

import { values } from '../commons/configs';


console.log("values", values.mock);
const mainImages = [
    {id : '1', url : 'https://picsum.photos/1280/600', text : "hi-1", link : 'https://www.yahoo.com/'},
    {id : '2', url : 'https://picsum.photos/1280/600/?random', text : "hi-2", link : 'http://www.naver.com'},
    {id : '3', url : 'https://picsum.photos/g/1280/600', text : "hi-3", link : 'http://www.daum.net' },
    {id : '4', url : 'https://picsum.photos/1280/600/?gravity=east', text : "hi-4", link : 'http://www.naver.com'},
];

const eventList = [
    {id : '1', url : 'https://picsum.photos/1280/80/?gravity=east', text : "hi-1", link : 'http://www.naver.com'},
    {id : '2', url : 'https://picsum.photos/1280/80/?random', text : "hi-2", link : 'http://www.google.com'},
]

class MainContainer extends React.Component {

    render() {
        return (
            <div className="main-container">
                <CommonSlider data={mainImages}/>
                <CommonLank />

                <CommonSlider data={eventList} />
                <ItemList mark="main" count={4}/>
            </div>
        );
    }
}

export default MainContainer;
