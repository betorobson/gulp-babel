
'use strict';

(function(){

	angular.module('views.transaction')

	.controller(
		'viewTransactionInstructions',
		function(
			$scope,
			transactionsService,
			usersService
		){

			$scope.userWillSoonLooseIt = false;
			$scope.companyName;

			usersService.getUserProfile({
				success: function(response){
					$scope.companyName = response.data.extraInfo.contaSistemaNome;
				}
			});

			var setUserWillSoonLooseIt = function(){

				$scope.userWillSoonLooseIt =
					!!$scope.transactionItem.extraInfo.atendimentoExpiracaoAutomaticaQtdMinutosConf
					&&
					$scope.getExpiresTimeInDays($scope.transactionItem) <= 2;

			};

			$scope.getExpiresTimeInDays = function(){
				return transactionsService.getExpiresTimeInDays($scope.transactionItem);
			};

			$scope.getExpiresTimeConfInDays = function(){
				return transactionsService.getExpiresTimeConfInDays($scope.transactionItem);
			};

			$scope.showInstructions = function(){

				return !$scope.transactionItem.extraInfo.alarmeProximoDtAlarme
				||
				$scope.transactionItem.extraInfo.alarmeProximoInteracaoQtdMinutosRestantesMax < 0
				||
				$scope.userWillSoonLooseIt;

			};

			setUserWillSoonLooseIt();

		}
	)

	.directive('viewTransactionInstructions', function(){
		return {
			restrict: 'E',
			scope: {
				transactionItem: '='
			},
			transclude: true,
			controller: 'viewTransactionInstructions',
			templateUrl: 'transaction/directives/instructions/instructions.html'
		};
	})

	;

})();
