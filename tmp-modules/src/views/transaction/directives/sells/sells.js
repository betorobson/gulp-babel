
'use strict';

(function(){

	angular.module('views.transaction')

	.controller(
		'viewTransactionSellsController',

		function(
			$scope,
			viewTransactionSellsFactory
		){

			$scope.interactions = [];
			$scope.loading = true;
			$scope.empty = false;
			$scope.delegate = $scope.delegate || {};

			$scope.delegate.updateInteractions = function(interactions){

				$scope.interactions.splice(0);

				angular.extend(
					$scope.interactions,
					viewTransactionSellsFactory.getInteractions(interactions)
				);

				$scope.empty = !$scope.interactions.length;
				$scope.loading = false;

			};

		}
	)

	.directive('viewTransactionSells', function(){
		return {
			restrict: 'E',
			scope: {
				delegate: '='
			},
			controller: 'viewTransactionSellsController',
			templateUrl: 'transaction/directives/sells/sells.html'
		};
	})

	;

})();
