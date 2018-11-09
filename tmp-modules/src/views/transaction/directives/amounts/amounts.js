
'use strict';

(function(){

	angular.module('views.transaction')

	.controller(
		'viewTransactionAmountsController',
		function(
			$rootScope,
			$scope,
			$element,
			$timeout,
			$popover,
			$tooltip,
			transactionsService
		){

			$scope.mainController = $rootScope.mainController;

			$scope.isFinished = function(){
				return transactionsService.isFinished($scope.transactionItem);
			};

			var amountPopover;

			$timeout(function(){

				amountPopover = $popover(
					angular.element($element[0]),
					{
						scope: $scope,
						title: 'Alterar valor e comissão',
						contentTemplate: 'transaction/directives/edit-amounts/popover-content.html',
						trigger: 'manual',
						autoClose: true,
						animation: 'am-flip-x',
						placement: 'bottom'
					}
				);
			});

			$scope.setAmount = function(){
				if(
					$scope.canEditWhenNotActive()
					&&
					$rootScope.mainController.device == 'desktop'
				){
					amountPopover.show();
				}
			};

			$scope.canEditWhenNotActive = function(){
				return transactionsService.canEditWhenNotActive($scope.transactionItem);
			};

			if(!$scope.canEditWhenNotActive()){
				$timeout(function(){
					$tooltip(
						$element,
						{
							title: 'Você não pode editar o valor de negócio<br />do cliente que não esta em atendimento',
							type: 'warn',
							trigger: 'click',
						}
					);
				});
			}

		}
	)

	.directive('viewTransactionAmounts', function(){
		return {
			restrict: 'E',
			scope: {
				transactionItem: '='
			},
			controller: 'viewTransactionAmountsController',
			templateUrl: 'transaction/directives/amounts/amounts.html'
		};
	})

	;

})();
