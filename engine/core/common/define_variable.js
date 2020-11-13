module.exports = config => {
  const { userArgs, env } = config[process.env.NODE_ENV]
  let data = {
    'process.env': process.env.NODE_ENV,
    'process.NODE_ENV': env,
    'process.DEBUG': JSON.stringify(process.env.NODE_ENV === 'dev'),
    NODE_ENV: env,
    DEBUG: process.env.NODE_ENV === 'dev'
  }
  if (typeof userArgs !== 'undefined') {
    for (let key in userArgs) {
      if (typeof userArgs[key] !== 'string') {
        userArgs[key] = JSON.stringify(userArgs[key])
      } else {
        userArgs[key] = userArgs[key]
      }
      data[key] = userArgs[key]
      data[`process.${key}`] = JSON.stringify(userArgs[key])
    }
  }
  return data
}
