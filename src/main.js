// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueFire from 'vuefire'
// import router from './router'
import VTooltip from 'v-tooltip'
import Toasted from 'vue-toasted'
import VueClipboard from 'vue-clipboard2'
import VueRouter from 'vue-router'
import Home from './components/Home'
import Tool from './components/Tool'

Vue.use(VueFire)
Vue.use(VTooltip)
Vue.use(Toasted)
Vue.use(VueClipboard)
Vue.use(VueRouter)

const routes = [
  { path: '/:name', component: Tool },
  { path: '/', component: Home }
]

const router = new VueRouter({
  routes: routes,
  mode: 'history'
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})
