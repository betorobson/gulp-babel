
'use strict';

(function() {

	angular.module('directives.automate-new-lead', [])
	.constant('activeOfferMessageDisabled', 'No momento, você não tem cliente disponível na Oferta Ativa. Tente novamente mais tarde.')

		.controller(
			'AutomateNewLeadController',

			function(
				$timeout,
				$scope,
				automateNewLeadFactory
			){

				$scope.submitStatus = {
					success: false,
					error: false
				};

				var countProductsId = {};

				var setCountProductsId = function(){
					$scope.items.map(function(item){

						var id = item.fields.produtoIdGuid;

						if(!countProductsId[id]){
							countProductsId[id] = 0;
						}

						countProductsId[id]++;

					});
				};

				$scope.campaignIsNeeded = function(item){
					return countProductsId[item.fields.produtoIdGuid] > 1;
				};

				var getLeadSuccess = function(data){
					$scope.submitStatus.success = true;
					postExecute(data);
				};

				var getLeadError = function(){
					$scope.submitStatus.error = true;
					postExecute();
				};

				var postExecute = function(data){
					$timeout(function(){

						$scope.submitStatus.success = false;
						$scope.submitStatus.error = false;
						$scope.loading = false;

						if(data){
							automateNewLeadFactory.redirToPathItem(data);
						}

						$scope.delegate.hide();

					},500);
				};

				$scope.getLead = function(item){

					$scope.loading = true;

					automateNewLeadFactory.get({
						product: item,
						success: getLeadSuccess,
						error: getLeadError
					});

				};

				setCountProductsId();

			}
		)

		.factory(
			'automateNewLeadFactory',

			function(
				$modal,
				$rootScope,
				path,
				transactionsService,
				toastrFactory,
				userStatusFactory,
				activeOfferMessageDisabled
			){

				var isDisabled = function(){
					return userStatusFactory.isDisabled('activeOffer');
				};

				var activeOfferMessage = function(){
					return isDisabled() ? activeOfferMessageDisabled : '';
				};

				var redirToPathItem = function(item) {
					$rootScope.mainController.go(path.get('transaction').withItem(item));
				};

				var show = function(attrs) {

					attrs = attrs || {};

					$modal({
						templateUrl: 'automate-new-lead/automate-new-lead-modal.html',
						show: true,
						animation: 'am-fade-and-slide-top',
						controller: function($scope) {
							$scope.items = attrs.items;
							$scope.delegate = attrs.delegate;
						},
						onHide: function() {

							// if(attrs.delegate.hide) {
							// 	attrs.delegate.hide();
							// }

						}
					});

				};

				var canUse = function(){
					if(isDisabled()){
						toastrFactory.warn({
							title: 'Desculpe!',
							message: activeOfferMessageDisabled
						});

						return false;
					}

					return true;
				};

				var get = function(attrs){

					if(!canUse()){
						return;
					}

					attrs = attrs || {};

					var isEmpty = function(data){

						if(data && data.data && !data.data.length){
							toastrFactory.info({
								title: 'Desculpe!',
								message: activeOfferMessageDisabled
							});

							return true;
						}

						return false;

					};

					var showAvailableProducts = function(data) {
						show({
							items: data.data,
							delegate: {}
						});
					};

					var automateLeadSuccess = function(response) {

						var data = response.data;

						if(isEmpty(data)) {
							return;
						}else if(!attrs.product){
							showAvailableProducts(data);
						}

						if(attrs.success){
							attrs.success(data);
						}

					};

					var automateLeadError = function(){
						if(attrs.error){
							attrs.error();
						}
					};

					transactionsService.activeOffer({
						item: attrs.product,
						success: automateLeadSuccess,
						error: automateLeadError,
						toastrMessages: {
							serverError: {
								title: 'Desculpe!',
							}
						},
					});

				};

				var service = {
					get: get,
					redirToPathItem: redirToPathItem,
					isDisabled: isDisabled,
					activeOfferMessage: activeOfferMessage
				};

				return service;

			}
		)

		.directive('automateNewLead', function() {
			return {
				restrict: 'E',
				templateUrl: 'automate-new-lead/automate-new-lead.html',
				controller: 'AutomateNewLeadController',
				scope: {
					items:'=',
					delegate: '=?'
				}
			};
		});

})();
