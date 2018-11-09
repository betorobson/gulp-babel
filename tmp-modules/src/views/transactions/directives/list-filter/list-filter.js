
'use strict';

(function(){

	angular.module('views.transactions')

	.controller(

		'viewTransactionsListFilterController',

		function(
			$rootScope,
			$scope,
			$timeout,
			$modal,
			path,
			transactionsService,
			automateNewLeadFactory,
			addClientFactory,
			notificationCenterTransactionsAwaiting
		){

			$scope.isAutomateNewLeadDisabled = function(){
				return automateNewLeadFactory.isDisabled();
			};

			$scope.getAutomateNewLeadButtonTitle = function(){
				return automateNewLeadFactory.activeOfferMessage();
			};

			var addClientDelegate = {
				reset: function(){
					console.log('modalAddClient reset: ');
				},
				itemAddedCurrentUserHasNoAccess: function(item){
					console.log('temAddedCurrentUserHasNoAccess', item);
				},
				itemAddedToCurrentUser: function(item){
					$rootScope.mainController.go(
						path.get('transaction').withItem(item)
					);
				},
				itemAddedToOtherUser: function(item){
					console.log('temAddedToOtherUser', item);
				}
			};

			var transactionStatuses = transactionsService.statuses;

			$scope.showModalAddClient = function() {
				addClientFactory.showModal({
					delegate: addClientDelegate
				});
			};

			$scope.listFilter = $scope.$parent.$parent.listFilter;
			$scope.listObj = $scope.$parent.listObj;

			$scope.sendEmailMarketing = function(){

				console.info(
					'Send email marketing for:',
					$scope.listObj.selected.items
				);

			};

			$scope.showTransactionsOnQueueButton = function(){

				return (
					$scope.listFilter.model.filters
					&&
					$scope.listFilter.model.filters.atendimentoStatus != transactionStatuses.queue
					&&
					$scope.listFilter.model.filters.atendimentoOpcao == 'meus'
					&&
					notificationCenterTransactionsAwaiting.getTotalNewClients() > 0
				);

			};

			$scope.showAttendedTransactionsButton = function(){

				return (
					$scope.listFilter.model.filters
					&&
					$scope.listFilter.model.filters.atendimentoStatus == transactionStatuses.queue
					&&
					$scope.listFilter.model.filters.atendimentoOpcao == 'meus'
				);

			};

			$scope.getTotalTransactionsOnQueue = function(){
				return notificationCenterTransactionsAwaiting.getTotalNewClients();
			};

			$scope.showTransactionsOnQueue = function(){
				$rootScope.mainController.go(transactionsService.getTransactionsAwaitingLink());
			};

			$scope.showAttendedTransactions = function(){

				$scope.listFilter.model = {
					q: $scope.listFilter.model.q,
					filters: {
						atendimentoStatus: transactionStatuses.attended
					}
				};

				$scope.listFilter.setFilters();

			};

			$scope.showTransactionsWithOrWithoutTasks = function(field){

				var filter = {};

				if(!$scope.transactionsWithorWithoutTasks[field].selected){
					filter[field] = $scope.transactionsWithorWithoutTasks[field].value;
				}

				$scope.listFilter.model = {
					q: '',
					filters: filter
				};

				$scope.listFilter.setFilters();

			};

			$scope.getNewLead = function(){
				automateNewLeadFactory.get();
			};

			$scope.transactionsWithorWithoutTasks = {
				atendimentoPendencias: {
					value: null,
					total: null,
					selected: false
				},
				atendimentoCompromissos: {
					value: null,
					total: null,
					selected: false
				}
			};

			$scope.toggleAdvancedFilters = function($event){

				$event.stopPropagation();
				$scope.listFilter.advanced = !$scope.listFilter.advanced;

				$scope.delegateListFilter.toggleAdvancedFilters();

			};

			$scope.delegateListFilter = {};

			var setTotalTransactionsWithOrWithoutTasks = function(){

				$scope.listObj.data.filters.map(function(item){
					if($scope.transactionsWithorWithoutTasks[item.field]){

						$scope.transactionsWithorWithoutTasks[item.field].total =
							item.options[0].name;

						$scope.transactionsWithorWithoutTasks[item.field].value =
							item.options[0].value;

						$scope.transactionsWithorWithoutTasks[item.field].selected =
							!!item.initialValue;

					}
				});

			};

			$timeout(setTotalTransactionsWithOrWithoutTasks);

		}
	)

	.directive('viewTransactionsListFilter', function(){
		return {
			restrict: 'E',
			scope: {},
			controller: 'viewTransactionsListFilterController',
			templateUrl: 'transactions/directives/list-filter/list-filter.html'
		};
	})

	;

})();
