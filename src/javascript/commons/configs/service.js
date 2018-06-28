// import moment from 'moment';

const defaultPagination = {size: 'small', showSizeChanger:true, showQuickJumper: false, pageSizeOptions: ['10', '50', '100', '400'], defaultPageSize : 1};


export const service = {
    getValue: (obj, key, defaultValue) => {
        if(!obj) {
            return defaultValue;
        }
        if(!key) {
            return defaultValue;
        }

        const keys = key.split('.');
        let value = obj;
        for(let inx = 0, len = keys.length ; inx < len ; inx++) {
            let newValue = value[keys[inx]];
            if(!newValue) {
                return defaultValue;
            }
            value = newValue;
        }
        return value;
    },

    toQuery: (params) => {
        if(!params) {
            return '';
        }
        return '?' + Object.keys(params)
            .filter(key => key === 'offset' || (params[key] && params[key] !== ''))
            .map(key => {
                return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
            })
            .join('&');
    },

    makeList: (item) => {
        const pagination = {...defaultPagination};
        if(!(item && item.results && item.results.length > 0)) {
            pagination.total = 0;
            return {pagination, list:[], total: 0};
        }

        pagination.total = item.count;
        return { pagination,  total: item.count, list: item.results};
    },

    amount : (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),

    toPercentage : (value)  => {
        return isNaN(value) ? '' : value.toFixed(0) + '%';
    },

    getFileNo : (fileList) => {
        if(!fileList.length){
            return [];
        }

        return fileList.map(item => {
            const fileNo = service.getValue(item, 'response.data.temp_file_no', false);
            if(fileNo){
                return fileNo;
            }
            return null
        })
    },

    getMasking : (str, number = 5) => {
        if(!str){
            return;
        }
        const noPattern = str.slice(0, number);
        const isPattern = str.slice(number, -1).replace(/\w/g, "*");

        return `${noPattern}${isPattern}`
    },

    makeMdn : (mdn) => {
        return (mdn && mdn.indexOf('-') < 0) ? mdn.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3") : mdn;
    },

    getTimes : (gap) => {
        let time = gap;
        const ms =  ('000' + (time % 1000)).substr(-3);
        time = Math.floor(time / 1000);
        const ss = ('00' + (time % 60)).substr(-2);
        time = Math.floor(time / 60);
        const mm = ('00' + (time % 60)).substr(-2);
        time = Math.floor(time / 60);
        const hh = ('00' + (time % 60)).substr(-2);

        return {hh, mm, ss, ms};
    },

    mappingKey : (list) => {
        if(Array.isArray(list)){
            return list.map((item, inx) => {
                item['key'] = inx;
                if(item.list){
                    const newList = service.mappingKey(item.list);
                    console.log("newList", newList);
                    item.list = newList;
                }
                return item;
            })
        }
    },

    toSearchParams: (search) => {
        const searchParams = new URLSearchParams(search);
        const params = {size:10, page:1};

        for (let key of searchParams.keys()) {
            const value = searchParams.get(key);
            if(value) {
                params[key] = value;
            }
        }
        return params;
    },

    getIosUrl : (url) => {
        if(url.endsWith('.webm')){
            return url.replace('/u/', '/ut/') + '.mp4';
        }
        return url;
    },
    getIosPoster : (url) => {
        if(url.endsWith('.webm')){
            return url.replace('/u/', '/ut/') + '.jpg';
        }
        return url;
    }
};
export default {
    service
};
