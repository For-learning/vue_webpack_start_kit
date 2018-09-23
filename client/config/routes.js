// import Todo from '../views/todo/todo.vue'
// import Login from '../views/login/login.vue'

export default [{
    path: '/',
    redirect: '/app'
  },
  {
    /**
     * CROWN：
     * /app/:id 的参数可以在component中通过$router获取
     * 如果设置来 props: true 后，则参数会以props的形式传入到component中
     * 
     */
    // path: '/app/:id', // /app/xxx
    path: '/app',
    props: true,
    // props: (route) => ({ id: route.query.b }),
    component: () =>
      import( /* webpackChunkName: "todo-view" */ '../views/todo/todo.vue'),
    // component: Todo,
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
    beforeEnter(to, from, next) {
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
    component: () =>
      import( /* webpackChunkName: "login-view" */ '../views/login/login.vue')
    // component: Login
  }
]