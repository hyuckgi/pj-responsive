import axios from 'axios';

const config = {
	debug : false,
	caching: false,
	offlineMode : false,
	healthCheckTime : 10000,
	hostName: null
}

const getAPIHost = () => {
	if (process.env.NODE_ENV === 'development') {
		if (config.hostName) {
			return config.hostName;
		}
		return 'http://api.shell.pe.kr/api/';
	} else if (process.env.NODE_ENV === 'test') {
		return '';
	} else {
		return '';
	}
};

const APIHost = getAPIHost();

axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = false;

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
        // Worst case, LCMS 미디어 정보 관련
        if(!isCamelcase) {
        	obj[key] = item[key];
        	return obj;
		}
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
    let mapper;
    const isCamelcase = false;
    if(params instanceof FormData) {
        return params;
    }
    const test =  convertObject(params, makeMapper(params, isCamelcase), isCamelcase);
	console.log('test', test);
	return ;
};

const jsonToParams = (obj = {}) => {
    return Object.keys(obj).reduce((str, key) => {
        str += ((str === '' ? '' : '&') + key + '=' + obj[key]);
        return str;
    }, '');
}

class APICaller {
	static post(url, params = {}, options = {}) {
		const fullUrl = getMakeURL(url);
		return axios.post(fullUrl, paramsToUnderscore(params), options).then(docsToCamelCase);
	}
	static get(url, params = null,  isNoWarning = false) {
		const fullUrl = getMakeURL(url);

		const str = jsonToParams(paramsToUnderscore(params));
		if(isNoWarning){
			const instance = axios.create();
			return instance.get(fullUrl + (str === '' ? '' : '?') + str)
		}
		return axios.get(fullUrl + (str === '' ? '' : '?') + str)
			.then((response)=> {
				return response;
			})
			.then(docs => docsToCamelCase(docs, params));
	}
	static all(list) {
		return axios.all(list)
            .then(axios.spread(function(...response) {
			    return {...response};
		    }));
	}

    static upload(file) {
        const options = {headers: getCSRFToken(), 'content-type': 'multipart/form-data', withCredentials: true}

        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('model_type', 3);

        return APICaller.post('/aux/files/', formData, options);
    }
}

const getCSRFToken = () => {
    let token;
    for (let cookie of document.cookie.split('; ')) {
        let [name, value] = cookie.split("=");
        if(name === 'XSRF-TOKEN') {
            token = decodeURIComponent(value);
            break;
        }
    }
    return {'X-CSRFToken' : token};
};

const upload = {
    getProps : (fileList) => ({
        action: `${APIHost}/aux/files/`,
        headers: getCSRFToken(),
        data: {model_type: 3},
        withCredentials: true,
        defaultFileList : [...fileList]
    }),
    convertObject
};

export default APICaller
export {APICaller, APIHost, axios, upload}
