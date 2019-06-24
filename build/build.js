'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'                   // process对象是一个global（全局变量），提供有关信息，控制当前Node.js进程。

const ora = require('ora')                            // 主要用来实现node.js命令行环境的loading效果，和显示各种状态的图标等。
const rm = require('rimraf')                          // 实现node.js环境的UNIX命令rm -rf                                           // rimraf(f, [opts], callback)
const path = require('path')                          // path模块提供了一些工具函数，用于处理文件与目录的路径。这是node.js一个自带的模块。 会根据Node.js应用程序运行的操作系统的不同而变化
const chalk = require('chalk')                        // 命令行输出各种样式的字符串。                                                // chalk.<style>[.<style>...](string, [string...]) chalk.red.bold.underline('Hello', 'world')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
