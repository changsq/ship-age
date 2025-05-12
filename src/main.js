// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import config from '@/config'
import './index.less'
import dataV from '@jiaminghi/data-view'
import Antd from 'ant-design-vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'ant-design-vue/dist/antd.css'
import echarts from 'echarts';
import ElementUI from 'element-ui'
import * as THREE from 'three'
import * as ThreeStats from 'three-stats'
import 'element-ui/lib/theme-chalk/index.css';

// 实际打包时应该不引入mock
/* eslint-disable */
//                                                                                                                    
Vue.use(Antd);
Vue.use(iView)
Vue.use(dataV)
Vue.prototype.$echarts = echarts
Vue.use(ElementUI);
Vue.use(VueAxios, axios)
Vue.prototype.$axios = axios;

axios.interceptors.request.use((config) => {
  let token = sessionStorage.getItem('hdToken')
  let id = sessionStorage.getItem('id')
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
    config.headers.operateUserId = id
  }
  return config;
}, (error) => {
  return Promise.reject(error);
})
let isHandling401 = false
function handle401Error() {
  if (isHandling401) return; // 如果已经在处理 401 错误，直接返回
  isHandling401 = true; // 设置标志变量
  // 创建一个模态对话框
  Vue.prototype.$alert('当前无权限，即将返回工作台！', '错误', {
    confirmButtonText: '确定',
    callback: action => {
      if (action === 'confirm') {
        sessionStorage.removeItem('hdToken');
        window.parent.postMessage({showstatusMonitoring:false},'*');
        isHandling401 = false; // 重置标志变量
      }
    }
  });
}
// 添加响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.data && response.data.code === 401) {
      handle401Error();
    } else {
      return response;
    }
  },
  error => {
    // 处理其他错误
    if (error.response && error.response.status === 401) {
      handle401Error();
    }
    return Promise.reject(error);
  }
);

Vue.prototype.THREE = THREE
Vue.prototype.ThreeStats = ThreeStats
/**
 * @description 注册admin内置插件
 */

/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
