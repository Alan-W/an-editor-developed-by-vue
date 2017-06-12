import Vue from 'vue';
import VueRouter from 'vue-router';

// 导入要用的组件
// var ToolBar = require('../components/ToolBar.vue');

Vue.use(VueRouter); // 注册 vue-router

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: '哇咔咔',
      // component: ToolBar ,
    },
  ],
});
