import React from 'react';

import { APICaller } from '../../api';
import { Upload, Icon } from 'antd';

// const uploadProps = {
//   action: '/upload.do',
//   multiple: false,
//   data: { a: 1, b: 2 },
//   headers: {
//     Authorization: '$prefix $token',
//   },
//   onStart(file) {
//     console.log('onStart', file, file.name);
//   },
//   onSuccess(ret, file) {
//     console.log('onSuccess', ret, file.name);
//   },
//   onError(err) {
//     console.log('onError', err);
//   },
//   onProgress({ percent }, file) {
//     console.log('onProgress', `${percent}%`, file.name);
//   },
//   customRequest({
//     action,
//     data,
//     file,
//     filename,
//     headers,
//     onError,
//     onProgress,
//     onSuccess,
//     withCredentials,
//   }) {
//     // EXAMPLE: post form-data with 'axios'
//     const formData = new FormData();
//     if (data) {
//       Object.keys(data).map(key => {
//         formData.append(key, data[key]);
//       });
//     }
//     formData.append(filename, file);
//
//     axios
//       .post(action, formData, {
//         withCredentials,
//         headers,
//         onUploadProgress: ({ total, loaded }) => {
//           onProgress({ percent: Math.round(loaded / total * 100).toFixed(2) }, file);
//         },
//       })
//       .then(({ data: response }) => {
//         onSuccess(response, file);
//       })
//       .catch(onError);
//
//     return {
//       abort() {
//         console.log('upload progress is aborted.');
//       },
//     };
//   },
// };
//
// const Test = () => {
//   return (
//     <div
//       style={{
//         margin: 100,
//       }}
//     >
//       <div>
//         <Upload {...uploadProps}>
//           <button>开始上传</button>
//         </Upload>
//       </div>
//     </div>
//   );
// };

class CustomUpload extends React.Component {

    constructor(props) {
        super(props);

        this.customRequest = this.customRequest.bind(this);
    }

    customRequest(params){
        const { type } = this.props;
        const { data } = params;
        const formData = new FormData();

        if(Object.keys(data).length){
            Object.keys(data).map(key => {
              formData.append(key, data[key]);
            });
        }

        formData.append('file', params.file);
        formData.append('filename', params.file.name);

        APICaller.post(action, formData, {
            withCredentials,
            headers,
            onUploadProgress: ({ total, loaded }) => {
              onProgress({ percent: Math.round(loaded / total * 100).toFixed(2) }, file);
            },
          })
          .then(({ data: response }) => {
            onSuccess(response, file);
          })
          .catch(onError);

        return {
          abort() {
            console.log('upload progress is aborted.');
          },
        };
    }

    getData(){
        const { data } = this.props;

        return {
            ...data,
        }
    }

    onChange(...args){
        console.log("args", args);
    }

    render() {
        const { name, accept } = this.props;

        return (
            <Upload
                {...upload.getProps()}
                customRequest={this.customRequest}
                accept={accept}
                listType="picture-card"
                onChange={this.onChange}
                data={this.getData}
            >
                <div>
                    <Icon type="plus" />
                    <div className="ant-upload-text">Upload</div>
                </div>
            </Upload>
        );
    }

}

export default CustomUpload;
