const invariant = require('invariant')
const Q = require('query-ast')
const {stringify} = require('scss-parser')
const BANG_DEFAULT = /\s+\!default$/

const T_DECLARATION = 'declaration'
const T_IDENTIFIER = 'identifier'
const T_NUMBER = 'number'
const T_PARENTHESES = 'parentheses'
const T_PUNCTUATION = 'punctuation'
const T_VALUE = 'value'

const toJSON = node => {
  const original = node
  // remove whitespace
  node.find('space').remove()
  // resolve to the actual "value" node
  // XXX note that get(0) returns the wrong "identifier" in dicts
  node = node.get().pop()

  invariant(node.type === T_VALUE || node.type === T_IDENTIFIER,
            `expected "value" node; got "${node.type}"`)
  invariant(node.value.length === 1,
            `expected value.length === 1, got ${node.value.length}`)
  const {type, value} = node.value[0]
  switch (type) {
    case T_NUMBER:
      return Number(value)
    case T_PARENTHESES:
      return parseParens(node)
    default:
      break
  }
  return toString(node)
}

const toString = node => {
  return stringify(node)
    .trim()
    .replace(BANG_DEFAULT, '')
}

const parseParens = node => {
  const {value} = node.value[0]
  const q = Q(node)

  if (value[0].type === T_DECLARATION) {
    // console.warn('dict:', toString(node), value)
    return q(T_DECLARATION)
      .hasParent(node)
      .reduce((obj, decl, i) => {
        const [ident, _, value] = decl.children.map(n => n.node)
        const key = toString(ident)
        obj[key] = toJSON(Q(value)())
        return obj
      }, {})
  } else {
    // console.warn('array:', toString(node), value)
    return q(T_PARENTHESES)
      .children()
      .filter(n => n.node.type !== T_PUNCTUATION)
      .reduce((list, value, i) => {
        list.push(toJSON(Q(value.node)()))
        return list
      }, [])
  }
  return toString(node)
}

module.exports = toJSON
