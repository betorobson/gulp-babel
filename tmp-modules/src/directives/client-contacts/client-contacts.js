
'use strict';

(function(){

	angular.module('directives.client-contact', [
		'directives.client-contacts.factory'
	])

	.controller(
		'clientContactsController',

		function(
			$scope,
			cardActionFactory,
			transactionsService
		){

			$scope.loading = true;

			$scope.showCardActionsModal = function(phoneClient, tabButtonActivated){

				cardActionFactory.showModal({
					data: cardActionFactory
						.getNewCardActionsData()
						.update({
							prospectNome: $scope.clientItem.fields.prospect.prospectNome,
							phones: [{prospectTelefoneFull: phoneClient}]
						}),
					resource: $scope.resource,
					tabButtonActivated: tabButtonActivated
				});

			};

			$scope.sendEmail = function(emailClient){

				return cardActionFactory.getContactLinks({
					prospectNome: $scope.item.extraInfo.prospectNome,
					emailClient: emailClient,
					title: $scope.item.extraInfo.produtoNome,
					emailFollowup: $scope.item.extraInfo.atendimentoFollowUpEmail
				});

			};

			var success = function(response){
				$scope.item = response.data;
				$scope.clientItem = response.data.expand.clients;
				$scope.loading = false;
			};

			if($scope.item){

				success({
					data: $scope.item
				});

			}else if($scope.resource && $scope.resource.id){

				transactionsService.getItem(
					{
						id: $scope.resource.id,
						params: {
							'_expand': ['clients']
						},
						success: success
					}
				);

			}

		}
	)

	.directive('clientContacts', function(){
		return {
			restrict: 'E',
			scope: {
				item: '=?',
				id: '=?',
				resource: '='
			},
			controller: 'clientContactsController',
			templateUrl: 'client-contacts/client-contacts.html'
		};
	})

	;

})();
