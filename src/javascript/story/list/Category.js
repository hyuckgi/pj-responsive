import React from 'react';
import { connect } from 'react-redux';

import { service } from '../../commons/configs';
import { CustomIcon } from '../../commons/components';

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
                            <h2>{item.categoryName}</h2>
                            <p><CustomIcon type="MdCollections"  />등록된 스토리 - {item.totalStory}개</p>
                            <p><CustomIcon type="MdMonetizationOn" />기부금 - {service.amount(item.totalDonation)}원</p>
                            <p><CustomIcon type="FaGroup" roots="FontAwesome"/> 참여자 - {item.sponsorCount}명</p>
                        </div>
                    )
                })}
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(Category);
