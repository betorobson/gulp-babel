
'use strict';

(function() {

	angular.module('directives.navigationBarActions', [])

		.factory(
			'navigationBarActionsFactory',
			function($modal){

				var showModal = function(){

					$modal({
						templateUrl: 'navigation-bar/actions/modal.html',
						show: true,
						animation: 'am-fade-and-slide-top',
						controller: function($scope){

							$scope.delegate = {};

						}

					});

				};

				return {
					showModal: showModal
				};

			}
		)

		.controller(
			'NavigationBarActionsController',

			function(
				$rootScope,
				$scope,
				path,
				automateNewLeadFactory,
				addClientFactory,
				cardActionFactory,
				usersService
			){

				$scope.urlModuleSells = false;

				usersService.getUserProfile({
					success: function(response){
						$scope.urlModuleSells = response.data.extraInfo.contaSistemaVendasUrl;
					}
				});

				$scope.btnClass = {
					'btn-bigicon-text': $scope.modalDelegate
				};

				var addClientDelegate = {
					reset: function() {
						console.log(
							'NavigationBarActionsController.addClientDelegate.reset()'
						);
					},
					itemAddedCurrentUserHasNoAccess: function(item) {
						console.log(
							'NavigationBarActionsController.addClientDelegate.',
							item
						);
					},
					itemAddedToCurrentUser: function(item) {
						console.log('NavigationBarActionsController.addClientDelegate.');
						$rootScope.mainController.go(
							path.get('transaction').withItem(item)
						);
					},
					itemAddedToOtherUser: function(item) {
						console.log(
							'NavigationBarActionsController.addClientDelegate.itemAddedToOtherUser()',
							item
						);
					}
				};

				var hideModal = function(){
					if($scope.modalDelegate){
						$scope.modalDelegate.hide();
					}
				};

				$scope.showModalAddClient = function() {

					hideModal();

					addClientFactory.showModal({
						delegate: addClientDelegate
					});

				};

				$scope.showCardActionsModal = function(tabButtonActivated){

					hideModal();

					cardActionFactory.showModal({
						resource: {
							id: null,
							resource: 'transactions'
						},
						tabButtonActivated: tabButtonActivated
					});

				};

				$scope.getNewLead = function() {
					hideModal();
					automateNewLeadFactory.get();
				};

				$scope.getNewLeadButtonClass = function(){
					return {
						'disabled-item' : automateNewLeadFactory.isDisabled()
					};
				};

				$scope.isAutomateNewLeadDisabled = function(){
					return automateNewLeadFactory.isDisabled();
				};

				$scope.activeOfferMessage = function(){
					return automateNewLeadFactory.activeOfferMessage();
				};

			}
		)

		.directive('navigationBarActions', function() {
			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'navigation-bar/actions/actions.html',
				controller: 'NavigationBarActionsController',
				scope: {
					modalDelegate: '='
				}
			};
		});

})();
