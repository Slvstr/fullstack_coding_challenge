(function() {
  'use strict';

  angular
  .module('tinderChallenge')
  .controller('appCtrl', appCtrl);

  /** @ngInject */
  function appCtrl(Card, $rootScope) {
    var vm = this;
    var cards = [];

    vm.triggerLike = triggerLike;
    vm.triggerNope = triggerNope;

    activate();

    function activate() {
      vm.cards = Card.query();
    }

    // Tell the directive the like button was pressed
    function triggerLike() {
      $rootScope.$broadcast('swipeRight');
    }

    function triggerNope() {
      $rootScope.$broadcast('swipeLeft');

    }



  }

})();