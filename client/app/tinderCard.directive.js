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
        var VIEWPORT_WIDTH = Math.max($window.document.documentElement.clientWidth, $window.innerWidth || 0);
        var SWIPE_THRESHOLD = element[0].offsetWidth * 0.5;
        var MAX_ROTATION = 60;
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

          // TODO (Erik Hellenbrand) : Set z-index based on scope.cardIndex

          transformCard();

        }

        function onPanMove(ev) {
          element.removeClass('reset-card');

          transform.translate.dx = ev.deltaX;
          transform.translate.dy = ev.deltaY;
          transform.translate.dz = transform.translate.dz || 10;
          
          if (ev.deltaX > 0) {
            transform.rotate = Math.min(ev.deltaX / 50, MAX_ROTATION);
            stamps.like.opacity = Math.min(ev.deltaX / SWIPE_THRESHOLD, 1);
            stamps.nope.opacity = 0;
          }
          else {
            transform.rotate = Math.max(ev.deltaX / 50, -MAX_ROTATION);
            stamps.like.opacity = 0;
            stamps.nope.opacity = Math.min(ev.deltaX / -SWIPE_THRESHOLD, 1);
          }

          transformCard();
        }

        function onPanEnd(ev) {
          // If the card has passed the threshold, finish the animation and
          // and call the appropriate callback
          if (ev.deltaX > SWIPE_THRESHOLD) {
            // add a class to add a transition
            console.log('passed like threshold');
            element.addClass('animate-off');
            animateOff('right')
            scope.onSwipeRight();

            // TODO (Erik Hellenbrand) : handle cleanup or reuse of the card element
          }
          else if (ev.deltaX < -SWIPE_THRESHOLD) {
            console.log('passed nope threshold');
            element.addClass('animate-off');
            animateOff('left');
            scope.onSwipeLeft();
          }
          else if (ev.deltaX > 0) {
            resetCard('left');
          }
          else {
            resetCard('right');
          }
        }

        function animateOff(direction) {
          if (direction === 'right') {
            transform.translate.dx = VIEWPORT_WIDTH + element[0].offsetWidth;
            transform.translate.dy *= 1.5;
            transform.rotate = MAX_ROTATION;
          }
          else if (direction === 'left') {
            transform.translate.dx = -VIEWPORT_WIDTH - element[0].offsetWidth;
            transform.translate.dy *= 1.5;
            transform.rotate = -MAX_ROTATION;
          }

          transformCard();
        }

        /**
        *   transformCard()
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

        /**
        *   resetCard()
        *
        *   Animates the card back to its initial position by adding a class that triggers a CSS animation
        *   Left and right animations are used to add a bounce/snap-back effect
        *   After the CSS animation has completed, the stamps are reset using the transformCard function
        **/
        function resetCard(direction) {
          transform.translate.dx = 0;
          transform.translate.dy = 0;
          transform.translate.dz = 0;
          transform.rotate = 0;

          stamps.like.opacity = 0;
          stamps.nope.opacity = 0;

          if (direction === 'right') {
            element.addClass('reset-card-right');
            element.one('animationend', function() {
              element.removeClass('reset-card-right');
              transformCard();
            });

          }
          else {
            element.addClass('reset-card-left');
            element.one('animationend', function() {
              element.removeClass('reset-card-left');
              transformCard();
            });
          }

        }

        /**
        *   animateCard()
        *
        *   This performs the actual style updates and is passed to $window.requestAnimationFrame()
        **/
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