/* jshint mocha: true */
var Immutable = require('immutable');
var expect = require('chai').expect;
var hash = require('commonform-hash').hash;
var normalize = require('..');

var fromJS = Immutable.fromJS.bind(Immutable);

var form = function(content) {
  return fromJS({content: [content]});
};

var subForm = function(form) {
  return {form: form};
};

var A = form('A');
var B = fromJS({
  content: ['B'],
  conspicuous: 'true'
});
var C = form('C');

var A_D = hash(A);
var B_D = hash(B);
var C_D = hash(C);

describe('normalization', function() {
  it('lists required sub-forms only once', function() {
    expect(normalize(fromJS({
      content: [
        {summary: 'First', form: {content: [subForm(A), subForm(B)]}},
        {form: {content: [subForm(B), subForm(C)]}}
      ]
    })).toJS())
      .to.eql([
        A.toJS(),
        B.toJS(),
        {content: [{form: A_D}, {form: B_D}]},
        // B does not appear again
        C.toJS(),
        {content: [{form: B_D}, {form: C_D}]},
        {
          content: [
            {
              summary: 'First',
              form: hash(fromJS({content: [{form: A_D}, {form: B_D}]}))
            },
            {
              form: hash(fromJS({content: [{form: B_D}, {form: C_D}]}))
            }
          ]
        }
      ]);
  });
});
