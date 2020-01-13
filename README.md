Produces a digest-to-object map with an extra `.root` property containing the digest of the root of the Common Form.

```javascript
var normalize = require('commonform-normalize')
var assert = require('assert')

assert.deepStrictEqual(
  normalize({
    content: [
      { heading: 'A', form: { content: ['A'] } },
      { heading: 'B', form: { content: ['B'] } }
    ]
  }),
  {
    root: 'd7069b8b7bc3897bd2f887830b16683546ab69231d23dbc0fed127df3defacc1',
    'eb94d16f10023fe29cb75d02a60eb531ffedcc7bdf7cc9aba8c25c962116b1f9': {
      content: [ 'A' ]
    },
    '5e5d60591967ee74ef2d324abc4b448578a186f26647f2aaa7249298696e6f22': {
      content: [ 'B' ]
    },
    'd7069b8b7bc3897bd2f887830b16683546ab69231d23dbc0fed127df3defacc1': {
      content: [
        {
          heading: 'A',
          digest: 'eb94d16f10023fe29cb75d02a60eb531ffedcc7bdf7cc9aba8c25c962116b1f9'
        },
        {
          heading: 'B',
          digest: '5e5d60591967ee74ef2d324abc4b448578a186f26647f2aaa7249298696e6f22'
        }
      ]
    }
  }
)
```
