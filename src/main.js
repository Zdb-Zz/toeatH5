// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible/flexible.js'
import Vant from 'vant';
import 'vant/lib/index.css';
import 'jquery'
import echarts from 'echarts'
import { Lazyload,Dialog } from 'vant';


// 全局注册


Vue.use(Vant);
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.use(Lazyload);
Vue.use(Dialog);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
