/* jshint mocha: true */
var expect = require('chai').expect;
var hash = require('commonform-hash');
var serialize = require('commonform-serialize');
var normalize = require('..');

var digestOf = function(form) {
  return hash.hash(serialize.stringify(form));
};

var form = function(content) {
  return {content: [content]};
};

var subForm = function(form) {
  return {form: form};
};

var A = form('A');
var B = form('B');
B.conspicuous = 'true';
var C = form('C');

var A_D = digestOf(A);
var B_D = digestOf(B);
var C_D = digestOf(C);

describe('normalization', function() {
  it('lists required sub-forms only once', function() {
    expect(normalize({
      content: [
        {summary: 'First', form: {content: [subForm(A), subForm(B)]}},
        {form: {content: [subForm(B), subForm(C)]}}
      ]
    }))
      .to.eql([
        A,
        B,
        {content: [{form: A_D}, {form: B_D}]},
        // B does not appear again
        C,
        {content: [{form: B_D}, {form: C_D}]},
        {
          content: [
            {
              summary: 'First',
              form: digestOf({content: [{form: A_D}, {form: B_D}]})
            },
            {
              form: digestOf({content: [{form: B_D}, {form: C_D}]})
            }
          ]
        }
      ]);
  });

  it('throws an error for an invalid nested form', function() {
    expect(function() {
      normalize({});
    })
      .to.throw('Invalid nested form');
  });
});
