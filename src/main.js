import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/vant.js';
import axios from 'axios';

import AMapLoader from '@amap/amap-jsapi-loader';
import './assets/css/global.css';
import './assets/js/sdk';

const devicesid = '790032659'; // 设备id
const apikey = 'mY81iO40=H7=dCbFdjeEc338C48='; // 该设备的apikey
Vue.prototype.$AMapLoader = AMapLoader;
Vue.prototype.$axios = axios;
Vue.prototype.$devicesid = devicesid;
Vue.prototype.$oneNetApi = new OneNetApi(apikey);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
