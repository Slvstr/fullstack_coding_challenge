(function() {
  'use strict';

  // have a stack that manages reuse of the cards and tells the controller to get 
  // more data when its running low. 

  // going to need to make the gamepad a directive too so it can call the swipeLeft/right functions
  // will also have to move most of this logic to a controller instead of the link method

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
        swipeRightCallback: '&onSwipeRight',
        swipeLeftCallback: '&onSwipeLeft'
      },
      link: function(scope, element, attrs) {
        // using unprefixed window.requestAnimationFrame because android 4.4 and above, ios, and every
        // other major browser except Opera Mini and IE<=9
        var VIEWPORT_WIDTH = Math.max($window.document.documentElement.clientWidth, $window.innerWidth || 0);
        var SWIPE_THRESHOLD = element[0].offsetWidth * 0.7;
        var MAX_ROTATION = 60;
        var hasAnimationInProgress = false;
        var transform;
        var stamps;

        scope.onPanMove = onPanMove;
        scope.onPanEnd = onPanEnd;
        scope.onSwipeRight = onSwipeRight;
        scope.onSwipeLeft = onSwipeLeft;

        initializeCard();


        function initializeCard() {
          transform = {
            translate: {
              dx: 0,
              dy: scope.cardIndex * 3,
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
          console.log(scope.cardIndex);

          transformCard();

        }

        function onPanMove(ev) {
          element.removeClass('reset-card');

          transform.translate.dx = ev.deltaX;
          transform.translate.dy = ev.deltaY;
          transform.translate.dz = transform.translate.dz || 10;
          
          if (ev.deltaX > 0) {
            transform.rotate = Math.max(-ev.deltaX / 40, -MAX_ROTATION);
            stamps.like.opacity = Math.min(ev.deltaX / SWIPE_THRESHOLD, 1);
            stamps.nope.opacity = 0;
          }
          else {
            transform.rotate = Math.min(-ev.deltaX / 40, MAX_ROTATION);
            stamps.like.opacity = 0;
            stamps.nope.opacity = Math.min(ev.deltaX / -SWIPE_THRESHOLD, 1);
          }

          transformCard();
        }

        function onPanEnd(ev) {
          if (ev.deltaX > SWIPE_THRESHOLD) {
            onSwipeRight();
          }
          else if (ev.deltaX < -SWIPE_THRESHOLD) {
            onSwipeLeft();
          }
          else if (ev.deltaX > 0) {
            resetCard('left');
          }
          else {
            resetCard('right');
          }
        }

        function onSwipeRight() {
          // TODO (Erik Hellenbrand) : handle cleanup or reuse of the card element
          animateOff('right');
          scope.swipeRightCallback();
        }

        function onSwipeLeft() {
          animateOff('left');
          scope.swipeLeftCallback();
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

          element.addClass('animate-off');
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

          element.css({"-webkit-transform": transformString, "z-index": 100-scope.cardIndex});
          stamps.like.element.style.opacity = stamps.like.opacity;
          stamps.nope.element.style.opacity = stamps.nope.opacity;
        }

      }
    };
  }

})();