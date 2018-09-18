module.exports = config => {
  const {userArgs, env} = config[process.env.NODE_ENV]
  let data = {
    'process.env': process.env.NODE_ENV,
    NODE_ENV: JSON.stringify(env),
    DEBUG: JSON.stringify(process.env.NODE_ENV === 'dev')
  }
  if (typeof userArgs !== 'undefined') {
    for (let key in userArgs) {
      data[key] = JSON.stringify(userArgs[key])
    }
  }
  return data
}
