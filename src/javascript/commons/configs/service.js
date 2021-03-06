import moment from 'moment';
import queryString from 'query-string';
import UAParser from 'ua-parser-js';

const defaultPagination = {showSizeChanger:false, showQuickJumper: false, pageSizeOptions: ['10', '50', '100', '400']};
const parser = new UAParser();

export const service = {
    isMobile : () => {
        return parser.getDevice().type;
    },
    getMobileClassName : (className) => {
        if(service.isMobile()){
            return `${className} ${className}-mobile`
        }
        return `${className}`
    },
    getWebText : (txt) => {
        if(!service.isMobile()){
            return txt;
        }
        return ''
    },
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
            .filter(key => key === 'page' || (params[key] && params[key] !== ''))
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
        pagination.size = service.isMobile() ? 'small' : "";
        pagination.total = item.count;
        pagination.pageSize = item.pageSize;
        return { pagination,  total: item.count, list: item.results};
    },

    amount : (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),

    toPercentage : (value)  => {
        if(!isFinite(value)){
            return '0';
        }

        return isNaN(value) ? '0' : value.toFixed(0);
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
        return `${noPattern}${'*'.repeat(str.length - number)}`
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
                    item.list = newList;
                }
                return item;
            })
        }
    },

    toSearchParams: (search) => {
        const searchParams = queryString.parse(search);
        const params = { size:10, page:1 }

        return {...params, ...searchParams};
    },

    // getCurrentPagination(location){
    //     const searchParams = new URLSearchParams(location.search);
    //     const size = searchParams.get('size');
    //     const page = searchParams.get('page');
    //     let current = 1;
    //
    //     if(size && page >= 0){
    //         current = page / size + 1;
    //     }
    //     console.log("size");
    //     return { current, pageSize : Number(size)}
    // },

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
    },

    makeYearOption : (length = 5) => {
        const currentYear = moment().year();
        const years = Array(length).fill(0).map((item, inx) => {
            item = {};
            item['value'] = `${currentYear - inx}`;
            item['label'] = `${currentYear - inx}년`;
            return item;
        })

        return [{value : 'all', label : '전체'}, ...years]
    }
};
export default {
    service
};
