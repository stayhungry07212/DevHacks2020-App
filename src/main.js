import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './plugins/router';
import Vuex from 'vuex';
import store from './plugins/store';
import * as firebase from './plugins/firebase'

Vue.use(Vuex)

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  firebase,
  store,
  render: h => h(App)
}).$mount('#app')
