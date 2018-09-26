module.exports = (isDev) => {
  return {
    /**
     * 去掉vue template中无用的空格以便放置样式或者解析可能出现的问题
     */
    preserveWhitepace: true,
    /**
     * vue默认不会配合 extract-text-webpack-plugin 插件把vue文件中的css单独打包到一个css中，以便模块化加载
     * 这个配置项会让其配合上述插件完成这个功能
     *
     * btw：style-loader 无法完成vue的css热替换功能，因此我们选择vue-style-loader代替
     */
    extractCSS: !isDev,
    /**
     * 1. 将vue中的css样式生成独一无二的名字，防止样式冲突和提高了安全性
     * 2. 将生成的名字用camelCase的方式进行命名防止在js需要调用类名时不方便的情况
     * 如何调用：
     * <style lang="stylus" module>
     * <header :class="$style.mainHeader">
     */
    cssModules: {
      localIdentName: isDev ? '[path]-[name]-[hash:base64:5]' : '[hash:base64:5]',
      camelCase: true
    },
    // hotReload: false, // 根据环境变量生成
  }
}
