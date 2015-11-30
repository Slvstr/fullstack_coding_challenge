angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("tinderCard.html","<div class=\"card\" hm-panmove=\"onPanMove\" hm-panend=\"onPanEnd\" hm-swiperight=\"onSwipeRight\" hm-swipeleft=\"onSwipeLeft\">\n  <div class=\"card-pic\">\n    <img class=\"card-pic\" ng-src=\"{{cardModel.profilePic}}\">\n    <div class=\"like-stamp\">LIKE</div>\n    <div class=\"nope-stamp\">NOPE</div>\n  </div>\n  <div class=\"card-info\">\n    <div class=\"info-left\">\n      {{cardModel.firstName}}, {{cardModel.age}}\n    </div>\n    <div class=\"info-right\">\n      <span ng-class=\"{\'info-highlight\': cardModel.mutualFriendsCount > 0}\">\n        <i class=\"fa fa-users\"></i><span>{{cardModel.mutualFriendsCount}}</span>        \n      </span>\n      <span ng-class=\"{\'info-highlight\': cardModel.sharedInterestsCount > 0}\">\n        <i class=\"fa fa-book\"></i><span>{{cardModel.sharedInterestsCount}}</span>\n      </span>\n    </div>\n  </div>\n</div>");}]);