import Vue from 'vue'

const app = new Vue({
  el: '#root',
  template: '<div ref="div">{{text}} {{obj.a}}</div>',
  data: {
    text: 0,
    obj: {}
  }
  // watch: {
  //   text (newText, oldText) {
  //     console.log(`${newText} : ${oldText}`)
  //   }
  // }
})

// app.$mount('#root')
let i = 0

setInterval(() => {
  i++
  // app.text += 1
  // app.text += 1
  // app.text += 1
  // app.text += 1
  // app.text += 1
  // app.obj.a = i
  app.$set(app.obj, 'a', i)
  // app.$forceUpdate()
  // app.$options.data.text += 1
  // app.$data.text += 1
}, 1000)

// console.log(app.$data)
// console.log(app.$props)
// console.log(app.$el)
// console.log(app.$options)
// app.$options.render = (h) => {
//   return h('div', {}, 'new render function')
// }
// console.log(app.$root === app)
// console.log(app.$children)
// console.log(app.$slots)
// console.log(app.$scopedSlots)
// console.log(app.$refs)
// console.log(app.$isServer)

// const unWatch = app.$watch('text', (newText, oldText) => {
//   console.log(`${newText} : ${oldText}`)
// })
// setTimeout(() => {
//   unWatch()
// }, 2000)

// app.$once('test', (a, b) => {
//   console.log(`test emited ${1} ${b}`)
// })

// setInterval(() => {
//   app.$emit('test', 1, 2)
// }, 1000)

// app.$forceUpdate()

/**
 * Crown:
 * 1. 在vue{}中的watch会被vue管理起来，而用app.$watch方式声明的watch如果不用，要手动销毁
 * 2. 其实在vue{}中声明的方法和事件都是在执行app.$+方法。
 * 3. 当vue data中的一个对象没有某一个属性，而这个属性是在后期方法中加上去的，对于这个属性的绑定不会触发reactive方法，则需要用到app.$forceUpdate()去强制执行。
 * 4. app.$on 和 app.$emit 的绑定和触发只在当前vue实例有用，不能跨实例。
 * 5. 参考3，如果确实要在方法执行期间向vue的data做新的数据绑定，则使用app.$set(app.obj, 'a', i)会出发reactive方法。不需要强制更新了。
 * 6. app.$options.data 和 app.$data 虽然都是指向的vue实例的数据，但是这两个指向的不是同一个实例，对app.$data操作可以做实时的数据更新，另一个则不能。
 * 7. app.$refs 为了更快的定位某个节点。
 * 8. app.$isServer SSR时使用。
 * 9. 所有的 template 都会在vue进行实例化的时候转成render方法去执行，提高执行效率。
 * 10. app.$root === app app.$root指代就是当前根节点。
 * 11.
 * // app.$options.render = (h) => {
 * //   return h('div', {}, 'new render function')
 * // }
 * 当组件下一次渲染的时候会执行这个render而不是组件中定义的render
 * 12.
 * console.log(app.$children) 定位子组件
 * console.log(app.$slots) 插槽
 * console.log(app.$scopedSlots)
 * 13.
 * vue的dom是异步渲染更新的，也就是说，当我们的组件内的数据更新后，并不是每一次的数据更新都会伴随着的DOM的更新，vm.$nextTick([callback])则会监听每次的dom更新，从而允许我们做自定义的操作。
 */
