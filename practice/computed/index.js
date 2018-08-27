import Vue from 'vue'

new Vue({
  el: '#root',
  template: `
    <div>
      <p>Name: {{name}}</p>
      <p>Name: {{getName()}}</p>
      <p>Number: {{number}}</p>
      <p>FullName: {{fullName}}</p>
      <p><input type="text" v-model="number"></p>
      <p>FirstName: <input type="text" v-model="firstName"></p>
      <p>LastName: <input type="text" v-model="lastName"></p>
      <p>Name: <input type="text" v-model="name"></p>
      <p>Obj.a: <input type="text" v-model="obj.a"></p>
    </div>
  `,
  data: {
    firstName: 'Jokcy',
    lastName: 'Lou',
    number: 0,
    fullName: '',
    obj: {
      a: 0
    }
  },
  computed: {
    name: {
      get () {
        console.log('new name')
        return `${this.firstName} ${this.lastName}`
      },
      set (name) {
        const names = name.split(' ')
        this.firstName = names[0]
        this.lastName = names[1]
      }
    }
  },
  watch: {
    'obj.a': {
      handler () {
        console.log('obj.a changed')
        this.obj.a += 1
      },
      immediate: true
      // deep: true
    }
  },
  methods: {
    getName () {
      console.log('getName invoked')
      return `${this.firstName} ${this.lastName}`
    }
  }
})

/**
 * Crown:
 * 1. watch 不必多说，就是监听，二computed和watch有些类似，其里面的方法会根据其依赖的属性的变化进行触发执行，
 * 2. 并且vue会对computed里面的方法做缓存，在vue进行重新渲染的时候，computed里面方法所依赖的属性没有发生变化对时候，则不会执行。
 * 3. 这两个都是进行做监听操作的，computed更适合与监听属性变化在页面显示结果使用，而watch则更适合于发现值的变化往后台发请求类似的操作。
 * 4. 注意：最好不要在这个两个里面对其所依赖的值进行赋值操作，很可能会引起无限监听操作而报错。
 * 
 */