import React from 'react';
import PropTypes from 'prop-types';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import { ButtonWrapper, Buttons } from './';
import { service } from '../configs';
import { FormButton } from '../types';

import { Button, Flex, WhiteSpace } from 'antd-mobile';

class CommonEditor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};

        this.onEditorStateChange = this.onEditorStateChange.bind(this);
        this.convertHtml = this.convertHtml.bind(this);
        this.onClickButton = this.onClickButton.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        const { value } = this.props;
        return this.convertHtml(value);
    }

    convertHtml(value){
        const contentBlock = htmlToDraft(value);

        if(contentBlock){
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);

            return this.setState({
                editorState,
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.value !== nextProps.value){
            return this.convertHtml(nextProps.value);
        }
    }

    componentDidCatch(error, info) {

    }

    onEditorStateChange(editorState){
        this.setState({
            editorState,
        })
    }

    getToobars(){
        const { toolbars } = this.props;

        if(toolbars){
            return {
                options : ['inline', 'fontSize', 'colorPicker', 'link', 'textAlign', 'emoji', 'image', 'history'],
            }
        }
        return {}
    }

    onSubmit(){
        const { onSubmit } = this.props;
        const { editorState } = this.state;

        if(onSubmit){
            return onSubmit({
                events : 'submit',
                payload : {
                    text : draftToHtml(convertToRaw(editorState.getCurrentContent()))
                }
            });
        }
    }

    onMove(){
        const { onSubmit } = this.props;

        if(onSubmit){
            return onSubmit({
                events : 'move',
            });
        }
    }

    onClickButton(id){
        switch (id) {
            case FormButton.SAVE:
                return this.onSubmit();
            case FormButton.CONFIRM:
                return this.onMove();
            default:
                break;
        }
    }

    renderButtons(buttons){
        return buttons.map((item, inx) => {
            return (
                <Flex.Item>
                    <Buttons />
                </Flex.Item>
            )
        })
    }

    renderFooter(){
        const buttons = service.getValue(this.props, 'buttons', []);

        return (
            <Flex justify="end" className="button-wrapper">
                <Flex.Item>
                    <WhiteSpace />
                    <Buttons buttons={buttons} onClickButton={this.onClickButton.bind(this)}/>
                </Flex.Item>
            </Flex>
        )
    }

    render() {
        const {placeholder, toolbars, readOnly, wrapperClassName, editorClassName, toolbarClassName} = this.props;
        const { editorState } = this.state;

        return (
            <div className={`common-editor ${readOnly ? 'common-editor-read' : ''}`}>
                <Editor
                    editorState={editorState}
                    wrapperClassName={wrapperClassName}
                    editorClassName={editorClassName}
                    toolbarClassName={toolbarClassName}
                    onEditorStateChange={this.onEditorStateChange}
                    toolbarStyle={toolbars ? null : {display:'none'}}
                    toolbar={this.getToobars()}
                    readOnly={readOnly}
                    localization={{
                        locale: 'ko',
                    }}
                    placeholder={placeholder || null}
                />
                {this.renderFooter()}
            </div>
        );
    }

}

CommonEditor.propTypes = {
    value: PropTypes.string.isRequired,
    toolbars : PropTypes.bool.isRequired,
    readOnly : PropTypes.bool.isRequired,
    wrapperClassName : PropTypes.string.isRequired,
    editorClassName : PropTypes.string.isRequired,
    toolbarClassName : PropTypes.string.isRequired,
};

CommonEditor.defaultProps = {
    value : "텍스트가 없습니다.",
    toolbars : false,
    readOnly : true,
    wrapperClassName : 'spoons-editor-wrapper',
    editorClassName : 'spoons-editor-main',
    toolbarClassName : 'spoons-editor-toolbar',
};

export default CommonEditor;
