import Tabs from './tabs.vue'
import Tab from './tab.vue'

/**
 * 通过vue注册组件的方式注册全局通用的组件
 * 而不得通过在页面上路由传统方式来加载
 */
export default (Vue) => {
  Vue.component(Tabs.name, Tabs)
  Vue.component(Tab.name, Tab)
}
