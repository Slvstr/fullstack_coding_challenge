(function() {
  'use strict';

  angular
  .module('tinderChallenge')
  .directive('tinderGamePad', tinderGamePadFactory);

  /** @ngInject */
  function tinderGamePadFactory() {
    return {
      require: '^tinderStack',
      link: function(scope, element, attrs, stackCtrl) {
        scope.triggerSwipeRight = stackCtrl.triggerSwipeRight;
        scope.triggerSwipeLeft = stackCtrl.triggerSwipeLeft;
      }
    };
  }

})();