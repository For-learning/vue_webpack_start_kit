const Router = require('koa-router')
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const MemoryFS = require('memory-fs')
const webpack = require('webpack')
const VueServerRenderer = require('vue-server-renderer')

const serverRender = require('./server-render')
const serverConfig = require('../../build/webpack.config.server')

/**
 * 创建serverCompiler：node端使用webpack的方式
 */
const serverCompiler = webpack(serverConfig)
/**
 * memory-fs 和 node 中的 fs 的api都是一样的，并且做了一些扩展
 * 而它是将文件写入到内存，提高了文件的读写速度
 */
const mfs = new MemoryFS()
serverCompiler.outputFileSystem = mfs

/**
 * 监听打包
 */
let bundle
serverCompiler.watch({}, (err, stats) => {
  // webpack的报错信息
  if (err) throw err
  // eslint的errors或warnings会封装在stats中，因为eslint不会影响打包的执行，因此需要额外输出这部分错误信息
  stats = stats.toJson()
  stats.errors.forEach(err => console.log(err))
  stats.warnings.forEach(warn => console.warn(err))

  /**
   *？？？输出bundle 的 json文件
   */
  const bundlePath = path.join(
    serverConfig.output.path,
    'vue-ssr-server-bundle.json'
  )
  bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
  console.log('new bundle generated')
})


/**
 * ********************************************************************************************
 */

const handleSSR = async (ctx) => {
  if (!bundle) {
    ctx.body = '你等一会，别着急......'
    return
  }

  /**
   * 获取客户端webpack打包好的json代码
   */
  const clientManifestResp = await axios.get(
    'http://127.0.0.1:8000/public/vue-ssr-client-manifest.json'
  )
  const clientManifest = clientManifestResp.data

  const template = fs.readFileSync(
    path.join(__dirname, '../server.template.ejs'),
    'utf-8'
  )

  /**
   * core
   */
  const renderer = VueServerRenderer
    .createBundleRenderer(bundle, {
      // 不使用官方的注入方式进行注入
      inject: false,
      // 将获取的代码注入到html中
      clientManifest
    })

  await serverRender(ctx, renderer, template)
}

const router = new Router()
router.get('*', handleSSR)

module.exports = router
