// Details Service
// ---------------

/* global define */

// Define AMD, Require.js, or Contextual Scope
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['stratus', 'underscore', 'angular', 'stratus.services.model'],
      factory)
  } else {
    factory(root.Stratus, root._, root.angular)
  }
}(this, function (Stratus, _, angular) {
  Stratus.Services.Details = [
    '$provide', function ($provide) {
      $provide.factory('details', [
        '$http',
        'Model',
        '$interpolate',
        '$q',
        function ($http, Model, $interpolate, $q) {
          return function () {
            this.fetch = function ($element, $scope) {
              var that = this
              return new $q(function (resolve, reject) {
                if (angular.isString($element)) {
                  $element = {target: $element}
                }
                var options = {
                  selectedId: $element.attr
                    ? $element.attr('data-selectedId')
                    : $element.selectedId,
                  property: $element.attr
                    ? $element.attr('data-property')
                    : $element.property
                }

                var completed = 0
                $scope.$watch(function () {
                  return completed
                }, function (iteration) {
                  if (_.isNumber(iteration) &&
                    parseInt(iteration) === _.size(options)) {
                    resolve(that.build(options, $scope))
                  }
                })
                _.each(options, function (element, key) {
                  if (element && angular.isString(element)) {
                    var interpreter = $interpolate(element, false, null, true)
                    var initial = interpreter($scope.$parent)
                    if (angular.isDefined(initial)) {
                      options[key] = initial
                      completed++
                    } else {
                      $scope.$watch(function () {
                        return interpreter($scope.$parent)
                      }, function (value) {
                        if (value) {
                          options[key] = value
                          completed++
                        }
                      })
                    }
                  } else {
                    completed++
                  }
                })
              })
            }

            this.build = function (options, $scope) {
              if (options.selectedId) {
                var targetUrl
                if (options.property === 'version.layout') {
                  targetUrl = '/Api/Layout/' + options.selectedId
                }
                if (options.property === 'version.template') {
                  targetUrl = '/Api/Template/' + options.selectedId
                }
                var action = 'GET'
                var prototype = {
                  method: action,
                  url: targetUrl,
                  headers: {}
                }
                $http(prototype).then(function (response) {
                  if (response.status === 200 &&
                    angular.isObject(response.data)) {
                    $scope.convoyDetails = response.data.payload ||
                      response.data
                    $scope.selectedName = $scope.convoyDetails.name
                    $scope.selectedDesc = $scope.convoyDetails.description
                  }
                })
              }
            }
          }
        }])
    }]
}))
