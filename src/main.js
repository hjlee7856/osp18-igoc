import Vue        from 'vue'
import App        from './App'
import axios      from 'axios'

import { router } from './route/index.js'
import { store  } from './store/store.js'

Vue.config.productionTip = false;
Vue.prototype.$http      = axios;

new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    router,
    store
});