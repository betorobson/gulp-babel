
'use strict';

(function(){

	angular.module('views.transaction')

	.controller(
		'viewTransactionClientController',

		function(
			$scope,
			transactionsService
		){
			console.log('client controller');

			$scope.clientPath = '/client-path/' + $scope.transactionItem.id;

			$scope.editData = function(content){

				if(!content){

					$('#external-info').collapse('hide');
					$('#bloco-clientes-informacoespessoais').collapse('show');
					$('#bloco-clientes-contato').collapse('show');

				}else{

					$('.client-tab-button').removeClass('active');

					var tabButton = $('.client-tab-button.' + content);
					tabButton.addClass('active');
					tabButton.tab('show');

					window.scrollTo(
						0,
						$('card-client-profile[blocks=' + content + ']').offset().top
						- $('navigation-bar .navbar').outerHeight()
						- 20
					);

				}

			};

			$scope.canEditWhenNotActive = function(){
				return transactionsService.canEditWhenNotActive($scope.transactionItem);
			};

			$scope.clientContactsResource = {
				id: $scope.transactionItem.id,
				resource: 'transactions'
			};

		}
	)

	.directive('viewTransactionClient', function(){
		return {
			restrict: 'E',
			scope: {
				transactionItem: '=',
				delegate: '='
			},
			controller: 'viewTransactionClientController',
			templateUrl: 'transaction/directives/client/client.html'
		};
	})

	;

})();
