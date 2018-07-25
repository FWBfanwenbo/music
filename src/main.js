import "babel-polyfill"
import 'js/hack'
import Vue from 'vue'
import App from './App'
import 'lib-flexible/flexible.js'
import router from './router'
import store from './store'
import fastClick from 'fastclick'
import VueLazyload from 'vue-lazyload'

import 'stylus/index.styl'
Vue.config.productionTip = false;
fastClick.attach(document.body);
/* eslint-disable no-unused-vars */
// import vConsole from 'vconsole'

Vue.use(VueLazyload,{
  loading:require('img/default.png')
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
