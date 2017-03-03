'use strict'

const isPlainObj = require('is-plain-obj')

function clone (obj, refs, clonedRefs) {
  if (obj == null) {
    throw new TypeError('Cannot clone undefined or null')
  }

  if (Array.isArray(obj)) {
    return obj.map(item => clone(item, refs))
  }

  // For primitive types
  if (typeof obj !== 'object') {
    return obj
  }

  if (!isPlainObj(obj)) {
    return new obj.constructor(obj)
  }

  const cloned = {}

  const properties = Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj))

  for (const prop of properties) {
    let val = obj[prop]
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop)

    if (val != null && typeof val === 'object' && descriptor.hasOwnProperty('value')) {
      if (Array.isArray(val)) {
        descriptor.value = val.map(item => clone(item, refs, clonedRefs))
      } else {
        const index = refs.indexOf(val)

        if (index > -1) {
          descriptor.value = clonedRefs[index]
        } else {
          if (val === obj) {
            descriptor.value = cloned
          } else {
            descriptor.value = clone(val, refs, clonedRefs)
          }

          const index = refs.push(val) - 1
          clonedRefs[index] = descriptor.value
        }
      }
    }

    Object.defineProperty(cloned, prop, descriptor)
  }

  return cloned
}

module.exports = function (obj) {
  return clone(obj, [], [])
}
