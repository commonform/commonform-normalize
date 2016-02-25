/* Copyright 2016 Kyle E. Mitchell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var hash = require('commonform-hash')
var predicate = require('commonform-predicate')

var normalize = function(form, formsList) {
  var content = form.content
  var results = content
    .reduce(
      function(output, element) {
        if (predicate.child(element)) {
          var results = normalize(element.form, output.forms)
          var child = results.object
          var newChild = { digest: child.digest }
          if (element.hasOwnProperty('heading')) {
            newChild.heading = element.heading }
          output.content.push(newChild)
          return {
            forms: results.forms,
            content: output.content } }
        else {
          output.content.push(element)
          return output } },
      { forms: formsList,
        content: [ ] } )
  var newForm = { content: results.content }
  if (form.hasOwnProperty('conspicuous')) {
    newForm.conspicuous = form.conspicuous }
  newForm.digest = hash(newForm)
  results.forms.push(newForm)
  return {
    object: newForm,
    forms: results.forms } }

module.exports = function(form) {
  var normalized = normalize(form, [ ]).forms
  // Note the index of the last form in the list, the root.
  var rootIndex = normalized.length - 1
  return normalized
    .reduce(
      function(results, form, index) {
        var digest = form.digest
        delete form.digest
        results[digest] = form
        // Set the root digest to the 'root' property.
        if (index === rootIndex) {
          results.root = digest }
        return results },
      {}) }
