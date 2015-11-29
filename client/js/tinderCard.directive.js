(function() {
  'use strict';

  // have a stack that manages reuse of the cards and tells the controller to get 
  // more data when its running low. 

  angular
  .module('tinderChallenge')
  .directive('tinderCard', tinderCardFactory);

  /** @ngInject */
  function tinderCardFactory($window, $timeout) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'tinderCard.html',
      scope: {
        cardModel: '=',
        cardIndex: '@',
        onSwipeRight: '&',
        onSwipeLeft: '&'
      },
      link: function(scope, element, attrs) {
        // using unprefixed window.requestAnimationFrame because android 4.4 and above, ios, and every
        // other major browser except Opera Mini and IE<=9
        var SWIPE_THRESHOLD = element[0].offsetWidth * 0.5;
        var MAX_ROTATION = 45;
        var hasAnimationInProgress = false;
        var transform;
        var stamps;

        scope.onPanMove = onPanMove;
        scope.onPanEnd = onPanEnd;

        initializeCard();


        function initializeCard() {
          transform = {
            translate: {
              dx: 0,
              dy: 0,
              dz: 0
            },
            rotate: 0
          };

          stamps = {
            like: {
              element: element[0].querySelector('.like-stamp'),
              opacity: 0
            },
            nope: {
              element: element[0].querySelector('.nope-stamp'),
              opacity: 0
            }
          };

          transformCard();

        }

        function onPanMove(ev) {
          console.dir(ev);
          transform.translate.dx = ev.deltaX;
          transform.translate.dy = ev.deltaY;
          transform.translate.dz = transform.translate.dz || 10;
          
          if (ev.deltaX > 0) {
            transform.rotate = Math.min(ev.deltaX / 80, MAX_ROTATION);
            stamps.like.opacity = Math.min(ev.deltaX / SWIPE_THRESHOLD, 1);
            stamps.nope.opacity = 0;
          }
          else {
            transform.rotate = Math.max(ev.deltaX / 80, -MAX_ROTATION);
            stamps.like.opacity = 0;
            stamps.nope.opacity = Math.min(ev.deltaX / -SWIPE_THRESHOLD, 1);
          }

          transformCard();
        }

        function onPanEnd(ev) {
          // If the card has passed the threshold, finish the animation and
          // and call the appropriate callback
          if (ev.deltaX > SWIPE_THRESHOLD) {
            // add a class to finish the animation
            console.log('passed like threshold');
            element.addClass('animate-off-right');
            scope.onSwipeRight();

            // TODO (Erik Hellenbrand) : handle cleanup or reuse of the card element
          }
          else if (ev.deltaX < -SWIPE_THRESHOLD) {
            console.log('passed nope threshold');
            element.addClass('animate-off-left');
            scope.onSwipeLeft();
          }

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
          transform.translate.dx = 0;
          transform.translate.dy = 0;
          transform.translate.dz = 0;
          transform.rotate = 0;

          stamps.like.opacity = 0;
          stamps.nope.opacity = 0;

          transformCard();
        }

        function animateCard() {
          console.log('in animate card');
          var transformString = 'translate3d(' +
            transform.translate.dx + 'px,' +
            transform.translate.dy + 'px,' +
            transform.translate.dz + 'px' + ') ' +
            'rotate(' + transform.rotate + 'deg)';

          element.css("-webkit-transform", transformString);
          stamps.like.element.style.opacity = stamps.like.opacity;
          stamps.nope.element.style.opacity = stamps.nope.opacity;
        }

      }
    };
  }

})();