(function() {
  'use strict';

  // have a stack that manages reuse of the cards and tells the controller to get 
  // more data when its running low. 

  angular
  .module('tinderChallenge')
  .directive('tinderCard', tinderCardFactory);

  /** @ngInject */
  function tinderCardFactory($window) {
    return {
      restrict: 'E',
      templateUrl: 'tinderCard.html',
      scope: {
        cardIndex: '@',
        onSwipeRight: '&',
        onSwipeLeft: '&'
      },
      link: function(scope, element, attrs) {
        // using unprefixed window.requestAnimationFrame because android 4.4 and above, ios, and every
        // other major browser except Opera Mini and IE<=9
        var SWIPE_THRESHOLD = element[0].offsetWidth * 0.8;
        var LIKE_THRESHOLD = element[0].offsetLeft + SWIPE_THRESHOLD;
        var NOPE_THRESHOLD = element[0].offsetLeft - SWIPE_THRESHOLD;
        var hasAnimationInProgress = false;

        var transform = {
          translate: {
            dx: 0,
            dy: 0,
            dz: 0
          },
          rotate: 0
        };

        scope.onPanMove = onPanMove;
        scope.onPanEnd = onPanEnd;


        function onPanMove(ev) {
          transform.translate.dx = ev.deltaX;
          transform.translate.dy = ev.deltaY;
          transform.translate.dz = transform.translate.dz || 10;
          transform.translate.rotate += ev.deltaX / 3;

          transformCard();
        }

        function onPanEnd(ev) {
          // If the card has passed the threshold, finish the animation and
          // and call the appropriate callback
          if (element[0].offsetLeft > LIKE_THRESHOLD) {
            // add a class to finish the animation
            element.addClass('animate-off-right');
            scope.onSwipeRight();

            // TODO (Erik Hellenbrand) : handle cleanup or reuse of the card element
          }
          else if (element[0].offsetLeft < NOPE_THRESHOLD) {
            element.addClass('animate-off-left');
            scope.onSwipeLeft();
          }

          // TODO (Erik Hellenbrand) : Else, return the card to its initial position
          else {
            resetCard();
          }
        }

        /**
        *   transformCard
        *
        *   Throttles the animation so we don't request an animationFrame
        *   more than 60fps
        **/
        function transformCard() {
          if (!hasAnimationInProgress) {
            $window.requestAnimationFrame(animateCard);
            hasAnimationInProgress = true;
            
            $timeout(function() {
              hasAnimationInProgress = false;
            }, 17);
          }
        }

        function resetCard() {
          // TODO (Erik Hellenbrand) : animate card back to resting position.  css class or js animation?
        }

        function animateCard() {
          var transformString = 'translate3d(' +
            transform.translate.dx + 'px' +
            transform.translate.dy + 'px' +
            transform.translate.dz + 'px' + ') ' +
            'rotate(' + transform.rotate + 'deg)';

          element.css({transform: transformString});

        }

      }
    };
  }

})();