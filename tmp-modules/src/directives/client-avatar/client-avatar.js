
'use strict';

(function() {

	angular.module('directives.client-avatar', [])

		// .controller(
		// 	'clientAvatarController',
		// 	function($scope){

		// 	}
		// )

		.directive('clientAvatar', function() {
			return {
				restrict: 'E',
				transclude: true,
				scope: {
					extra: '=?',
					transactionItem: '='
				},
				// controller: 'clientAvatarController',
				templateUrl: 'client-avatar/client-avatar.html'
			};
		})

	;

})();
