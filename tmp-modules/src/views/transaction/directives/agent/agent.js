
'use strict';

(function(){

	angular.module('views.transaction')

	// .controller(
	// 	'viewTransactionAgentController',
	// 	function(){

	// 		// var getFirstAndLastName = function(){
	// 		// 	var tempName = $scope.item.extraInfo.usuarioNome.match(/^\w+|\w+$/g, '');
	// 		// 	var name = tempName[0];
	// 		// 	var lastName = tempName[1] || '';

	// 		// 	$scope.agentName = name + ' ' + lastName;
	// 		// };

	// 		// getFirstAndLastName();

	// 	}
	// )

	.directive('viewTransactionAgent', function(){
		return {
			restrict: 'E',
			scope: {
				item: '='
			},
			transclude: true,
			// controller: 'viewTransactionAgentController',
			templateUrl: 'transaction/directives/agent/agent.html'
		};
	})

	;

})();
