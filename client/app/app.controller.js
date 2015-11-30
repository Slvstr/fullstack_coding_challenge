(function() {
  'use strict';

  angular
  .module('tinderChallenge')
  .controller('appCtrl', appCtrl);

  /** @ngInject */
  function appCtrl(Card) {
    var vm = this;
    
    this.cards = Card.query();
  }

})();