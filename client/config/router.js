import Router from 'vue-router'

import routes from './routes'

export default () => {
  return new Router({
    routes,
    /**
     * CROWN：
     * hash# 路由一般用来定位的，也不会被搜索引擎解析，SEO会变得不好，因此改为history正常模式。
     */
    mode: 'history',
    /**
     * CROWN：
     * base作为路由的基础路径，比如login会变为localhost:8080/base/login，注意，两头加上/。
     */
    // base: '/base/',
    /**
     * CROWN：
     * <router-link to="/app/456">app456</router-link>
     * <router-link to="/login">login</router-link>
     * 页面内链接router跳转使用的是router-link标签，下面两个配置为router-link激活/不被激活时的样式存在的。
     * 注意：当存在子连接的时候，linkActiveClass表示所有匹配链接集合，linkExactActiveClass表示真正准确匹配的链接。
     */
    linkActiveClass: 'active-link',
    linkExactActiveClass: 'exact-active-link',
    /**
     * CROWN：
     * to是将要跳转的component对象，from是从哪个component来，
     * 这个功能是记录上次浏览页面的滚动位置，当回到上个页面的时候，给用户更好的体验。
     * by the word
     * 传统的web当回到上次浏览页面的时候都是回到页面最顶端，或事一些高级浏览器帮实现了记录位置的功能。
     */
    scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    }
    /**
     * CROWN：
     * 不是所有浏览器都支持 mode: "history", 这种模式，如果不支持，vue会自动切换到hash的形式。
     */
    // fallback: true
    /**
     * CROWN：
     * 当url中带有query参数比如 ?a=123&b=456 中类型的参数的时候，一般会用下面两个函数做处理
     * parseQuery 是将字符串转成json
     * stringifyQuery 是将json专程字符串
     * 不常用
     */
    // parseQuery (query) {

    // },
    // stringifyQuery (obj) {

    // }
  })
}
