import React from 'react';
import moment from 'moment';
import { withRouter } from 'react-router';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { fetch } from '../../../../redux/actions';

import { api, service, columns, path, values } from '../../../../commons/configs';
import { TableList, Comment, CommonEditor } from '../../../../commons/components';
import { FormMode } from '../../../../commons/types';

import { Avatar, Pagination } from 'antd';
import { Flex, Badge } from 'antd-mobile';

const mapStateToProps = ({fetch}) => {
    const userInfo = service.getValue(fetch, 'item.data', {});
    const resultObj = service.getValue(fetch, 'multipleList.myCommentList', {});
    const list = service.getValue(resultObj, 'list', []);
    const dataSource = list.map((item, inx) => {
        item = {
            ...item,
            key : inx,
            inx : inx + 1,
        }
        return item;
    });
    const makeSource = {count : service.getValue(resultObj, 'totalSize', list.length), results : dataSource, pageSize : service.getValue(resultObj, 'size', 10)};
    const data = service.makeList(makeSource);

    return {
        data,
        resultObj,
        userInfo
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
    move: (location) => dispatch(push(location)),
});


class CommnetList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            size : 10,
            page : 1,
        }

        this.getList = this.getList.bind(this);
        this.getColumns = this.getColumns.bind(this);
        this.onEvents = this.onEvents.bind(this);
        this.onChange = this.onChange.bind(this)
        this.onDelete = this.onDelete.bind(this)

    }

    search(params) {
        const type = service.getValue(this.props, 'match.params.type', false);

        if(type){
            this.props.move(path.fullList(`${path.mypageList}/${type}`, {...params}));
        }
    }

    componentDidMount() {
        const { location } = this.props;
        const { page, size } = this.state;

        if(location.search){
            return this.search(this.getParamsFormLocation())
        }
        return this.search({size, page});
    }

    componentDidUpdate(prevProps, prevState) {
        const { location } = this.props;

        if(prevProps.location.search !== location.search){
            this.getList(this.getParamsFormLocation());
        }

        if(Object.keys(this.props.userInfo).length > 0 && service.getValue(prevProps, 'userInfo.userNo', 0) !== service.getValue(this.props, 'userInfo.userNo', 0)){
            this.getList(this.getParamsFormLocation())
        }
    }

    getList(searchParams){
        const userNo = service.getValue(this.props, 'userInfo.userNo', false);
        if(!userNo){
            return;
        }
        const params = {userNo :userNo };
        const obj = api.getMyComments({...searchParams, params});

        return this.props.multipleList([
            {id : 'myCommentList', url : obj.url, params : obj.params},
        ])
    }

    getParamsFormLocation(){
        const { location } = this.props;
        return service.toSearchParams(location.search);
    }

    getColumns(columns){
        return columns.map(column => {
            if(column.dataIndex === 'thumbnailUrl'){
                column.render = (text, item) => {
                    const src = service.getValue(item, 'thumbnailUrl', false);

                    return (<span>{src ? (<Avatar src={src} style={{marginRight: 15}}/>) : null}</span>)
                }
            }
            return column;
        });
    }

    onEvents(params){
        const { events, payload } = params;

        switch (events) {
            case 'change':
                return this.search(payload)
            default:
                break;
        }
    }

    onChange(page, pageSize){
        return this.search({size : pageSize, page : page})
    }

    onDelete(){
        return window.alert("댓글 삭제 명세 ?")
    }

    renderList(){
        const list = service.getValue(this.props, 'data.list', []);

        if(!list.length){
            return(
                <div className="list-none">댓글이 없습니다.</div>
            )
        }

        return list.map((item, idx) => {
            const profile = service.getValue(item, 'profileUrl', false);
            const updateDate = service.getValue(item, 'updateDate', false);

            return (
                <Flex className="comment" key={idx}>
                    <Flex.Item style={{maxWidth : 60, textAlign : 'center'}}>
                        {profile ? (<Avatar src={profile} />) : (<Avatar icon="user" />) }
                    </Flex.Item>
                    <Flex.Item>
                        <p className="title">{item.storyTitle}</p>
                        <div>
                            <CommonEditor value={item.contents} readOnly={true} />
                        </div>
                        <Flex justify="between">
                            <Flex.Item>
                                {updateDate ? moment(updateDate).format(values.format.LOCALE_KOR) : null}
                            </Flex.Item>

                            <Flex.Item className="util-area">
                                <Flex justify="end">
                                    <Flex.Item className="count">좋아요<Badge text={10} overflowCount={99} style={{marginLeft: 4, top: -2}}/></Flex.Item>
                                    <Flex.Item onClick={this.onDelete} className="delete">삭제하기</Flex.Item>
                                </Flex>
                            </Flex.Item>
                        </Flex>
                    </Flex.Item>
                </Flex>
            )
        })
    }

    render() {
        const { data, resultObj } = this.props;
        const current = service.getValue(resultObj, 'page', 1);

        return (
            <div className="list-wrap comment-wrap">
                <Flex justify="between" className="comment-list-top ">
                    <Flex.Item >
                        <h3>댓글 {`${data.total && data.total} 개`}</h3>
                    </Flex.Item>
                </Flex>

                <div className="comment-list">
                    {this.renderList()}
                </div>
                {service.getValue(data, 'list.length', false) ? <Pagination current={current} onChange={this.onChange} {...data.pagination} /> : null}
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchProps)(CommnetList));
