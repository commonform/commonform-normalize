/* jshint mocha: true */
var expect = require('chai').expect;
var hash = require('commonform-hash');
var normalize = require('..');

var formA = {content:['A']};
var formADigest = hash(formA);

var formB = {
  content: ['B'],
  conspicuous: 'yes'
};
var formBDigest = hash(formB);

var formC = {content: ['C']};
var formCDigest = hash(formC);

var formD = {content: ['D']};
var formDDigest = hash(formD);

describe('normalization', function() {
  it('outputs a digest-to-form map in normalized form', function() {
    var result = {};
    result[formADigest] = formA;
    result[formBDigest] = formB;
    result[formCDigest] = formC;
    result[formDDigest] = formD;

    var first = {
      content: [{digest: formADigest}, {digest: formBDigest}]
    };
    var firstDigest = hash(first);
    result[firstDigest] = first;

    var second = {
      content: [{digest: formCDigest}, {digest: formDDigest}]
    };
    var secondDigest = hash(second);
    result[secondDigest] = second;

    var root = {
      content: [
        {
          heading: 'First',
          digest: firstDigest
        },
        {digest: secondDigest}
      ]
    };
    var rootHash = hash(root);
    result[hash(root)] = root;
    result.root = rootHash;

    expect(
      normalize({
        content: [
          {
            heading: 'First',
            form: {
              content:[{form: formA}, {form: formB}]
            }
          },
          {
            form: {
              content: [{form: formC}, {form: formD}]
            }
          }
        ]
      }
    )).to.eql(result);
  });
});
