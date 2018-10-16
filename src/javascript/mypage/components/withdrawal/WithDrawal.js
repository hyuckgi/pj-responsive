import React from 'react';

import { ButtonWrapper } from '../../../commons/components';
import { FormButton } from '../../../commons/types';

class WithDrawal extends React.Component {

    constructor(props) {
        super(props);

        this.getButtons = this.getButtons.bind(this);
    }

    onClickButton(id){
        console.log("id", id);
    }

    getButtons(){
        return [{ id : FormButton.DELETE, label : '회원 탈퇴하기', type : 'primary', size : 'large', inline : true}];
    }

    render() {
        return (
            <div className="service-container">
                <div className="service-wrapper-top">
                    <h2 className="title">9spoons WithDrawal</h2>
                </div>

                <div className="service-wrapper-contents withdrawal-contents">
                    <div className="withdrawal-wrapper">
                        회원 탈퇴 내용
                    </div>
                </div>

                <ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)} />
            </div>
        );
    }

}

export default WithDrawal;
