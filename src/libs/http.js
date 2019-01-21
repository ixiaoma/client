import axios from 'axios';
import _API from './config'
import Vue from 'vue'
import {Message} from 'iview' 
import {router} from '../router/index'

axios.defaults.timeout = 300000;
if (process.env.NODE_ENV == 'development') {
    axios.defaults.baseURL = 'http://localhost:8080'
    Vue.prototype.baseURL = 'http://localhost:8080'//根路径
    Vue.prototype.fileURL = 'http://file.ui-tech.cn/'//文件上传地址+文件下载地址
}else if(process.env.NODE_ENV == 'production'){
    axios.get('serverconfig.json').then(res=>{
        if(res.data.baseUrl){
            axios.defaults.baseURL = res.data.baseUrl
            Vue.prototype.baseURL = res.data.baseUrl
            Vue.prototype.fileURL = res.fileUrl
        }else{
            axios.defaults.baseURL = 'http://localhost:8080'
            Vue.prototype.baseURL = 'http://localhost:8080'
            Vue.prototype.fileURL = 'http://file.ui-tech.cn/'
        }
    }).catch(err=>{
        axios.defaults.baseURL = 'http://localhost:8080'
        Vue.prototype.baseURL = 'http://localhost:8080'
        Vue.prototype.fileURL = 'http://file.ui-tech.cn/'
    })
}
// http request 拦截器
axios.interceptors.request.use(config => {   
    let token = sessionStorage.getItem('cookieaccess_token');
    if(config.url == _API.API_LOGIN_CODE||config.url == _API.API_TOKEN || config.url == _API.API_LOGIN|| config.url == _API.API_FORGET_PAEEWORD|| config.url == _API.API_FORGET_PAEEWORD2|| config.url == _API.API_FORGET_PAEEWORDOK|| config.url == _API.API_LOGOUT){
        config.headers = {
            'Content-Type': 'application/json'
        };
    }else if(config.url == _API.API_OWN_SPACE||config.url == _API.API_EDIT_PAEEWORD ||config.url == _API.API_JOBPEOPLE_SAVE){
        let old_token = sessionStorage.getItem('old_cookieaccess_token');
        if(old_token){ 
            config.headers = {
                'Authorization': 'Bearer ' + old_token,
                'Content-Type': 'application/json'
            };
        }else{
            if (token) {
                config.headers = {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                };
            }
        }
    }else{
        if (token) {
            config.headers = {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            };
        }
    }
    config.url = config.url+'?random='+new Date().getTime()
    config.data = JSON.stringify(config.data);
    return config;
},error => {
    return Promise.reject(error);
    }
);
// http response 拦截器
axios.interceptors.response.use(
    response => {
        if (response.data.errCode == 2) {
            router.push({
                path: '/login',
                query: {redirect: router.currentRoute.fullPath}// 从哪个页面跳转
            });
        }
        return response;
    },
    error => {
        if (error.response) {
            Message.error(error.response.data.message)
        }
    }
);

export function post (url, data = {}) {
    return axios.post(url, data)
}

export function get (url, data = {}) {
    return axios.get(url, data)
}
