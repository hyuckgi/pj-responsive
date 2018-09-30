import axios from 'axios';
import {  service, mock } from '../configs';
import SessionService from '../configs/security/SessionService';
import queryString from 'query-string';


const getToken = () => {
    const userData = SessionService.userInfo;
    const token = service.getValue(userData, 'token', '');

    return token;
}

axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = false;
axios.defaults.headers.common['X-Auth-Token'] = getToken();
axios.defaults.headers.common['Accept-Language'] = window.navigator.language || 'en-US';
axios.defaults.headers.common['Content-Type'] = 'application/json';


const config = {
	debug : false,
	caching: false,
	offlineMode : false,
	healthCheckTime : 10000,
	hostName: null,
}
const makeMock = (docs, url, params) => {
	const result_code = service.getValue(docs, 'data.result_code', 200);
	const resultCode = service.getValue(docs, 'data.resultCode', result_code);

	if(resultCode !== 200){
		const query = queryString.parseUrl(url);
		const sizeArr = query.url.split('/');
		const sizeIdx = sizeArr.findIndex(item => item === 'size');
		const count = query.url.indexOf("size") !== -1 ? parseInt(sizeArr[sizeIdx + 1], 10) : 10;
		const newUrl = query.url.indexOf("size") !== -1 ? sizeArr.slice(0, -1).join("/") : query.url;
		const newData = mock[newUrl] && mock[newUrl](count);

		docs.data = newData ? newData : docs.data;
	}

	return docs;
}

const onError = (error, res, file) => {
    const errorCode = service.getValue(res, 'result_code', '');
    const errorMsg = service.getValue(res, 'result_msg', false);
    if(errorMsg){
        window.alert(errorMsg);
        return window.location.reload();
    }
}

const errorModal = (err, url, params) => {
	// console.log("obj", url);
	// console.log("params", params);
	// console.log("err", err.response);
    // const data = service.getValue(err, 'response.data', false);
	const status = service.getValue(err, 'response.status', false);

	if(status){
		return makeMock(err.response, url, params)
	}
    // if(data){
    //     let returnPath = path.serverError;
    //     if(data.result_code === 404){
    //         returnPath = path.notFound;
    //     }
    //
    //     window.alert(data.result_msg)
    //     return window.location.href = returnPath;
    // }
}

const getAPIHost = () => {
	if (process.env.NODE_ENV === 'development') {
		if (config.hostName) {
			return config.hostName;
		}
		return 'http://apidev.9spoons.com';
	} else if (process.env.NODE_ENV === 'test') {
		return '';
	} else {
		return 'http://apidev.9spoons.com';
	}
};

const APIHost = getAPIHost();

const simpleAxios = axios.create();

const getMakeURL = (url) => {
	const prefix = url.indexOf('http') === 0 ? '' : APIHost;
	return `${prefix}${url}`;
};

const convertCamel = (str) => (str.replace(/_([a-z])/g, (m, w) => w.toUpperCase()));
const convertUnderscore = (str) => str.replace(/([a-z])([A-Z])/g, (text, p1, p2) => p1 + '_' + p2.toLowerCase());
const isObject = (val) => {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
};

const makeMapper = (item, isCamelcase = true) => {
    if(!item) { return {};}
    const keys = Object.keys(item);
    const mappingObj = Object.keys(item).reduce((obj, key) => {
        if(isCamelcase) {
            // obj[key] = key.replace(/_([a-z])/g, (m, w) => w.toUpperCase());
            obj[key] = convertCamel(key);
        } else {
            obj[key] = convertUnderscore(key);
        }
        return obj;
    }, {});
    return { keys, mappingObj };
};

