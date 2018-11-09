
'use strict';

(function(){

	angular.module('directives.add-client',[])

	.factory('addClientFactory',
		function($modal) {

			var showModal = function(attrs) {
				attrs = attrs || {};

				$modal({
					templateUrl: 'add-client/add-client-modal.html',
					show: true,
					animation: 'am-fade-and-slide-top',
					controller: function($scope) {
						$scope.delegate = attrs.delegate;
					},
					onHide: function() {
						console.log('modalAddClient hide');
					}
				});

			};

			return {
				showModal: showModal
			};
		})

	.controller(
		'AddClientController',

		function(
			$rootScope,
			$scope,
			$filter,
			$timeout,
			path,
			anaproFormlyFactory,
			transactionsService,
			usersService
		){

			var userProfile;

			usersService.getUserProfile({
				success: function(response){
					userProfile = response.data;
				}
			});

			$scope.delegate = $scope.delegate || {};

			$scope.loading = false;
			$scope.submitStatus = {
				success: false,
				error: false
			};

			$scope.form = {};
			$scope.formOptions = {};
			$scope.model = {
				prospectEmails: [{}],
				prospectTelefones: [{}]
			};

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

			var delegateItemAddedCurrentUserHasNoAccess = function(item){

				if($scope.delegate.itemAddedCurrentUserHasNoAccess && !item.id){
					$scope.delegate.itemAddedCurrentUserHasNoAccess(item);
				}

			};

			var delegateItemAddedToCurrentUser = function(item){

				if(
					$scope.delegate.itemAddedToCurrentUser
					&&
					item.id
					&&
					item.fields.atendimento
						.atendimentoUsuarioContaSistemaIdGuid == userProfile.id
				){
					$scope.delegate.itemAddedToCurrentUser(item);
				}

			};

			var delegateItemAddedToOtherUser = function(item){

				if(
					$scope.delegate.itemAddedToOtherUser
					&&
					item.id
					&&
					item.fields.atendimento
						.atendimentoUsuarioContaSistemaIdGuid != userProfile.id
				){

					$scope.delegate.itemAddedToOtherUser(item);

				}

			};

			var delegateHide = function(){

				if($scope.delegate.hide){
					$scope.delegate.hide();
				}

			};

			var runDelegates = function(response){

				delegateHide(response.data);
				delegateItemAddedCurrentUserHasNoAccess(response.data);
				delegateItemAddedToCurrentUser(response.data);
				delegateItemAddedToOtherUser(response.data);

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

			var toastrMessagesSetOptions = function(itemAdded){

				if(itemAdded.id){
					return {
						autoDimiss: false,
						closeButton: true,
						timeOut: 0,
						onTap: function(){
							$rootScope.mainController.go(
								path.get('transaction').withItem(itemAdded)
							);
						}
					};
				}else{
					return {};
				}

			};

			var postAction = function(){

				transactionsService.actions({
					action: 'request',
					method: 'POST',
					data: {
						fields: $scope.model
					},
					toastrMessages: {
						success: {
							title: 'Cliente '
								+ $scope.model.prospectNome
								+ ' adicionado com sucesso.',
							setOptions: toastrMessagesSetOptions
						},
						serverError: {
							title: 'Desculpe, estamos com dificuldades para adicionar o cliente'
								+ $scope.model.prospectNome + '.'
						}
					},
					success: submitSuccess,
					error: submitError
				});

			};

			var update = function(){

				var model = angular.copy($scope.model);

				$scope.loading = true;

				transactionsService.actions({
					action: 'request',
					method: 'GET',
					params: {filters: JSON.stringify(model)},
					toastrMessages: {
						serverError: {
							title: 'Desculpe, estamos com dificuldade para adicionar um novo cliente.'
						}
					},
					success: function(response){
						setFields(response.data.filters);
						$scope.loading = false;
					},
					error: delegateHide
				});

			};

			update();

			$scope.setAdvanced = function(){
				$scope.model.atendimentoActionRequestOpcaoAvancado = true;
				update();
			};

			var lastSelectedUser;

			var setLastSelectedUser = function(){
				lastSelectedUser = $scope.model.usuarioIdGuid || lastSelectedUser || null;
				delete $scope.model.usuarioIdGuid;
			};

			var fieldsLayout = $rootScope.mainController.device == 'desktop'
				?
					'row'
				:
					'column'
			;

			var setFields = function(fields){

				$scope.fields = [];

				var formlyFields = [];

				anaproFormlyFactory.createFormlyFieldsFromAPI(
					fields,
					formlyFields,
					{
						merge: {
							prospectNome: {
								elementAttributes: {
									'layout': fieldsLayout
								},
								templateOptions: {
									label: 'Nome completo:',
									placeholder: 'Nome do cliente'
								}
							},
							prospectSexo: {
								type: 'anaproSelectButtons',
								elementAttributes: {
									'layout': 'row'
								}
							},
							atendimentoActionRequestAtenderAutomaticamente: {
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
							usuarioIdGuid: {
								type: 'nya-select',
								data: {
									customDesc: '{{name}}, <strong>{{properties.usuarioApelido}}</strong><br />{{properties.usuarioEmail}}'
								},
								templateOptions: {
									hint: 'Se o usuário não estiver na lista, é porque ele não pertence à campanha e canal selecionados.'
								}
							},
							usuarioSeguidoresIdGuids: {
								type: 'nya-select',
								data: {
									multiple: true,
									customDesc: '{{name}}, <strong>{{properties.usuarioApelido}}</strong><br />{{properties.usuarioEmail}}'
								},
								templateOptions: {
									noErrorSpace: true
								}
							},
							atendimentoTipoDirecionamento: {
								type: 'anaproSelectButtons',
								data: {
									onChange: function(){
										setLastSelectedUser();
										update();
									}
								},
								elementAttributes: {
									'layout': 'row'
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
							midiaIdGuid: {
								className: 'nya-position-top',
								templateOptions: {
									noErrorSpace: true
								}
							},
							atendimentoActionRequestOpcaoAvancado: {
								type: 'hidden'
							},
							prospectCpf: {
								'className': 'input-nogrow',
								elementAttributes: {
									'layout': fieldsLayout,
									'flex': '50'
								},
								templateOptions: {
									placeholder: 'CPF do cliente'
								}
							}
						}
					}
				);

				formlyFields = formlyFields.concat(fieldsOrig);

				anaproFormlyFactory.setFieldsOrder(
					formlyFields,
					[
						'prospectNome',
						'prospectEmailValor',
						'prospectTelefoneFull',
						'prospectSexo',
						'prospectCpf',
						'usuarioIdGuid'
					]
				);

				$scope.fields = formlyFields;

			};

			var fieldsOrig = [

				{
					type: 'maskedInput',
					key: 'prospectTelefoneFull',
					model: $scope.model.prospectTelefones[0],
					className: 'input-nogrow',
					elementAttributes: {
						'layout': fieldsLayout,
						'flex': '50'
					},
					templateOptions: {
						label: 'Telefone',
						type: 'tel',
						placeholder: 'Telefone com DDD',
						mask: '(99) 9?9999-9999'
					},
					expressionProperties: {
						'templateOptions.required': function(){
							return $scope.model.prospectContatoObrigatorio
								&& !$scope.model.prospectEmails[0].prospectEmailValor;
						}
					},
					validation: {
						messages: {
							mask: function(newValue, oldValue, scope){
								newValue, oldValue, scope;

								return 'Número de telefone inválido!';
							}
						}
					}
				},

				{
					type: 'anaproEmail',
					key: 'prospectEmailValor',
					model: $scope.model.prospectEmails[0],
					elementAttributes: {
						'layout': fieldsLayout
					},
					templateOptions: {
						label: 'Email',
						placeholder: 'exemplo@exemplo.com'
					},
					expressionProperties: {
						'templateOptions.required': function(){
							return $scope.model.prospectContatoObrigatorio
								&& !$scope.model.prospectTelefones[0].prospectTelefoneFull;
						}
					}
				},

			];

		}
	)

	.directive('addClient', function(){
		return {
			restrict: 'E',
			templateUrl: 'add-client/add-client.html',
			controller: 'AddClientController',
			scope: {
				delegate: '=?'
			}
		};
	});

})();
