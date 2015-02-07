var hash = require('commonform-hash').hash;
var validate = require('commonform-validate');

var normalize = function(nestedForm, list) {
  var content = nestedForm.content;
  var newContent = content.reduce(function(content, element) {
    if (validate.nestedSubForm(element)) {
      var results = normalize(element.form, list);
      var form = results[0];
      var newSubForm = {form: form.digest};
      if (element.hasOwnProperty('summary')) {
        newSubForm.summary = element.summary;
      }
      return content.concat(newSubForm);
    } else {
      return content.concat(element);
    }
  }, []);
  var newForm = {content: newContent};
  if (nestedForm.hasOwnProperty('conspicuous')) {
    newForm.conspicuous = nestedForm.conspicuous;
  }
  // Put the computest digest to a property of the form so subsequent
  // logic needn't hash again.
  newForm.digest = hash(newForm);
  list.push(newForm);
  return [newForm, list];
};

module.exports = function(nestedForm) {
  if (!validate.nestedForm(nestedForm)) {
    throw new Error('Invalid nested form');
  }
  // Keep track of forms seen, so duplicates can be omitted.
  var digestsSeen = [];
  return normalize(nestedForm, [])[1]
    .reduce(function(results, form) {
      var digest = form.digest;
      // Delete the digest property so objects end up valid forms.
      delete form.digest;
      // Duplicate?
      if (digestsSeen.indexOf(digest) > -1) {
        return results;
      } else {
        digestsSeen.push(digest);
        return results.concat(form);
      }
    }, []);
};

module.exports.version = '0.1.1';
