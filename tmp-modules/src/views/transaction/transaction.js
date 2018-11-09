
'use strict';

(function(){

	angular.module('views.transaction',[])

	.controller(
		'ViewTransactionController',

		function(
			$rootScope,
			$scope,
			$timeout,
			$routeParams,
			$popover,
			$document,
			path,
			transactionsService,
			toastrFactory,
			transactionTransferFactory,
			transactionFinishFactory,
			usersService,
			notificationCenterFactory,
			destroyFactory,
			cardActionFactory
		){

			path.setCurrent('transaction');

			var breadcrumbsClientName = {
				path: false
			};

			$scope.breadcrumbs = [{
				label: path.get('transactions').label,
				path: path.get('transactions').path
			}, breadcrumbsClientName];

			$scope.error = false;
			$scope.loading = true;

			$scope.transactionItem = {};
			$scope.clientItem = {};
			$scope.expiresProgressThreshold = transactionsService.getExpiresProgressThreshold();

			$scope.$watch('clientItem', function(newValue){
				if(newValue.fields){
					setCardActionsData();
					breadcrumbsClientName.label =
						$scope.clientItem.fields.prospect.prospectNome;
				}
			}, true);

			$scope.cardActionsResource = {
				id: null,
				resource: 'transactions'
			};

			$scope.quickActionsModel = {
				value: 'none'
			};

			var resetQuickActionsModel = function(){
				$scope.quickActionsModel.value = 'none';
			};

			var quickActions = {
				transfer: function(){

					transactionTransferFactory.show({
						item: $scope.transactionItem,
						onHide: resetQuickActionsModel,
						delegate: {

							reset: resetQuickActionsModel,

							updateItem: function(transferredItem){
								if($scope.transactionItem.id != transferredItem.id){
									$rootScope.mainController.go(
										path.get('transaction').withItem(transferredItem),
										true
									);
								}else{

									transactionsService.updateItem(
										$scope.transactionItem,
										transferredItem
									);

									setViewTitle();
								}
							},

							removeItemFromUser: function(){
								$rootScope.mainController.go(
									path.getPath('transactions'),
									true
								);
							}

						}
					});

				},
				finish: function(action) {

					transactionFinishFactory.show({
						item: $scope.transactionItem,
						action: action,
						onHide: resetQuickActionsModel,
						delegate: {

							reset: resetQuickActionsModel,

							updateItem: function() {
								$rootScope.mainController.go(
									path.get('transactions'),
									false);
							}
						}
					});

				}
			};

			$scope.transfer = function(){
				quickActions.transfer();
			};

			$scope.finish = function(action) {
				quickActions.finish(action);
			};

			$scope.quickActionTransferLabel = function(){
				return transactionsService.isFinished($scope.transactionItem)
					? 'Reabrir'
					: 'Transferir';
			};

			var setTransactionItem = function(data){
				$scope.transactionItem = data;
				$scope.clientItem = data.expand.clients;
				$scope.cardActionsResource.id = data.id;
			};

			$scope.viewTitleExtra = [];

			var setViewTitle = function(){

				$scope.viewTitleDesc =
					'Código de negócio: '
					+ $scope.transactionItem.fields.atendimento.atendimentoCodigo;

				$scope.viewTitleExtra.splice(0,$scope.viewTitleExtra.length);

				// $scope.viewTitleExtra.push(
				// 	'Fase: ' + $scope.transactionItem.extraInfo.pipelineStageNome
				// 	'Status: ' + $scope.transactionItem.fields.atendimento.atendimentoStatus
				// );

				// if($scope.transactionItem.extraInfo.usuarioNome) {
				// 	$scope.viewTitleExtra.push(
				// 		'Corretor: ' + $scope.transactionItem.extraInfo.usuarioNome
				// 	);
				// }

			};

			$scope.cardActionsData = cardActionFactory.getNewCardActionsData();

			var setCardActionsData = function(){

				if($scope.clientItem.fields){

					$scope.transactionItem.extraInfo.prospectNome =
						$scope.clientItem.fields.prospect.prospectNome;

					$scope.cardActionsData.update(
						{
							title: $scope.transactionItem.extraInfo.produtoNome,
							emailFollowup: $scope.transactionItem.extraInfo.atendimentoFollowUpEmail,
							prospectNome: $scope.transactionItem.extraInfo.prospectNome,
							phones: $scope.clientItem.fields.prospectTelefones,
							emails: $scope.clientItem.fields.prospectEmails,
							urlModuleSells: $scope.transactionItem.extraInfo.integracaoVendasUrl
						}
					);

				}

			};

			var toastAttended;

			var setToastAttended = function(){
				toastAttended = function(){
					$rootScope.mainController.go(
						path.get('transaction').withItem($scope.transactionItem)
					);
				};
			};

			var attendBeforeDisplay = function(attrs){

				var item = attrs.item;

				usersService.getUserProfile({
					success: function(response){

						var userProfile = response.data;

						if(transactionsService.isOnQueue(item)){

							if(
								item
								.fields
								.atendimento
								.atendimentoUsuarioContaSistemaIdGuid == userProfile.id
							){

								transactionsService.actions({
									item: item,
									action: 'attend',
									method: 'POST',
									toastrMessages: {
										success: {
											title: 'Parabéns!',
											message: 'Você acaba de iniciar o atendimento com '
												+ item.expand.clients.fields.prospect.prospectNome
												+ '. Nós do Anapro desejamos uma ótima venda.',
											autoDismiss: false,
											onTap: function(){
												if(toastAttended){
													toastAttended();
												}
											},
											forbidden: {
												title: 'Desculpe, aparentemente você não pode iniciar esse atendimento ou, ele já foi atendido por outra pessoa.',
												message: 'Tente novamente mais tarde, obrigado.'
											},
											serverError: {
												title: 'Desculpe, estamos com dificuldades para iniciar esse atendimento.',
												message: 'Tente novamente mais tarde, obrigado.'
											}
										}
									},
									success: function(response){

										transactionsService.updateItem(
											item,
											response.data
										);

										notificationCenterFactory.removeNotificationByAttribute(
											{
												attribute: 'atendimentoIdGuid',
												value: item.id
											},
											true
										);

										attrs.callback(item);

									},
									error: function(){

										$scope.error = true;
										$scope.loading = false;

									}
								});

								return;

							}else if(usersService.isAdm()){

								toastrFactory.warn({
									title: 'Desculpe!',
									message: 'O cliente '
										+ item.expand.clients.fields.prospect.prospectNome
										+ ' pertence a outro usuário. Para iniciar esse atendimento basta transferi-lo à você. '
										+ 'Clique aqui se deseja transferir agora.',
									onTap: quickActions.transfer
								});

							}

						}

						attrs.callback(item);

					}
				});

			};

			var getItem = function(id){
				transactionsService.getItem(
					{
						params: {
							'_expand': ['clients']
						},
						id: id,
						toastrMessages: {
							payloadError: {
								onlyErrorMessage: true,
								title: 'Esse atendimento não existe.',
								message: ''
							},
							forbidden: {
								title: 'Esse cliente pertence a outro usuário.',
								message: 'Se ele estava aguardando atendimento, alguém o atendeu antes de você.'
							}
						},
						success: function(response){
							attendBeforeDisplay({
								item: response.data,
								callback: function(item){
									setTransactionItem(item);
									setCardActionsData();
									setViewTitle();
									$scope.loading = false;
								}
							});
						},
						error: function(response){
							console.log(response);
							$scope.loading = false;
							$scope.error = response.config.errorMessage;
						}
					}
				);
			};

			$scope.isOnQueue = function(){
				return transactionsService.isOnQueue($scope.transactionItem);
			};

			$scope.isFinished = function(){
				return transactionsService.isFinished($scope.transactionItem);
			};

			$scope.canEditWhenNotActive = function(){
				return transactionsService.canEditWhenNotActive($scope.transactionItem);
			};

			$scope.delegates = {
				cardActions: {
					postItem: function(item){
						$scope.delegates.cardFollowup.addItem(item);
					}
				},
				cardFollowup: {
					getSuccess: function(data){
						if($scope.delegates.cardSells.updateInteractions){
							$scope.delegates.cardSells.updateInteractions(data);
						}
					}
				},
				cardSells: {},
				stage: setViewTitle
			};

			$scope.delegates.cardClient = {
				cardActions: $scope.delegates.cardActions
			};

			$scope.showModal = function(){

				cardActionFactory.showModal({
					data: $scope.cardActionsData,
					resource: $scope.cardActionsResource,
					delegate: $scope.delegates.cardActions
				});
			};

			$scope.getStatusClassName = function(){
				return transactionsService
					.statusesByFieldValue[
						$scope.transactionItem.fields.atendimento.atendimentoStatus
					];
			};

			$scope.getDaysToExpires = function(item){

				var days = transactionsService.getExpiresTimeInDays(item);

				return days > 99 ? '99+' : days;
			};

			$scope.getExpiresTooltip = function(item){
				return transactionsService.getExpiresText(item);
			};

			$scope.$on(
				'$viewContentLoaded',
				function(){
					$timeout(function(){

						if($routeParams.id){
							getItem($routeParams.id);
						}

					}, 0);
				}
			);

			$scope.$on(
				'$destroy', function(){
					setToastAttended();
				}
			);

			destroyFactory({
				scope: $scope,
				objects: [
					$scope.delegates
				]
			});

		}
	)

	;

})();
