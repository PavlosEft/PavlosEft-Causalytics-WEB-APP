import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

Vue.use(VueToast);
Vue.use(Vuetify);

export default new Vuetify({    
  theme: { dark: true },
});
