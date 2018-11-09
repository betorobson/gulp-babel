
'use strict';

(function() {

	angular.module('directives.navigationBarWhatsnew', [])

		.controller(
			'NavigationBarWhatsnewController',

			function(
				$timeout,
				beamerFactory
			) {

				$timeout(beamerFactory.init);

			}
		)

		.directive('navigationBarWhatsnew', function() {
			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'navigation-bar/whatsnew/whatsnew.html',
				controller: 'NavigationBarWhatsnewController'
			};
		});

})();
