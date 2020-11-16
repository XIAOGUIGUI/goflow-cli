# 安装说明

## 一、使用环境说明

在window系统下，必须安装好node环境和git命令，mac系统安装node环境就行了


## 二、安装步骤

在window系统下，请先设置host。
> 151.101.76.133 raw.githubusercontent.com

然后打开命令行工具：

```
# 1. 先检查下 Node.js 是否安装成功
$ node -v
v8.9.0

$ npm -v
5.6.0

# 2. 在电脑找个位置clone 项目
$ git clone https://github.com/XIAOGUIGUI/goflow-cli.git


# 3. 安装依赖，走你
$ cd goflow-cli
$ npm install --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
$ npm link
$ gf -v
```

## 三、安装常见问题

1.  node-gyp在window系统下无法安装。解决方法使用下面命令行，必须使用管理员模式的命令行运行,安装过程可能有点久，请耐心等待。

    ```
    npm install --global --production windows-build-tools
    ```
    安装的过程中可能会卡住或者安装失败，这是因为.NET Framework的版本过低,升级即可.
    升级步骤
    直接下载安装.net framework的开发包。我下的是4.6.2

    开发包下载链接：https://dotnet.microsoft.com/download/visual-studio-sdks

    选择Developer Pack ，点击下载。下载开发包后直接双击安装即可。

2. node-sass 安装失败
    设置变量 sass_binary_site，指向淘宝镜像地址。示例
    ```
    npm install --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
    
    ```