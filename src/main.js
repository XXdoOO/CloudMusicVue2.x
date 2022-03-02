import Vue from 'vue';
import App from './App.vue';
import router from "./router/index";
import global from "./global.js";
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router,
  beforeCreate() {
    Vue.prototype.$bus = this;
    Vue.prototype.GLOBAL = global;
    console.log("全局变量：", this.GLOBAL);
  },
}).$mount('#app')