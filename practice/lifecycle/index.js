import Vue from 'vue'

const app = new Vue({
  // el: '#root',
  // template: '<div>{{text}}</div>',
  data: {
    text: 0
  },
  beforeCreate () {
    console.log(this.$el, 'beforeCreate')
  },
  created () {
    console.log(this.$el, 'created')
  },
  beforeMount () {
    console.log(this.$el, 'beforeMount')
  },
  mounted () {
    console.log(this.$el, 'mounted')
  },
  beforeUpdate () {
    console.log(this, 'beforeUpdate')
  },
  updated () {
    console.log(this, 'updated')
  },
  activated () { // 在组件章节讲解
    console.log(this, 'activated')
  },
  deactivated () { // 在组件章节讲解
    console.log(this, 'deactivated')
  },
  beforeDestroy () {
    console.log(this, 'beforeDestroy')
  },
  destroyed () {
    console.log(this, 'destroyed')
  },
  render (h) {
    throw new TypeError('render error')
    // console.log('render function invoked')
    // return h('div', {}, this.text)
  },
  renderError (h, err) {
    return h('div', {}, err.stack)
  },
  errorCaptured () {
    // 会向上冒泡，并且正式环境可以使用
  }
})

app.$mount('#root')
// setInterval(() => {
//   app.text = app.text += 1
// }, 1000)

setTimeout(() => {
  app.$destroy()
}, 1000)

/**
 * 1. 没有// el: '#root' 和 app.$mount('#root') 的话，beforeMount ()和mount ()是不会在vue进行实例化的时候触发的。
 * 2. 具体声明周期图参见官方文档的图，非常详细。
 * 3. renderError () 只会捕捉当前Vue实例中render的错误。errorCaptured() 会捕获所有错误包括子组件
 * 4. 因为template的本质就是，Vue会将其转换成render函数。
 * 5. render (h)方法其实是在beforeMount ()和mount ()之间执行。其实这两者之间就是做了render这件事情。
 * 6. beforeUpdate 和 updated 当有数据更新的时候执行
 */
