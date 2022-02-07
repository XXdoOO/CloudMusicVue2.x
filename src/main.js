import Vue from 'vue';
import App from './App.vue';
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this;
  },
}).$mount('#app')

// let a = [{ a: 1 }, { a: 2 }, { a: 3 }];
// let b = [...a];
// let c = [...a];

// b[1].a = 3;
// console.log(b, c);