<h1 align="center"> goflow-cli </h1>
<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img alt="Licence" src="https://img.shields.io/badge/license-MIT-green.svg" />
  </a>
  <a href="">
    <img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-green.svg" />
  </a>
</p>
<p align="center">
  <strong>命令行工具</strong>
</p>
## 最近更新

**[CHANGELOG](./CHANGELOG.md)**

## 依赖

* Node.js >= **8.x**

## 安装

```
npm i goflow-cli -g

# 推荐使用 yarn 安装
yarn global install goflow-cli
```
## 使用

### 查看命令

```
goflow -h

gf -h
```

### 新建项目

```shell
goflow init

# 使用简写
gf init
```

### 开发

```shell
# 进入 goflow 项目
cd test

gf serve

```
### 构建

```shell
# 进入 goflow 项目
cd test

gf build

# 可指定环境
gf build testing
```

### 静态检查

```shell
# 进入 goflow 项目
cd test

gf lint

```

### 全局设置

```shell
# 设置参数
gf set <name> <value>

# 查看参数
gf get <name>

```

# 其他说明待更新
