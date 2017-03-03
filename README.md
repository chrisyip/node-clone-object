# node-clone-object

[![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Travis CI][travis-image]][travis-url] [![codecov][codecov-image]][codecov-url]

Clone object with:

- Circular references
- Property descriptors
- Symbol properties
- Non-enumerable properties

## Install

```
npm i clone-obj
// or
yarn add clone-obj
```

Requires `node >= 6`

## Usage

```js
const clone = require('clone-obj')
const newObj = clone(obj)
```

### `undefined` or `null`

`clone-obj` will throw `TypeError: Cannot clone undefined or null` when cloning `undefined` or `null`.

### Primitive values

`clone-obj` will return primitive values directly.

```js
clone(1) === 1
clone(true) === true
clone('foo') === 'foo'
```

### Objects

#### Object created by `new` operator

`clone-obj` will use `obj.constructor` to create new object.

```js
const arr = []
clone(arr) !== arr

const foo = new Date()
const bar = clone(date)
bar !== foo
bar.getTime() === foo.getTime()

const foo = new Buffer('foo')
const bar = clone(date)
Buffer.isBuffer(bar)
bar !== foo
bar.toString() === foo.toString()
```

#### Plain object

```js
const foo = { a: 1 }
const bar = clone(foo)
bar !== foo
bar.a === foo.a
```

#### Circular references

`clone-obj` will auto link circular references with cloned objects.

```js
const foo = {}
foo.self = foo
const bar = clone(bar)

foo !== bar
foo.self !== bar.self
bar === bar.self
console.log(bar) // { self: [Circular] }
```

#### Property descriptors

`clone-obj` respects property descriptors.

```js
const foo = {
  get baz () { return this._baz * 2 },
  set baz (val) { this._baz = val }
}
const bar = clone(foo)

typeof bar._baz === 'undefined'
isNaN(bar.baz)
bar.baz = 2
bar._baz === 2
bar.baz === 4
```

#### Symbols properties

```js
const sym = Symbol('foo')
const foo = { [sym]: 1 }
const bar = clone(bar)
bar.hasOwnProperty(sym)
bar[sym] === foo[sym]
```

#### Non-enumerable properties

```js
const foo = {}
Object.defineProperty(foo, 'baz', {
  enumerable: false,
  value: 1
})
const bar = clone(foo)

const descriptor = Object.getOwnPropertyDescriptor(bar. 'baz')
descriptor.enumrable === false
Object.keys(bar).length === 0
foo.baz === bar.baz === descriptor.value
```

#### Arrays

```js
const foo = [1, {}]
const bar = clone(foo)
Array.isArray(foo)
foo !== bar
foo.length === bar.length
foo[0] === bar[0]
foo[1] !== bar[1]

const foo = { a: [1] }
const bar = clone(foo)
Array.isArray(bar.a)
foo.a !== bar.a
foo.a.length === bar.a.length
```

[npm-url]: https://npmjs.org/package/clone-obj
[npm-image]: http://img.shields.io/npm/v/clone-obj.svg?style=flat-square
[daviddm-url]: https://david-dm.org/chrisyip/clone-obj
[daviddm-image]: http://img.shields.io/david/chrisyip/clone-obj.svg?style=flat-square
[travis-url]: https://travis-ci.org/chrisyip/node-clone-object
[travis-image]: http://img.shields.io/travis/chrisyip/node-clone-object.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/chrisyip/node-clone-object
[codecov-image]: https://img.shields.io/codecov/c/github/chrisyip/node-clone-object.svg?style=flat-square
