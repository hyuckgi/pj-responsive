import React from 'react';
import { connect } from 'react-redux';

import { fetch } from '../redux/actions';
import { values, service } from '../commons/configs';

import { CommonSlider } from '../commons/components';
import { CommonLank } from '../commons/components/rank';
import { ItemList } from '../commons/components/item';

const mainImages = [
    {url : 'https://picsum.photos/1280/600', text : "hi-1", link : 'https://www.yahoo.com/'},
    {url : 'https://picsum.photos/1280/600/?random', text : "hi-2", link : 'http://www.naver.com'},
    {url : 'https://picsum.photos/g/1280/600', text : "hi-3", link : 'http://www.daum.net' },
    {url : 'https://picsum.photos/1280/600/?gravity=east', text : "hi-4", link : 'http://www.naver.com'},
];

const eventList = [
    {url : 'https://picsum.photos/1280/80/?gravity=east', text : "hi-1", link : 'http://www.naver.com'},
    {url : 'https://picsum.photos/1280/80/?random', text : "hi-2", link : 'http://www.google.com'},
]

const mapStateToProps = ({fetch}) => {
    const data = service.getValue(values, 'mock.stories', []);
    return {
        data
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
    getItem :(url, params) => dispatch(fetch.get(url, params)),
});


class MainContainer extends React.Component {

    render() {
        return (
            <div className="main-container">
                <CommonSlider data={mainImages}/>
                <CommonLank />

                <CommonSlider data={eventList} />
                <ItemList count={4} mark="main"/>
            </div>
        );
    }
}

export default  connect(mapStateToProps, mapDispatchProps)(MainContainer);
