const tokenize = require('../lib/tokenize')
const test = require('ava')

test('parses variable declarations', t => {
  t.deepEqual(tokenize('$foo: bar;'), {foo: 'bar'})
  t.deepEqual(tokenize('$foo-bar: baz;'), {'foo-bar': 'baz'})
  t.deepEqual(tokenize(`
    // comment before
    $x: a;
    // comment after
    /* block comment before */
    $y: b; // comment after
    /* there's a comment here */$z: c;/* and here */
  `), {x: 'a', y: 'b', z: 'c'})
})

test('parses numbers', t => {
  t.deepEqual(tokenize('$x: 1;'), {x: 1})
})

test('does not parse nested declarations', t => {
  t.deepEqual(tokenize('html { $foo: 1; }'), {})
})

test('parses lists', t => {
  t.deepEqual(tokenize('$a: (b, c);'), {'a': ['b', 'c']})
})

test('parses dicts', t => {
  t.deepEqual(tokenize('$a: (b: c);'), {'a': {b: 'c'}})
})
