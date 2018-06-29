import React from 'react';
import { connect } from 'react-redux';

import { service } from '../../../commons/configs';
import { CustomIcon } from '../../../commons/components';

const mapStateToProps = ({code}) => {
    const categories = service.getValue(code, 'categories', []);

    return {
        categories
    }
};

const mapDispatchProps = dispatch => ({
});

class Category extends React.Component {

    getCategory(category, arr = []){
        return arr.reduce((result, item) => {
            const child = service.getValue(item, 'children', false);
            if(item.categoryNo === Number(category)){
                result.push(item);
            }else{
                if(child){
                    result.push(this.getCategory(category, child))
                }
            }
            return result;
        }, []).find(item => item);
    }

    render() {
        const { category, categories } = this.props;
        const current = this.getCategory(category, categories);

        return (
            <div className="category-wrapper">
                { current &&
                <div className="category-inner">
                    <h2>{current.categoryName}</h2>
                    <p><CustomIcon type="MdCollections"  />등록된 스토리 - {current.totalStory}개</p>
                    <p><CustomIcon type="MdMonetizationOn" />기부금 - {service.amount(current.totalDonation)}원</p>
                    <p><CustomIcon type="FaGroup" roots="FontAwesome"/> 참여자 - {current.sponsorCount}명</p>
                </div>
                }
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(Category);
