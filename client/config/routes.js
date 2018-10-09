import Todo from '../views/todo/todo.vue'
import Login from '../views/login/login.vue'

export default [{
  path: '/',
  redirect: '/app'
},
{
  /**
     * CROWN：
     * 1.
     * /app/:id 的参数 :id 可以在component中通过$route获取
     * 如果后面有 ?a=123&b=456 这样的参数，则这些值会封装到$route.query对象中
     * btw，无论是 :id 还是 ?a=123&b=456 这种传参方式都可以复用vue组建从而提供效率
     * 2.
     * 如果设置来 props: true 后，则参数会以props的形式传入到component中
     */
  // path: '/app/:id', // /app/xxx
  path: '/app',
  props: true,
  // props: (route) => ({ id: route.query.b }),

  /**
     * CROWN：
     * 配合 babel-plugin-syntax-dynamic-import 插件进行异步模块加载。
     */
  // component: () =>
  //     import(/* webpackChunkName: "todo-view" */ '../views/todo/todo.vue'),
  // // component: Todo,
  component: Todo,

  /**
     * CROWN：
     * 如果页面上有多个 <router-view /> 时候，这个时候可以用命名视图指定哪个<router-view />使用哪个component
     * 1. <router-view /> 使用 default 指定的component
     * 2. <router-view name="a" /> 使用 a 指定的component
     */
  // components: {
  //   default: Todo,
  //   a: Login
  // },

  /**
     * CROWN：
     * 给路由命名，配合 <router-link :to="{name:'app'}">app</router-link> 进行路由跳转
     */
  name: 'app',

  /**
     * CROWN：
     * 相当于给页面中<header>中的<meta>标签进行赋值
     */
  meta: {
    title: 'this is app',
    description: 'asdasd'
  },

  /**
     * CROWN：
     * 导航守卫 - inside router
     * beforeEnter
     */
  beforeEnter (to, from, next) {
    console.log('app route before enter')
    next()
  }

  /**
     * CROWN：
     * 子路由（嵌套路由）
     * btw，不要忘记在component中放置 <router-view /> 以便子component中路由的跳转
     */
  // children: [
  //   {
  //     path: 'test',
  //     component: Login
  //   }
  // ]
},
{
  path: '/login',
  // component: () =>
  //     import(/* webpackChunkName: "login-view" */ '../views/login/login.vue')
  // // component: Login
  component: Login
}
]
