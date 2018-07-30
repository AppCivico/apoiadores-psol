import Vue from 'vue';
import VueScrollTo from 'vue-scrollto';
import App from './App.vue';
import router from './router';
import store from './store';
import translations from './translations';

import { formatBRL, formatBRLDec, formatDate, formatCNPJ, formatDateBasic } from './utilities';

Vue.use(VueScrollTo);

Vue.config.productionTip = false;

Vue.filter('formatBRL', formatBRL);
Vue.filter('formatBRLDec', formatBRLDec);
Vue.filter('formatDate', formatDate);
Vue.filter('formatCNPJ', formatCNPJ);
Vue.filter('formatDateBasic', formatDateBasic);
Vue.filter('upperCase', value => value.toUpperCase());
Vue.filter('lowerCase', value => value.toLowerCase());

Vue.filter('titleCase', str =>
  str
    .split(/\s+/)
    .map((item) => {
      if (item.length > 2) {
        if (item.toLowerCase() === 'dos') {
          return item.toLowerCase();
        }
        return item.charAt(0).toUpperCase() + item.substring(1).toLowerCase();
      }
      return item.toLowerCase();
    })
    .join(' '));

new Vue({
  router,
  store,
  translations,
  render: h => h(App),
}).$mount('#app');

Vue.directive('focus', {
  inserted: (el, binding) => {
    if (binding.value || typeof binding.value === 'undefined') {
      el.focus();
    }
  },
});

