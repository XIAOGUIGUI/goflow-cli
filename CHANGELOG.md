## Unreleased

* [null]

## 1.2.0 (Jul 31, 2019)

* 添加游戏打包命令行
* 更新find-port-free-sync版本号

## 1.1.9 (Jul 30, 2019)

* 修复开发过程中sass依赖文件修改无法自动刷新

## 1.1.8 (Jul 19, 2019)

* 修复开发环境ip地址及端口号查找错误
* 添加压缩代码是否去除console的配置
* 修复自定义变量在process下字符串类型自动添加引号的问题

## 1.1.7 (May 29, 2019)

* 修复webpack模式多线程压缩es6代码错误
* 修复gulp模式html页面内联样式图片路径错误

## 1.1.6 (Mar 4, 2019)

* 修复webpack模式动态引入代码打包错误问题
* 修复gulp模式html页面js-beautify最新版本代码错误问题

## 1.1.5 (Mar 1, 2019)

* 修复gulp模式html页面内嵌css代码压缩错误问题

## 1.1.4 (Mar 1, 2019)

* 修复gulp模式css代码压缩错误问题

## 1.1.3 (Feb 18, 2019)

* 添加gulp模式图片webp格式支持

## 1.1.2 (Feb 15, 2019)

* 修复gulp打包非多语言页面失败

## 1.1.1 (Dec 20, 2018)

* 修复vux多语言替换无效问题
* 修复vue框架开发过程中vue devtools无法使用问题
* 修复静态检查vue文件空样式问题

## 1.1.0 (Dec 13, 2018)

* 添加webpack打包dll文件功能
* 添加对vux框架的支持
* 添加less编译及按需加载功能
* 添加代码分割配置功能
* 添加loader的include配置功能
* 修复webpack模式下htm代码无法inline问题

## 1.0.9 (Nov 21, 2018)

* 修复移动端低版本babel编译兼容问题

## 1.0.8 (Nov 20, 2018)

* 修复service worker资源localStorage的key键相同问题，与service worker的cashId一致

## 1.0.7 (Oct 30, 2018)

* 添加service worker资源cdn的支持

## 1.0.6 (Oct 26, 2018)

* 添加多页面支持。
* 添加雪碧图rem配置不转换支持。
* 添加process自定义变量的支持。
* 添加service-worker分开部署的支持

## 1.0.5 (Sep 27, 2018)

* 修复打包element-ui代码无法运行。

## 1.0.4 (Sep 27, 2018)

* 修复css兼容性在非Windows系统无法添加。
* 修复svg-sprite-loader非本地node_modules指向。


## 1.0.3 (Sep 18, 2018)

* 修复雪碧图生成样式图标名逗号不换行问题
* 修复css样式不添加兼容性代码问题
* 增加svg文件处理配置
* 增加环境自定义变量

## 1.0.2 (Sep 11, 2018)

* 修复webpack模式打包publicPath错误问题

## 1.0.1 (Sep 10, 2018)

* 模板引擎添加node_env参数
* 优化雪碧图生成代码样式
* 优化静态检查生成报告

## 1.0.0 (Aug 29, 2018)

* 发布第一版本goflow命令行工具
