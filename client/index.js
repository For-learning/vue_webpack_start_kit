import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './app.vue'

import './assets/styles/global.styl'
import createRouter from './config/router'
import createStore from './store/store'

Vue.use(VueRouter)
Vue.use(Vuex)

const router = createRouter()
const store = createStore()

store.registerModule('c', {
  state: {
    text: 3
  }
})
// store.unregisterModule('c')

/**
 * CROWN：
 * store 中的watch方法
 */
// store.watch((state) => state.count + 1, (newCount) => {
//   console.log('new count watched:', newCount)
// })

/**
 * CROWN：
 * 当 store 中的mutation被调用的时候会触发这个方法，即监听mutation的调用。
 */
// store.subscribe((mutation, state) => {
//   console.log(mutation.type)
//   console.log(mutation.payload)
// })

/**
 * CROWN：
 * 当 store 中的action被调用的时候会触发这个方法，即监听action的调用。
 */
store.subscribeAction((action, state) => {
  console.log(action.type)
  console.log(action.payload)
})

/**
 * CROWN：
 * 导航守卫
 * beforeEach
 */
router.beforeEach((to, from, next) => {
  console.log('before each invoked')
  next()
  // if (to.fullPath === '/app') {
  //   next({ path: '/login' })
  // } else {
  //   next()
  // }
})

/**
 * CROWN：
 * 导航守卫
 * beforeResolve
 */
router.beforeResolve((to, from, next) => {
  console.log('before resolve invoked')
  next()
})

/**
 * CROWN：
 * 导航守卫
 * afterEach
 */
router.afterEach((to, from) => {
  console.log('after each invoked')
})

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#root')
