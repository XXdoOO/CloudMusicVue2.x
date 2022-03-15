import Vue from 'vue';
import App from './App.vue';
import router from "./router/index";
import global from "./global/global.js";
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router,
  beforeCreate() {
    Vue.prototype.$bus = this;
    Vue.prototype.GLOBAL = global;
  },
}).$mount('#app')