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
import AMap from 'vue-amap';


// 全局注册


Vue.use(Vant);
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.use(Lazyload);
Vue.use(Dialog);
Vue.use(AMap);

  // 初始化vue-amap
AMap.initAMapApiLoader({
  // 高德key
  key: '41a9e76e97ef34cfed9ae9c9a0de887e',
  // 插件集合 （插件按需引入）
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch','AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.Geolocation','AMap.Geocoder', 'AMap.AMapManager', 'AMap.Marker','AMap.ControlBar'],//应用功能项
  v: '1.4.4', //版本
  uiVersion: '1.0' //ui版本
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