const convertObject = (item, mapper, isCamelcase = true) => {
	const defaultObj = {};
	if(!isObject(item)) {
	    return item;
    }
	if(item.id) {
		defaultObj.key = item.id;
	}
	if(!mapper) {
	    mapper = makeMapper(item, isCamelcase);
    }
    return mapper.keys.reduce((obj, key) => {
        const newKey = mapper.mappingObj[key];

        if(item[key]) {
            if(Array.isArray(item[key])) {
                item[key] = convertList(item[key], null, isCamelcase);
            } else if(isObject(item[key])) {
                item[key] = convertObject(item[key], null, isCamelcase);
            }
        }
        if(!obj[newKey]) {
            obj[newKey] = item[key];
        }
        return obj;
    }, defaultObj);
};
const convertList = (list, mapper, isCamelcase = true) => {
    return list.map(item => {
    	// 예외 케이스가 많아 그때마다 mapper 생성
        mapper = makeMapper(item, isCamelcase);
        return convertObject(item, mapper, isCamelcase);
    });
};
const docsToCamelCase = (docs, params = {}) => {
    let mapper = undefined;
    let data = docs.data;
    if(!data) {
        return docs;
    }
    mapper = makeMapper(data);
    data = convertObject(data, mapper);

    if(Array.isArray(data.results)) {
        data.results = data.results.map((item, inx) => {
            item.inx = (inx + 1) + (params.offset || 0);
            return item;
        });
    }

    docs.data = data;
    return docs;
};

const paramsToUnderscore = (params = {}) => {
    const isCamelcase = false;
    if(params instanceof FormData) {
        return params;
    }
    return convertObject(params, makeMapper(params, isCamelcase), isCamelcase);
};

const jsonToParams = (obj = {}) => {
    return Object.keys(obj).reduce((str, key) => {
        str += ((str === '' ? '' : '&') + key + '=' + obj[key]);
        return str;
    }, '');
}

class APICaller {
	static post(url, params = {}, options = {}, isPlainAxios = false, notToConvert = false) {
		const fullUrl = getMakeURL(url);
		const instance = isPlainAxios ? simpleAxios : axios;

        return instance.post(fullUrl, notToConvert ? params : paramsToUnderscore(params), options).then(docsToCamelCase).catch((err) => errorModal(err, url, params));
	}
	static put(url, params = {}, options = {}, isPlainAxios = false, notToConvert = false) {
		const fullUrl = getMakeURL(url);
		const instance = isPlainAxios ? simpleAxios : axios;

        return instance.put(fullUrl, notToConvert ? params : paramsToUnderscore(params), options).then(docsToCamelCase).catch((err) => errorModal(err, url, params));
	}
	static get(url, params = null,  isPlainAxios = false) {
		const fullUrl = getMakeURL(url);
		const str = jsonToParams(paramsToUnderscore(params));
		const instance = isPlainAxios ? simpleAxios : axios;
		return instance.get(fullUrl + (str === '' ? '' : '?') + str)
			.then((response)=> {
				return response;
			})
			.then(docs => docsToCamelCase(docs, params))
			.then(docs => makeMock(docs, url, params))
            .catch((err) => errorModal(err, url, params));
	}
    static delete(url, params = null,  isPlainAxios = false) {
		const fullUrl = getMakeURL(url);
		const str = jsonToParams(paramsToUnderscore(params));
		const instance = isPlainAxios ? simpleAxios : axios;
		return instance.delete(fullUrl + (str === '' ? '' : '?') + str)
			.then((response)=> {
				return response;
			})
			.then(docs => docsToCamelCase(docs, params))
            .catch((err) => errorModal(err, url, params));
	}
	static all(list) {
		return axios.all(list)
            .then(axios.spread(function(...response) {
			    return {...response};
		    }));
	}
}

// if (process.env.NODE_ENV !== 'production') {
if (true) {
	axios.interceptors.request.use(
		(req) => {
			if (config.debug === true) {
				console.log('%c Request:', 'color: #4CAF50; font-weight: bold', req);
			}
			return req;
		},
		(err) => {
			if (config.debug === true) {
				console.log('%c Request:', 'color: #EC6060; font-weight: bold', err);
			}
			return Promise.reject(err);
		}
	);
	axios.interceptors.response.use(
		(res) => {
			if (config.debug === true) {
				console.log('%c Response:', 'color: #3d62e5; font-weight: bold', res);
			}
			return res;
		},
		(err) => {
			if (config.debug === true) {
				console.log('%c Response:', 'color: #EC6060; font-weight: bold', err);
			}
			return Promise.reject(err);
		}
	);
}

const upload = {
    getProps : () => ({
        action: `${APIHost}/api/file/upload`,
        headers: {
            'X-Auth-Token' : getToken(),
            'Accept-Language' : window.navigator.language || 'en-US',
        },
        showUploadList : {showPreviewIcon : false},
        withCredentials: false,
        onError : onError,
    }),
    convertObject
};

export default APICaller
export {APICaller, axios, upload}
