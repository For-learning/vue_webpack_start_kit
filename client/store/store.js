import Vuex from 'vuex'

import defaultState from './state/state'
import mutations from './mutations/mutations'
import getters from './getters/getters'
import actions from './actions/actions'

const isDev = process.env.NODE_ENV === 'development'

export default () => {
  const store = new Vuex.Store({
    /**
     * CROWN：
     * 这个配置防止store在外面直接赋值而不是采用调用store方法的方式进行赋值操作，
     * 只在开发环境下打开使用
     */
    strict: isDev,
    /**
     * CROWN：
     * state 是用来做数据存储的
     */
    state: defaultState,
    /**
     * CROWN：
     * mutations 是用来做同步数据操作的
     */
    mutations,
    /**
     * CROWN：
     * getters 相当于computed方法
     */
    getters,
    /**
     * CROWN：
     * actions 是用来做异步数据操作的
     */
    actions
    /**
     * CROWN：
     * store的插件
     * 1. 插件在初始化的时候只会调用一次，但是我们可以在里面做一些订阅，监听等操作
     * 2. 其本质就是一些函数集合，从上到下依次执行
     */
    // plugins: [
    //   (store) => {
    //     console.log('my plugin invoked')
    //   }
    // ]
    /**
     * CROWN：
     * 用于模块化store的数据
     * 1. 默认情况下mutations，getters，actions会被放到全局中执行，因此推荐配置 namespaced: true,
     * 2. 当配置namespaced: true之后，如果想使用全局的三个数据操作方法，则配合 { root: true } 来进行调用
     * 3. btw，模块是可以进行无限级嵌套的
     */
    // modules: {
    //   a: {
    //     namespaced: true,
    //     state: {
    //       text: 1
    //     },
    //     mutations: {
    //       updateText (state, text) {
    //         console.log('a.state', state)
    //         state.text = text
    //       }
    //     },
    //     getters: {
    //       textPlus (state, getters, rootState) {
    //         return state.text + rootState.b.text
    //       }
    //     },
    //     actions: {
    //       add ({ state, commit, rootState }) {
    //         commit('updateCount', { num: 56789 }, { root: true })
    //       }
    //     }
    //   },
    //   b: {
    //     namespaced: true,
    //     state: {
    //       text: 2
    //     },
    //     actions: {
    //       testAction ({ commit }) {
    //         commit('a/updateText', 'test text', { root: true })
    //       }
    //     }
    //   }
    // }
  })

  /**
   * CROWN：
   * store数据热替换功能
   * 当在开发环境的时候，更改store里面的代码，页面会进行刷新操作
   * 以下配置会进行热替换，页面不用刷新，提高开发效率
   */
  if (module.hot) {
    module.hot.accept([
      './state/state',
      './mutations/mutations',
      './actions/actions',
      './getters/getters'
    ], () => {
      const newState = require('./state/state').default
      const newMutations = require('./mutations/mutations').default
      const newActions = require('./actions/actions').default
      const newGetters = require('./getters/getters').default

      store.hotUpdate({
        state: newState,
        mutations: newMutations,
        getters: newGetters,
        actions: newActions
      })
    })
  }

  return store
}
