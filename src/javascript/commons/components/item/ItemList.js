import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { DesktopLayout, MobileLayout } from '../response';

import { Row, Col } from 'antd';
import { ListView } from 'antd-mobile';

import { values, service } from '../../configs';
import Item from './Item';


const mapStateToProps = ({fetch}) => {
    const data = service.getValue(values, 'mock.stories', []);
    return {
        data
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
    move: (location) => dispatch(push(location)),
});

const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});


class ItemList extends React.Component {

    constructor(props) {
        super(props);

        const list = this.props.mark === 'main'
                    ? this.props.data.filter(item => item.mark === this.props.mark)
                    : this.props.data.filter(item => item.category === this.props.category);

        this.state = {
            dataSource : dataSource.cloneWithRows(list),
            list : list
        };

        this.renderCard = this.renderCard.bind(this);
        this.renderMCard = this.renderMCard.bind(this);
    }

    componentDidMount() {
        const { category } = this.props || false;

        if(!category){
            return;
        };
    }

    renderCard(){
        const { count } = this.props;
        const { list } = this.state;

        if(list.length){
            return list.map(item => {
                return <Col span={24 / count} key={item.id}><Item item={item} platform={values.platform.PC} /></Col>
            });

        }
        return(
            <div className="list-none">리스트가 없습니다</div>
        )
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            const list = nextProps.mark === 'main'
                        ? this.props.data.filter(item => item.mark === nextProps.mark)
                        : this.props.data.filter(item => item.category === nextProps.category)
            return this.setState({
                dataSource: this.state.dataSource.cloneWithRows(list)
            });
        }
    }

    renderSeparator(sectionID, rowID){
        return(
            <div
                className="separator"
                key={`${sectionID}-${rowID}`}
            />
        );
    }

    renderMCard(rowData, sectionID, rowID){
        console.log("rowData", rowData);
        return(
            <Item item={rowData}/>
        );
    }

    onEndReached(){
        // API more call
    }


    render() {
        const { dataSource } = this.state;
        // Todo 리스트의 카테고리 네임, 정렬, 레이아웃 변화, 모바일 isFetching
        return (
            <div className="list-container">
                <DesktopLayout>
                    <Row type="flex" justify="start" gutter={16}>
                        {this.renderCard(values.platform.PC)}
                    </Row>
                </DesktopLayout>
                <MobileLayout>

                    <ListView
                        initialListSize={5}
                        dataSource={dataSource}
                        renderHeader={() => <span>header</span>}
                        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                         footer
                        </div>)}
                        renderRow={this.renderMCard}
                        renderSeparator={this.renderSeparator}
                        pageSize={5}
                        useBodyScroll
                        scrollRenderAheadDistance={500}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={200}
                        delayTime={10}
                      />

                </MobileLayout>
            </div>
        );
    }
}

ItemList.propTypes = {
    mark : PropTypes.string,
    count : PropTypes.number,
};

ItemList.defaultProps = {
    mark : 'cate',
    count : 4,
};

export default connect(mapStateToProps, mapDispatchProps)(ItemList);
