// Redactor Directive
// ------------------

/* global define */

// Define AMD, Require.js, or Contextual Scope
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['stratus', 'underscore', 'angular', 'redactor'], factory)
  } else {
    factory(root.Stratus, root._, root.angular)
  }
}(this, function (Stratus, _, angular) {
  var redactorOptions = {}

  angular.module('angular-redactor', [])
    .constant('redactorOptions', redactorOptions)
    .directive('redactor', [
      '$timeout', function ($timeout) {
        _.forEach([
          Stratus.BaseUrl + 'sitetheorycore/dist/redactor/redactor.css',
          Stratus.BaseUrl + 'sitetheorycore/dist/redactor/redactor-clips.css',
          Stratus.BaseUrl +
         Stratus.BundlePath + 'bower_components/codemirror/lib/codemirror.css'
        ], function (url) {
          Stratus.Internals.CssLoader(url)
        })
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function (scope, element, attrs, ngModel) {
            // Expose scope var with loaded state of Redactor
            scope.redactorLoaded = false

            var updateModel = function updateModel (value) {
              // $timeout to avoid $digest collision
              $timeout(function () {
                scope.$apply(function () {
                  ngModel.$setViewValue(value)
                })
              })
            }
            var options = {
              changeCallback: updateModel
            }
            var additionalOptions = attrs.redactor
              ? scope.$eval(attrs.redactor)
              : {}
            var editor

            angular.extend(options, redactorOptions, additionalOptions)

            // prevent collision with the constant values on ChangeCallback
            var changeCallback = additionalOptions.changeCallback ||
              redactorOptions.changeCallback
            if (changeCallback) {
              options.changeCallback = function (value) {
                updateModel.call(this, value)
                changeCallback.call(this, value)
              }
            }

            // put in timeout to avoid $digest collision.  call render() to
            // set the initial value.
            $timeout(function () {
              editor = element.redactor(options)
              ngModel.$render()
              element.on('remove', function () {
                element.off('remove')
                element.redactor('core.destroy')
              })
            })

            ngModel.$render = function () {
              if (angular.isDefined(editor)) {
                $timeout(function () {
                  element.redactor('code.set', ngModel.$viewValue || '')
                  element.redactor('placeholder.toggle')
                  scope.redactorLoaded = true
                })
              }
            }
          }
        }
      }])
}))
