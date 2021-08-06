import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import VueSvgInlinePlugin from 'vue-svg-inline-plugin';
import App from './App';
import router from './router';
import './assets/scss/app.scss';

Vue.use(VueCompositionAPI);
Vue.use(VueSvgInlinePlugin);
Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
