(function() {
  'use strict';

  angular
  .module('tinderChallenge')
  .controller('appCtrl', appCtrl);

  /** @ngInject */
  function appCtrl(Card) {
    var vm = this;
    var cards = [];

    activate();

    function activate() {
      vm.cards = Card.query();
    }

  }

})();