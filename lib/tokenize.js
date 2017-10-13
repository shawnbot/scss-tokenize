const {parse} = require('scss-parser')
const Q = require('query-ast')
const toJSON = require('./to-json')

const tokenize = (scss, options={}) => {
  const ast = parse(scss)
  const q = Q(ast)
  const tokens = q('declaration')
    .hasParent('stylesheet')
    .has('property')
    .has('variable')
    .reduce((tokens, {node}, i) => {
      node = Q(node)
      const name = node('variable').first().value()
      tokens[name] = toJSON(node('value'))
      return tokens
    }, {})

  return tokens
}

module.exports = tokenize
