
'use strict';

(function(){

	angular.module('views.transactions')

	.controller(
		'viewTransactionsListController',
		function(
			$window,
			$rootScope,
			$scope,
			$timeout,
			path,
			stageFormFactory,
			transactionsService,
			transactionTransferFactory,
			transactionFinishFactory,
			cardActionFactory,
			permission
		){

			$scope.listFilter = $scope.$parent.$parent.listFilter;
			$scope.listObj = $scope.$parent.listObj;

			$scope.isOnQueue = transactionsService.isOnQueue;
			$scope.isFinished = transactionsService.isFinished;
			$scope.expiresProgressThreshold = transactionsService.getExpiresProgressThreshold();

			var redirToPathItem = function(item){
				$rootScope.mainController.go(path.get('transaction').withItem(item));
			};

			var goToItem = function(item, event){

				var pathItem = path.get('transaction').withItem(item);

				if(event.ctrlKey || event.which === 2){
					$window.open(pathItem);
				}else if(event.which === 1){
					redirToPathItem(item);
				}

			};

			$scope.showCardActionsModal = function(item){
				cardActionFactory.showModal({
					data: cardActionFactory
						.getNewCardActionsData()
						.update({
							title: item.extraInfo.produtoNome,
							emailFollowup: item.extraInfo.atendimentoFollowUpEmail,
							prospectNome: item.extraInfo.prospectNome,
							phones: item.extraInfo.prospectTelefones,
							emails: item.extraInfo.prospectEmails,
						}),
					resource: {
						id: item.id,
						resource: 'transactions'
					},
				});
			};

			$scope.transfer = function(item){

				transactionTransferFactory.show({
					item: item,
					delegate: {
						transferedFromOtherToSameCurrentUser: function(transferredItem){
							redirToPathItem(transferredItem);
						},
						updateItem: function(transferredItem){
							transactionsService.updateItem(item, transferredItem);
						},
						removeItemFromUser: function(){
							$scope.listObj.removeItem(item);
						}
					}
				});

			};

			$scope.finish = function(action, item) {

				transactionFinishFactory.show({
					item: item,
					action: action,
					delegate: {
						updateItem: function(finishedItem) {
							transactionsService.updateItem(item, finishedItem);
						}
					}
				});

			};

			$scope.clickItem = function(item, $event){

				if(
					$($event.target).closest('[preventClickItem]').length
					||
					$($event.target).closest('view-transaction-stage-form').length
					||
					angular.element($event.target).hasClass('dropdown-backdrop')
				){
					return;
				}

				$($event.target).closest('.card').addClass('active');

				$timeout(function(){
					$event.preventDefault();
					goToItem(item, $event);
				},200);

			};

			var setChangeStageElement;

			$scope.setChangeStageElement = function(event){
				setChangeStageElement = event.target;
			};

			$scope.getContactActionLinks = function(item){

				return cardActionFactory.getContactLinks({
					prospectNome: item.extraInfo.prospectNome,
					emailClient: item.extraInfo.prospectEmails
						? item.extraInfo.prospectEmails[0].prospectEmailValor
						: null,
					emailFollowup: item.extraInfo.atendimentoFollowUpEmail,
					title: item.extraInfo.produtoNome,
					phoneClient: item.extraInfo.prospectTelefones
						? item.extraInfo.prospectTelefones[0].prospectTelefoneFull
						: null,
				});
			};

			$scope.isPipelineOptionDisable = function(option, transactionItem){

				return !permission.checkPermissions('atd_voltar_fase')
					&&
					$scope.listObj.stageSelectOptions.indexOf(option)
					<=
					$scope.listObj.stageSelectOptions.indexOf(transactionItem.stageItem);

			};

			var onFormDestroy = function(transactionItem){
				transactionItem.stageItem = transactionItem.originalStageItem;
			};

			$scope.changeStage = function(transactionItem){

				var stageItem = transactionItem.stageItem;

				if(!stageFormFactory.checkPermissionsToastr()){
					onFormDestroy(transactionItem);
				}else{
					$timeout(function(){

						stageFormFactory.setTransactionStage({
							element: setChangeStageElement,
							scope: $scope,
							delegate: {
								onFormDestroy: function(){
									onFormDestroy(transactionItem);
								},
								success: function(response){
									transactionItem.originalStageItem = stageItem;
									transactionsService.updateItem(transactionItem, response.data);
								}
							},
							transactionItem: transactionItem,
							stageItem: transactionItem.stageItem,
							forceDownloadStage: true
						});
					},0);
				}

			};

			$scope.getStatusClassName = function(item){
				return transactionsService
					.statusesByFieldValue[item.fields.atendimento.atendimentoStatus];
			};

			$scope.getDaysToExpires = function(item){

				var days = transactionsService.getExpiresTimeInDays(item);

				return days > 99 ? '99+' : days;
			};

			$scope.getExpiresTooltip = function(item){
				return transactionsService.getExpiresText(item);
			};

		}
	)

	.directive('viewTransactionsTable', function($rootScope){
		if($rootScope.mainController.device == 'desktop'){
			return {
				restrict: 'E',

				scope: {},
				controller: 'viewTransactionsListController',
				templateUrl: 'transactions/directives/list/table-desktop.html'
			};
		}else{
			return {
				restrict: 'E',

				scope: {},
				controller: 'viewTransactionsListController',
				templateUrl: 'transactions/directives/list/table-mobile.html'
			};
		}
	})

	.directive('viewTransactionsColumn', function(){
		return {
			restrict: 'E',

			scope: {},
			controller: 'viewTransactionsListController',
			templateUrl: 'transactions/directives/list/column.html'
		};
	})

	;

})();
