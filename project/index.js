const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const _ = require('lodash')

// 获取默认项目类型模板
const getDefalutProjectType = () => {
  const {
    project
  } = JSON.parse(fs.readFileSync(path.resolve(__dirname, './package.json'), 'utf8'));

  for (let k in project) {
    let result = {
      description: project[k],
      type: 'defalut',
      path: path.resolve(__dirname, `./project/${ k }`)
    }
    project[k] = result
  }
  return project;
}
exports.getProjectType = getDefalutProjectType;
// 新建默认类型项目
const newDefaultProject = async (data) => {
  let {
    name,
    path: projectPath,
    version,
    isSourcePath,
    typeSourcePath,
    author,
    description = ''
  } = data
  fs.ensureDirSync(projectPath)
  // package.json
  let packageJSON = {
    name,
    version,
    author,
    description
  }
  let isNeedNpminstall = false
  // cope type folder
  fs.copySync(typeSourcePath, path.resolve(projectPath, './'))
  let packageJsonPath = path.resolve(projectPath, './package.json')
  const packageObj = fs.readJsonSync(packageJsonPath)
  // package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(_.defaultsDeep(packageJSON, packageObj), null, 2))
 
  // README
  fs.writeFileSync(path.resolve(projectPath, './README.md'), `# ${ name }`, 'utf8')

  // copy .gitignore .editorconfig
  const gitignoreFile = path.resolve(__dirname, './project/gitignore')
  const editorconfigFile = path.resolve(__dirname, './project/editorconfig')


  fs.copySync(gitignoreFile, path.resolve(projectPath, './.gitignore'))
  fs.copySync(editorconfigFile, path.resolve(projectPath, './.editorconfig'))

  if (isNeedNpminstall && shell.cd(projectPath)) {
    console.log('installing local node_modules')
    shell.exec(`npm i`);
  }
  data.newProjectSuccessMessage = `➜ You can${ !isSourcePath ? chalk.blue.bold( ` **cd ${ name }**`) + ' and' : '' } run ${ chalk.blue.bold( '**lf dev**' ) } to start workflow.dev`;
  return data;
}
// 新建项目
exports.new = async (data) => {
  let {
    name,
    path: projectPath,
    isSourcePath,
    typeTpl
  } = data;
  if (!isSourcePath) {
    data.path = projectPath = path.resolve(projectPath, `./${name}`);
  }

  if (!isSourcePath && fs.existsSync(projectPath)) {
    return '项目已存在';
  }

  if (fs.existsSync(data.path) && glob.sync(`${data.path}/**/*`).length > 0) {
    return '路径存在其他文件';
  }
  switch (typeTpl) {
    case 'defalut':
      return await newDefaultProject(data)
    default:
      return '找不到该类型项目'
  }
}