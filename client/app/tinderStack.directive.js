(function() {
  'use strict';

  angular
  .module('tinderChallenge')
  .directive('tinderStack', tinderStackFactory);

  /** @ngInject */
  function tinderStackFactory() {
    return {
      restrict: 'A',
      controller: function stackCtrl() {
        var vm = this;
        vm.cards = [];

        vm.registerCard = registerCard;
        vm.triggerSwipeRight = triggerSwipeRight;
        vm.triggerSwipeLeft = triggerSwipeLeft;
        vm.onSwipeRight = handleSwipe;
        vm.onSwipeLeft = handleSwipe;


        function registerCard(card) {
          vm.cards.push(card);
        }

        function triggerSwipeRight() {
          vm.cards.length && vm.cards[0].onSwipeRight();
        }

        function triggerSwipeLeft() {
          vm.cards.length && vm.cards[0].onSwipeLeft();
        }

        function handleSwipe() {
          vm.cards.shift();
          // TODO (Erik Hellenbrand) : Do cleanup on card          
        }

      }      
    };
  }

})();