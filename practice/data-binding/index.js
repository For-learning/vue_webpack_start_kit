import Vue from 'vue'

new Vue({
  el: '#root',
  // template: `
  //   <div :id="aaa" @click="handleClick" v-on:click="handleClick">
  //     <p v-html="html"></p>
  //   </div>
  // `,
  template: `
    <div
      :class="[{ active: isActive }]"
      :style="[styles, styles2]"
    >
      <p>{{getJoinedArr(arr)}}</p>
    </div>
  `, // <p>{{getJoinedArr(arr)}}</p> 更推荐用computed去做，因为会根据arr是否变化从而决定是否要进行计算，现在是每次render都会做计算
  data: {
    isActive: false,
    arr: [1, 2, 3],
    html: '<span>123</span>',
    aaa: 'main',
    styles: {
      color: 'red',
      appearance: 'none'
    },
    styles2: {
      color: 'black'
    }
  },
  methods: {
    handleClick () {
      alert('clicked') // eslint-disable-line
    },
    getJoinedArr (arr) {
      return arr.join(' ')
    }
  }
})

/**
 * Crown:
 * 可以在{{}}做一些简单的操作，比如三元表达式或者全局对象方法等如 Date.now()
 * v-html="html" 指定渲染html
 * // eslint-disable-line 挺有用哈
 * @click = v-on:click
 */
