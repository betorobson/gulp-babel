
'use strict';

(function(){

	angular.module('views.transaction')

	.controller(
		'viewTransactionSellInteractionController',

		function(
			$scope
		){

			$scope;

		}
	)

	.directive('viewTransactionSellInteraction', function(){
		return {
			restrict: 'E',
			scope: {
				interaction: '='
			},
			controller: 'viewTransactionSellInteractionController',
			templateUrl: 'transaction/directives/sells/interaction.html'
		};
	})

	;

})();
