module.exports = config => {
  const {userArgs, env} = config[process.env.NODE_ENV]
  let data = {
    'process.env': process.env.NODE_ENV,
    'process.NODE_ENV': JSON.stringify(env),
    'process.DEBUG': JSON.stringify(process.env.NODE_ENV === 'dev'),
    NODE_ENV: JSON.stringify(env),
    DEBUG: JSON.stringify(process.env.NODE_ENV === 'dev')
  }
  if (typeof userArgs !== 'undefined') {
    for (let key in userArgs) {
      data[key] = JSON.stringify(userArgs[key])
      data[`process.${key}`] = JSON.stringify(userArgs[key])
    }
  }
  return data
}
