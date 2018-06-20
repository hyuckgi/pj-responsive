import React from 'react';
import { connect } from 'react-redux';

import { service } from '../../commons/configs';
import { CustomIcon } from '../../commons/components';
import { WhiteSpace } from 'antd-mobile';

const mapStateToProps = ({code}) => {
    const categories = service.getValue(code, 'categories', []);

    return {
        categories
    }
};

const mapDispatchProps = dispatch => ({
});

class Category extends React.Component {

    render() {
        const { category, categories } = this.props;

        return (
            <div className="category-wrapper">
                {categories.filter(item => item.categoryNo === Number(category)).map((item, inx) => {
                    return (
                        <div
                            key={inx}
                            className="category-inner"
                        >
                            <WhiteSpace size="xl" />
                            <WhiteSpace size="xl" />
                            <h2>{item.categoryName}</h2>
                            <p><CustomIcon type="FaListAlt" roots="FontAwesome" />등록된 스토리 - {item.totalStory}개</p>
                            <p><CustomIcon type="FaHeartbeat" roots="FontAwesome" />기부금 - {item.totalDonation}원</p>
                            <p><CustomIcon type="FaGroup" roots="FontAwesome" /> 참여자 - {item.sponsorCount}명</p>
                            <WhiteSpace size="xl" />
                        </div>
                    )
                })}
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(Category);
