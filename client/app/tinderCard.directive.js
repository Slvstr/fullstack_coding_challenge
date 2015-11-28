(function() {
  'use strict';

  angular
  .module('tinderChallenge')
  .directive('tinderCard', tinderCardFactory);

  /** @ngInject */
  function tinderCardFactory() {
    return {
      restrict: 'E',
      templateUrl: 'tinderCard.html',
      link: function(scope, element, attrs) {

      }
    };
  }

})();