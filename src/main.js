import Vue from 'vue';
import Index from './Index';
import router from './router';

// import jQuery from 'jquery';
import AMap from 'vue-amap';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import $ from 'jquery';
window.$ = $
window.jQuery = $;
import '../static/lib/js/jquery-ui/jquery-ui.js'
import Bootstrap from 'bootstrap';
import globalConfig from './store/dataConfig/globalConfig'
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

Vue.use(AMap) 

AMap.initAMapApiLoader({
	key: globalConfig.amapKey,
	plugin: ['Autocomplete', 'PlaceSearch', 'Scale', 'OverView', 'PolyEditor', 'CircleEditor']
})
// mount with global
Vue.use(VueAwesomeSwiper)

// 定义获取数据的store
import store from './store'

// 集成所有的模块儿
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#index',
  store, // 在vue 实例中, 引入vuex 的store
  // router, // 在vue 实例中,引入定义的路由
  template: '<Index/>',
  components: { Index },
});


