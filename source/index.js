var Immutable = require('immutable');
var hash = require('commonform-hash');
var predicate = require('commonform-predicate');

var map = Immutable.Map.bind(Immutable);
var fromJS = Immutable.fromJS.bind(Immutable);
var emptyList = Immutable.List();

var normalize = function(nestedForm, formsList) {
  var content = nestedForm.get('content');
  var results = content.reduce(function(output, element) {
    if (predicate.subForm(element)) {
      var results = normalize(element.get('form'), output.get('forms'));
      var subForm = results.get('object');
      var newSubForm = {
        form: subForm.get('digest')
      };
      if (element.has('summary')) {
        newSubForm.summary = element.get('summary');
      }
      return map({
        forms: results.get('forms'),
        content: output.get('content').push(fromJS(newSubForm))
      });
    } else {
      return output.update('content', function(content) {
        return content.push(element);
      });
    }
  }, map({
    forms: formsList,
    content: emptyList
  }));

  var newForm = {
    content: results.get('content')
  };
  if (nestedForm.has('conspicuous')) {
    newForm.conspicuous = nestedForm.get('conspicuous');
  }
  var newImmutable = fromJS(newForm);
  // Put the computed digest to a property of the object so subsequent
  // logic needn't hash again.
  var withDigest = newImmutable.set('digest', hash(newImmutable));
  return map({
    object: withDigest,
    forms: results.get('forms').push(withDigest)
  });
};

module.exports = function(nestedForm) {
  // Keep track of forms seen, so duplicates can be omitted.
  var digestsSeen = [];
  return normalize(nestedForm, emptyList)
    .get('forms')
    .reduce(function(results, form) {
      var digest = form.get('digest');
      // Duplicate?
      if (digestsSeen.indexOf(digest) > -1) {
        return results;
      } else {
        digestsSeen.push(digest);
        // Delete the digest property so objects end up valid forms.
        return results.push(form.delete('digest'));
      }
    }, emptyList);
};

module.exports.version = '0.2.2';
