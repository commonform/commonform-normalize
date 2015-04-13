var clone = require('clone');
var hash = require('commonform-hash');
var predicate = require('commonform-predicate');

var normalize = function(form, formsList) {
  var content = form.content;
  var results = content.reduce(function(output, element) {
    if (predicate.child(element)) {
      var results = normalize(element.form, output.forms);
      var child = results.object;
      var newChild = {
        digest: child.digest
      };
      if (element.hasOwnProperty('heading')) {
        newChild.heading = element.heading;
      }
      output.content.push(newChild);
      return {
        forms: results.forms,
        content: output.content
      };
    } else {
      output.content.push(element);
      return output;
    }
  }, {
    forms: formsList,
    content: []
  });

  var newForm = {content: results.content};
  if (form.hasOwnProperty('conspicuous')) {
    newForm.conspicuous = form.conspicuous;
  }
  newForm.digest = hash(newForm);
  results.forms.push(newForm);
  return {
    object: newForm,
    forms: results.forms
  };
};

module.exports = function(form) {
  var cloned = clone(form);
  return normalize(cloned, []).forms.reduce(function(results, form) {
    var digest = form.digest;
    delete form.digest;
    results[digest] = form;
    return results;
  }, {});
};

module.exports.version = '1.0.0-rc1';
