
'use strict';

(function(){

	angular.module('views.transaction')

	.controller(
		'viewTransactionInfoController',
		function($scope){

			$scope.copy = function(){
				var input = document.createElement('input');
				document.body.appendChild(input);
				input.className = 'input-copy-hidden';
				input.value = $scope.transactionItem.extraInfo.atendimentoFollowUpEmail;
				input.select();
				document.execCommand('copy', false);
				input.remove();
			};

		}
	)

	.directive('viewTransactionInfo', function(){
		return {
			restrict: 'E',
			scope: {
				transactionItem: '='
			},
			controller: 'viewTransactionInfoController',
			templateUrl: 'transaction/directives/info/info.html'
		};
	})

	;

})();
