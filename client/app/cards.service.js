(function() {
  'use strict';

  angular
  .module('tinderChallenge')
  .factory('Card', CardFactory);

  /** @ngInject */
  function CardFactory($resource) {
    return $resource('/cards');
  }

})();