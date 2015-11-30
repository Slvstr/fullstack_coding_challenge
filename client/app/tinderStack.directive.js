(function() {
  'use strict';

  angular
  .module('tinderChallenge')
  .directive('tinderStack', tinderStackFactory);

  /** @ngInject */
  function tinderStackFactory() {
    return {
      restrict: 'E',
      templateUrl: 'tinderStack.html',
      replace: true,
      scope: {
        cardModels: '=',
        onMatch: '&'
      },
      bindToController: true,
      controllerAs: 'stack',
      controller: function stackCtrl() {
        var vm = this;
        vm.cards = [];

        vm.registerCard = registerCard;
        vm.triggerSwipeRight = triggerSwipeRight;
        vm.triggerSwipeLeft = triggerSwipeLeft;
        vm.removeCard = removeCard;
        vm.onMatch = onMatch;


        function registerCard(card) {
          vm.cards.push(card);
        }

        function triggerSwipeRight() {
          vm.cards.length && vm.cards[0].onSwipeRight();
        }

        function triggerSwipeLeft() {
          vm.cards.length && vm.cards[0].onSwipeLeft();
        }

        function removeCard() {
          vm.cards.shift();
          // TODO (Erik Hellenbrand) : Do cleanup on card          
        }

        function onMatch() {
          vm.matchedWith = vm.cards[0];
          removeCard();
        }

      }      
    };
  }

})();