
'use strict';

(function(){

	angular.module('directives.transaction-transfer',[])

	.controller(
		'TransactionTransferController',

		function(
			$rootScope,
			$scope,
			$filter,
			anaproFormlyFactory,
			transactionsService,
			usersService,
			$timeout
		){

			var
				itemOwnerIsSameCurrentUser = null,
				userProfile;

			$scope.isOnQueue = transactionsService.isOnQueue;
			$scope.isFinished = transactionsService.isFinished;

			usersService.getUserProfile({
				success: function(response){
					userProfile = response.data;
				}
			});

			$scope.delegate = $scope.delegate || {};

			$scope.loading = true;
			$scope.submitStatus = {
				success: false,
				error: false
			};

			$scope.form = {};
			$scope.formOptions = {};
			$scope.model = {};

			$scope.fields = [];

			var postExecute = function(){
				$timeout(function(){

					$scope.submitStatus.success = false;
					$scope.submitStatus.error = false;
					$scope.loading = false;

				},500);
			};

			var submitError = function(){

				$scope.submitStatus.error = true;

				postExecute();

			};

			var delegateUpdateItem = function(item){

				if($scope.delegate.updateItem
					&&
					item.id
				){
					$scope.delegate.updateItem(item);
				}

			};

			var delegateHide = function(){

				if($scope.delegate.hide){
					$scope.delegate.hide();
				}

			};

			var delegateTransferedFromOtherToSameCurrentUser = function(item){

				if($scope.delegate.transferedFromOtherToSameCurrentUser
					&&
					$scope.model.usuarioIdGuid == userProfile.id
					&&
					!itemOwnerIsSameCurrentUser
				){
					$scope.delegate.transferedFromOtherToSameCurrentUser(item);
				}

			};

			var delegateRemoveItemFromUser = function(item){

				if(
					$scope.delegate.removeItemFromUser
					&&
					!item.id
				){
					$scope.delegate.removeItemFromUser(item);
				}

			};

			var runDelegates = function(response){

				delegateHide(response.data);
				delegateUpdateItem(response.data);
				delegateTransferedFromOtherToSameCurrentUser(response.data);
				delegateRemoveItemFromUser(response.data);

			};

			var submitSuccess = function(response){

				$scope.submitStatus.success = true;

				postExecute();
				runDelegates(response);

				$scope.formOptions.resetModel();

			};

			$scope.cancel = function(){

				$scope.formOptions.resetModel();

				if($scope.delegate.hide){
					$scope.delegate.hide();
				}

			};

			$scope.submit = function(){

				if($scope.form.$valid && !$scope.loading){

					$scope.loading = true;

					postAction();

				}

			};

			var postAction = function(){

				transactionsService.actions({
					action: 'transfer',
					method: 'POST',
					item: $scope.item,
					data: {
						fields: $scope.model
					},
					toastrMessages: {
						success: {
							title:
								$scope.isFinished($scope.item)
								? 'Atendimento reaberto com sucesso.'
								: 'Transferido com sucesso.',
						},
						serverError: {
							title:
								$scope.isFinished($scope.item)
								? 'Desculpe, estamos com dificuldades para reabrir o atendimento.'
								: 'Desculpe, estamos com dificuldades para realizar a transferência.',
							message: 'Tente novamente mais tarde, obrigado.'
						}
					},
					success: submitSuccess,
					error: submitError
				});

			};

			var setFields = function(fields){

				$scope.fields = [];

				anaproFormlyFactory.createFormlyFieldsFromAPI(
					fields,
					$scope.fields,
					{
						merge: {
							atendimentoActionTransferOpcaoAvancado: {
								type: 'hidden'
							},
							atendimentoTipoDirecionamento: {
								type: 'anaproSelectButtons',
								hideExpression: function(newValue, oldValue, scope, field){
									return field.options.templateOptions.options.length === 1;
								},
								data: {
									onChange: function(){
										setLastSelectedUser();
										update();
									}
								},
								templateOptions: {
									noErrorSpace: true
								},
								elementAttributes: {
									'layout': 'row'
								}
							},
							atendimentoActionTransferAtenderAutomaticamente: {
								type: 'anaproSelectButtons',
								hideExpression: function(newValue, oldValue, scope, field){

									var sameCurrentUser = $scope.model.usuarioIdGuid == userProfile.id;

									if(sameCurrentUser){
										var options = field.options.templateOptions.options;
										var value = options[options.length-1].value;
										field.model[field.options.key] = value;
									}

									return sameCurrentUser;
								},
								templateOptions: {
									noErrorSpace: true
								},
								elementAttributes: {
									'layout': 'row'
								}
							},
							atendimentoConfirmacaoProspectFidelizado: {
								type: 'anaproSelectButtons',
								templateOptions: {
									noErrorSpace: true
								},
								elementAttributes: {
									'layout': 'row'
								}
							},
							usuarioIdGuid: {
								type: 'nya-select',
								data: {
									customDesc: '{{name}}, <strong>{{properties.usuarioApelido}}</strong><br />{{properties.usuarioEmail}}'
								},
								templateOptions: {
									hint: 'Se o usuário não estiver na lista, é porque ele não pertence à campanha e canal selecionados. Para alterar acesse as opções avançadas.'
								}
							},
							usuarioSeguidoresIdGuids: {
								type: 'nya-select',
								data: {
									multiple: true,
									customDesc: '{{name}}, <strong>{{properties.usuarioApelido}}</strong><br />{{properties.usuarioEmail}}'
								}
							},
							campanhaIdGuid: {
								type: 'anaproSelectButtons',
								data: {
									onChange: function(){

										setLastSelectedUser();
										delete $scope.model.canalIdGuid;
										delete $scope.model.produtoIdGuid;

										update();
									}
								}
							},
							canalIdGuid: {
								type: 'anaproSelectButtons',
								data: {
									onChange: function(){

										setLastSelectedUser();
										delete $scope.model.produtoIdGuid;

										update();
									}
								}
							},
							produtoIdGuid: {
								type: 'nya-select',
								className: 'nya-position-top',
								templateOptions: {
									noErrorSpace: true
								}
							},
							observacao: {
								templateOptions: {
									noErrorSpace: true
								}
							}
						}
					}
				);

				anaproFormlyFactory.setFieldsOrder(
					$scope.fields,
					[
						'atendimentoTipoDirecionamento',
						'usuarioIdGuid'
					]
				);

				$timeout(function(){

					if(itemOwnerIsSameCurrentUser === null){
						itemOwnerIsSameCurrentUser = !$scope.model.usuarioIdGuid;
					}

					pickLastSelectedUser($scope.fields);

				},0);

			};

			$scope.setAdvanced = function(){
				$scope.model.atendimentoActionTransferOpcaoAvancado = true;
				update();
			};

			var lastSelectedUser;

			var setLastSelectedUser = function(){
				lastSelectedUser = $scope.model.usuarioIdGuid || lastSelectedUser || null;
				delete $scope.model.usuarioIdGuid;
			};

			var pickLastSelectedUser = function(fields){

				if(lastSelectedUser){
					fields.map(function(field){
						if(field.key == 'usuarioIdGuid'){
							(field.templateOptions.options || []).map(function(option){
								if(option.value == lastSelectedUser){
									$scope.model.usuarioIdGuid = lastSelectedUser;
								}
							});
						}
					});
				}

			};

			var update = function(){

				var model = angular.copy($scope.model);

				$scope.loading = true;

				transactionsService.actions({
					action: 'transfer',
					method: 'GET',
					item: $scope.item,
					params: {filters: JSON.stringify(model)},
					success: function(response){
						setFields(response.data.filters);
						$scope.loading = false;
					},
					error: delegateHide
				});

			};

			update();

		}
	)

	.directive('transactionTransfer', function(){
		return {
			restrict: 'E',
			templateUrl: 'transaction-transfer/transaction-transfer.html',
			controller: 'TransactionTransferController',
			scope: {
				delegate: '=?',
				item: '='
			}
		};
	})

	.factory(
		'transactionTransferFactory',

		function($modal){

			var show = function(attrs){

				attrs = attrs || {};

				$modal({
					templateUrl: 'transaction-transfer/transaction-transfer-modal.html',
					show: true,
					animation: 'am-fade-and-slide-top',
					controller: function($scope, transactionsService){
						$scope.item = attrs.item;
						$scope.delegate = attrs.delegate;
						$scope.isOnQueue = transactionsService.isOnQueue;
						$scope.isFinished = transactionsService.isFinished;
					},
					onHide: function(){

						if(attrs.delegate.hide){
							attrs.delegate.hide();
						}

					}
				});

			};

			return {
				show: show
			};
		}
	);

})();
