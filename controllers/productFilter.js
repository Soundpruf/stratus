// Product Filter Controller
// -----------------

/* global define */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([
      'stratus',
      'underscore',
      'angular',
      'stratus.services.utility'
    ], factory)
  } else {
    factory(root.Stratus, root._, root.angular)
  }
}(this, function (Stratus, _, angular) {
  // This Controller handles simple element binding
  // for a single scope to an API Object Reference.
  Stratus.Controllers.ProductFilter = [
    '$scope',
    '$log',
    'utility',
    function ($scope, $log, utility) {
      // Store Instance
      Stratus.Instances[_.uniqueId('product_filter_')] = $scope

      // Wrappers
      $scope.Stratus = Stratus
      $scope._ = _

      // status selected
      $scope.showOnly = []

      // status
      $scope.status = [
        {
          desc: 'Active',
          value: 1
        },
        {
          desc: 'Inactive',
          value: 0
        }
        // ,
        // {
        //   desc: 'Deleted',
        //   value: -1
        // }
      ]
      $scope.minPrice = $scope.maxPrice = null

      /**
       * Default Billing Increment Options for Product
       */
      $scope.billingIncrementOptions = {
        i: 'Minutely',
        h: 'Hourly',
        d: 'Daily',
        w: 'Weekly',
        m: 'Monthly',
        q: 'Quarterly',
        y: 'Yearly'
      }

      // handle click action
      $scope.toggle = function (value) {
        var index = $scope.showOnly.indexOf(value);
        (index !== -1)
          ? $scope.showOnly.splice(index, 1)
          : $scope.showOnly.push(value)
        filter()
      }

      /**
       * Add filter and Request to api.
       */
      function filter (type, data) {
        removeFilter()
        filterPrices()
        filterStatus()
        $scope.collection.fetch()
      }

      /**
       * Set filter price values
       */
      function filterStatus () {
        $scope.collection.meta.set('api.options.filterStatus', $scope.showOnly)
      }

      /**
       * Set filter price values
       */
      function filterPrices () {
        if (Number.isFinite($scope.minPrice) && Number.isFinite($scope.maxPrice) && $scope.minPrice <= $scope.maxPrice) {
          $scope.collection.meta.set('api.options.minPrice', $scope.minPrice)
          $scope.collection.meta.set('api.options.maxPrice', $scope.maxPrice)
        } else if (Number.isFinite($scope.minPrice) && $scope.minPrice >= 0) {
          $scope.collection.meta.set('api.options.minPrice', $scope.minPrice)
        } else if (Number.isFinite($scope.maxPrice) && $scope.maxPrice >= 0) {
          $scope.collection.meta.set('api.options.maxPrice', $scope.maxPrice)
        }
      }

      /**
       * Handle data change and Set filter price values
       */
      $scope.$watchCollection('[minPrice, maxPrice]',
        function (newVal, oldVal) {
          if (Number.isFinite($scope.minPrice) && Number.isFinite($scope.maxPrice) && $scope.minPrice > $scope.maxPrice) return
          filter()
        })

      /**
       * Remove the filter condition after filter request
       */
      function removeFilter () {
        delete $scope.collection.meta.get('api').options
      }

      $scope.safeMessage = function (message) {
        return utility.safeMessage(message)
      }
    }]
}))
