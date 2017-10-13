module.exports = tokens => {
  const pattern = /\$([-\w]+)/gi
  const get = (val, key) => tokens[key]

  return Object.entries(tokens)
    .reduce((result, [name, value]) => {
      while (value.match(pattern)) {
        value = value.replace(pattern, get)
      }
      result[name] = value
      return result
    }, {})
}
