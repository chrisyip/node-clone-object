'use strict'

import test from 'ava'
import isPlainObj from 'is-plain-obj'

import clone from '.'

test('clone-obj', t => {
  t.true(typeof clone === 'function')
})

test('cloning primitive type', t => {
  t.is(t.throws(() => clone(null), TypeError).message, 'Cannot clone undefined or null')
  t.is(t.throws(() => clone(undefined), TypeError).message, 'Cannot clone undefined or null')
  t.is(clone(1), 1)
  t.is(clone('foo'), 'foo')
  t.is(clone(true), true)
})

test('cloning not plain objects', t => {
  const d1 = new Date()
  const d2 = clone(d1)
  t.false(d1 === d2)
  t.false(/Invalid Date/i.test(d2.toString()))

  /* eslint-disable no-new-wrappers */

  const str1 = new String('foo')
  const str2 = clone(str1)
  t.not(str1, str2)
  t.is(str1.valueOf(), str2.valueOf())

  const bool1 = new Boolean(true)
  const bool2 = clone(bool1)
  t.not(bool1, bool2)
  t.is(bool2.valueOf(), bool1.valueOf())

  const num1 = new Number(1)
  const num2 = new Number(num1)
  t.not(num1, num2)
  t.is(num1.valueOf(), num2.valueOf())

  /* eslint-enable no-new-wrappers */
})

test('cloning plain objects', t => {
  let foo = {
    a: 1,
    b: {},
    get c () {
      return this._c * 2
    },
    set c (val) {
      if (typeof val !== 'number') {
        throw new TypeError('requires a number')
      }
      this._c = val
    }
  }

  let bar = clone(foo)

  t.true(isPlainObj(bar))

  t.true(typeof bar._c === 'undefined')
  t.true(isNaN(bar.c))

  bar.c = 1
  t.true(typeof foo._c === 'undefined')
  t.is(bar._c, 1)
  t.is(bar.c, 2)

  t.is(t.throws(() => { bar.c = true }, TypeError).message, 'requires a number')

  foo = { date: new Date(), buffer: new Buffer('foo') }
  bar = clone(foo)
  t.true(bar.date instanceof Date)
  t.is(foo.date.getTime(), bar.date.getTime())
  t.not(foo.date, bar.date)
  t.true(Buffer.isBuffer(bar.buffer))
  t.is(foo.buffer.toString(), bar.buffer.toString())
  t.not(foo.buffer, bar.buffer)
})

test('cloning object with non-enumerable properties', t => {
  const foo = {}
  Object.defineProperty(foo, 'baz', {
    value: 'baz'
  })

  const bar = clone(foo)
  t.is(Object.keys(bar).length, 0)
  t.is(bar.baz, foo.baz)

  const descriptor = Object.getOwnPropertyDescriptor(bar, 'baz')
  t.false(descriptor.enumerable)
  t.is(descriptor.value, foo.baz)
})

test('cloning object with symbol properties', t => {
  const sym = Symbol('foo')
  const foo = {
    [sym]: 1
  }
  const bar = clone(foo)

  t.true(bar.hasOwnProperty(sym))
  t.is(bar[sym], foo[sym])
})

test('cloning object with circular references', t => {
  const foo = { a: {} }
  foo.foo = foo
  foo.foo2 = foo

  const bar = clone(foo)
  t.is(bar, bar.foo)
  t.is(bar, bar.foo.foo)
  t.is(bar, bar.foo.foo2)
  t.is(bar, bar.foo2)
  t.is(bar, bar.foo2.foo)
  t.is(bar, bar.foo2.foo2)
  t.not(bar.a, foo.a)
})

test('cloning array', t => {
  let foo = [1, 'foo', {}]
  let bar = clone(foo)

  t.true(Array.isArray(bar))
  t.not(foo, bar)
  t.is(foo.length, bar.length)
  t.is(foo[0], bar[0])
  t.is(foo[1], bar[1])
  t.not(foo[2], bar[2])

  foo = {
    baz: [1]
  }
  bar = clone(foo)

  t.true(Array.isArray(bar.baz))
  t.not(foo.baz, bar.baz)
  t.is(foo.baz.length, bar.baz.length)
  t.is(foo.baz[0], bar.baz[0])
})
