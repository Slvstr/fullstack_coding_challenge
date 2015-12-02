(function() {
  'use strict';

  angular
  .module('tinderChallenge')
  .directive('tinderCard', tinderCardFactory);

  /** @ngInject */
  function tinderCardFactory($window, $timeout) {
    return {
      restrict: 'E',
      replace: true,
      require: '^tinderStack',
      templateUrl: 'tinderCard.html',
      scope: {
        cardModel: '=',
        cardIndex: '@'
      },
      link: function(scope, element, attrs, stackCtrl) {
        var VIEWPORT_WIDTH = Math.max($window.document.documentElement.clientWidth, $window.innerWidth || 0);
        var SWIPE_THRESHOLD = element[0].offsetWidth * 0.7;
        var SWIPE_VELOCITY = 0.65;
        var MAX_ROTATION = 60;
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

          stackCtrl.registerCard(scope);
          updateCard();

        }

        function onPanMove(ev) {
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

          updateCard();
        }

        function onPanEnd(ev) {
          if (ev.deltaX > SWIPE_THRESHOLD || ev.velocityX < -SWIPE_VELOCITY) {
            onSwipeRight();
          }
          else if (ev.deltaX < -SWIPE_THRESHOLD || ev.velocityX > SWIPE_VELOCITY) {
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
          return isMatch() ? stackCtrl.onMatch() : stackCtrl.removeCard();
        }

        function onSwipeLeft() {
          animateOff('left');
          return stackCtrl.removeCard();
        }

        function isMatch() {
          // Some randomness, just for fun
          return Math.random() > 0.5;
        }

        function animateOff(direction) {
          if (direction === 'right') {
            transform.translate.dx = VIEWPORT_WIDTH + element[0].offsetWidth;
            transform.translate.dy *= 1.5;
            transform.translate.dz = 10;
            transform.rotate = MAX_ROTATION;
          }
          else if (direction === 'left') {
            transform.translate.dx = -VIEWPORT_WIDTH - element[0].offsetWidth;
            transform.translate.dy *= 1.5;
            transform.translate.dz = 10;
            transform.rotate = -MAX_ROTATION;
          }

          element.addClass('animate-off');
          updateCard();
        }


        /**
        *   resetCard()
        *
        *   Animates the card back to its initial position by adding a class that triggers a CSS animation
        *   Left and right animations are used to add a bounce/snap-back effect
        *   After the CSS animation has completed, the translate and stamps are reset using the transformCard function
        **/
        function resetCard(direction) {
          transform.translate.dx = 0;
          transform.translate.dy = scope.cardIndex * 3;
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
        *   updateCard()
        *
        *   Requests animation frame to perform the card transformation and stamp opacity change
        **/
        function updateCard() {
          $window.requestAnimationFrame(transformCard);
        }

        /**
        *   transformCard()
        *
        *   This does the work of translating and rotating the card, as well
        *   as updating stamps opacity, and is passed to $window.requestAnimationFrame()
        **/
        function transformCard() {
          var transformString = 'translate3d(' +
            transform.translate.dx + 'px,' +
            transform.translate.dy + 'px,' +
            transform.translate.dz + 'px' + ') ' +
            'rotate(' + transform.rotate + 'deg)';

          element.css({"-webkit-transform": transformString, "z-index": 100-scope.cardIndex});
          updateStamps();
        }

        /**
        *   updateStamps()
        *
        *   This updates the stamps opacity
        **/
        function updateStamps() {
          stamps.like.element.style.opacity = stamps.like.opacity;
          stamps.nope.element.style.opacity = stamps.nope.opacity;
        }

      }
    };
  }

})();