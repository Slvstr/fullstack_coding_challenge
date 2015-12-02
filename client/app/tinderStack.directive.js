(function() {
  'use strict';

  angular
  .module('tinderChallenge')
  .directive('tinderStack', tinderStackFactory);

  /** @ngInject */
  function tinderStackFactory($timeout) {
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
        var discardModels = [];
        var cards = [];

        vm.registerCard = registerCard;
        vm.triggerSwipeRight = triggerSwipeRight;
        vm.triggerSwipeLeft = triggerSwipeLeft;
        vm.removeCard = removeCard;
        vm.onMatch = onMatch;
        vm.resetStack = resetStack;


        function registerCard(card) {
          cards.push(card);
        }

        function triggerSwipeRight() {
          cards.length && cards[0].onSwipeRight();
        }

        function triggerSwipeLeft() {
          cards.length && cards[0].onSwipeLeft();
        }

        // Allow time for animation to complete before removing card from ng-repeat and thus the DOM
        function removeCard() {
          cards.shift();
          $timeout(function() {
            discardModels.push(vm.cardModels.shift());
          }, 500);
        }

        function onMatch() {
          vm.matchedWith = cards[0];
          removeCard();
        }

        function resetStack() {
          while(discardModels.length) {
            vm.cardModels.unshift(discardModels.pop());
          }
        }

      }      
    };
  }

})();