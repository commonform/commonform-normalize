var assert = require('assert')
var hash = require('commonform-hash')
var normalize = require('./')

var formA = { content: ['A'] }
var formADigest = hash(formA)

var formB = {
  content: ['B'],
  conspicuous: 'yes'
}
var formBDigest = hash(formB)

var formC = { content: ['C'] }
var formCDigest = hash(formC)

var formD = { content: ['D'] }
var formDDigest = hash(formD)

var result = {}
result[formADigest] = formA
result[formBDigest] = formB
result[formCDigest] = formC
result[formDDigest] = formD

var first = {
  content: [
    { digest: formADigest },
    { digest: formBDigest }
  ]
}
var firstDigest = hash(first)
result[firstDigest] = first

var second = {
  content: [
    { digest: formCDigest },
    { digest: formDDigest }
  ]
}
var secondDigest = hash(second)
result[secondDigest] = second

var rootForm = {
  content: [
    { heading: 'First', digest: firstDigest },
    { digest: secondDigest }
  ]
}
var rootHash = hash(rootForm)
result[hash(rootForm)] = rootForm
result.root = rootHash

assert.deepStrictEqual(
  normalize({
    content: [
      {
        heading: 'First',
        form: {
          content: [
            { form: formA },
            { form: formB }
          ]
        }
      },
      {
        form: {
          content: [
            { form: formC },
            { form: formD }
          ]
        }
      }
    ]
  }),
  result
)
