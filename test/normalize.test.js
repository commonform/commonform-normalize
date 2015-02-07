/* jshint mocha: true */
var expect = require('chai').expect;
var hash = require('commonform-hash').hash;
var normalize = require('..');

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

var A_D = hash(A);
var B_D = hash(B);
var C_D = hash(C);

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
              form: hash({content: [{form: A_D}, {form: B_D}]})
            },
            {
              form: hash({content: [{form: B_D}, {form: C_D}]})
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
