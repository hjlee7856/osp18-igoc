import Vue         from 'vue'
import VueRouter   from 'vue-router'

import TodoContent from '../components/TodoContent.vue'
import TodoLogin   from '../components/TodoLogin.vue'

Vue.use(VueRouter);

export const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/',        component: TodoLogin   },
        { path: '/content', component: TodoContent },
        { path: '*',        component: TodoLogin   }
    ]
});