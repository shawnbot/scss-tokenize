module.exports = (tasks, handler) => {
  const len = tasks.length
  let i = 0
  const results = []
  const next = () => {
    if (i < len) {
      return handler(tasks[i++])
        .then(result => results.push(result))
        .then(next)
    } else {
      return results
    }
  }
  return next()
}
