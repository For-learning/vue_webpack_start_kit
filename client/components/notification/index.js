import Notification from './notification.vue'
import notify from './function'

export default (Vue) => {
  Vue.component(Notification.name, Notification)
  /**
   * 通过在 Vue.prototype 添加属性的方法可以在全局直接调用
   */
  Vue.prototype.$notify = notify
}
