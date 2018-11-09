
'use strict';

(function(){

	angular.module('directives.card-client-profile', [])

	.controller(
		'CardClientProfileController',
		function(
			$rootScope,
			$scope,
			$timeout,
			$filter,
			$sce,
			anaproFormlyFactory,
			clientsService,
			permission
		){

			$scope.blocks = ($scope.blocks || 'informacoespessoais,contato')
				.split(',');

			$scope.expandedBlocks = ($scope.expandedBlocks || '').split(',');

			$scope.hideTitleBlocks = ($scope.hideTitleBlocks || '').split(',');

			$scope.loading = false;
			$scope.submitStatus = {
				success: false,
				error: false
			};

			var fieldsLayout = $rootScope.mainController.device == 'desktop'
				?
					'row'
				:
					'column'
			;

			$scope.form = null;
			$scope.formContact = null;

			var gernerateClientContactMultiInputFieldsAttrs = function(attrs){

				var tooltip = {};

				if(attrs.permissionStatus === 'disabled'){
					tooltip = {
						title: $sce.trustAsHtml(attrs.tooltip.disabled),
						type: 'error'
					};
				}else if(attrs.permissionStatus === false){
					tooltip = {
						title: $sce.trustAsHtml(attrs.tooltip.forbidden),
						type: 'warn'
					};
				}

				return {
					attrs: {
						'ng-readonly': 'to.readonly',
						'bs-tooltip': 'options.data.tooltip'
					},
					expressions: attrs.permissionStatus === true
						? {}
						: {
							'templateOptions.noErrorSpace': '!!model.' + attrs.fieldId,
							'templateOptions.readonly': function(currentValue, newValue, scope){
								return !!scope.model[attrs.fieldId];
							},
							'data.tooltip': function(currentValue, newValue, scope){

								if(scope.model[attrs.fieldId]){
									return tooltip;
								}else{
									return {};
								}

							}
						}
				};

			};

			var initAndUpdateClient = function(client){

				if(client){
					angular.extend($scope.client, client);
				}

				if($scope.client){
					$scope.edit = true;
				}

				$scope.model = {
					fields: {
						prospect: {}
					}
				};

				$scope.modelContact = {
					fields: {}
				};

				$timeout(function(){
					setFields();
				}, 0);

			};

			$scope.fields = [];
			$scope.fieldsContact = [];

			var setFields = function(){

				// client properties
				var permissionStatusClientProperties
					= permission.permissionStatus('pro_acessar_cadastro_de_prospect');

				var clientPropertiesPermission = {
					status: permissionStatusClientProperties,
					readonly: permissionStatusClientProperties !== true,
					attrs: permissionStatusClientProperties === true
						? {}
						: {
							'readonly': '',
							'bs-tooltip': 'options.data.tooltip',
						},
					tooltip: permissionStatusClientProperties === true
						? {}
						: permissionStatusClientProperties === 'disabled'
							?
								{
									title: $sce.trustAsHtml(
										'Desculpe, a edição do cadastro do cliente está '
										+ 'temporariamente desativado'
									),
									type: 'error'
								}
							:
								{
									title: $sce.trustAsHtml(
										'Você, não tem permissão para editar o cadastro do cliente'
									),
									type: 'warn'
								}
				};

				$scope.fields = [

					{
						type: 'input',
						key: 'prospectNome',
						model: clientPropertiesPermission.readonly
							? {}
							: $scope.model.fields.prospect,
						defaultValue: $scope.client.fields.prospect.prospectNome,
						ngModelElAttrs: clientPropertiesPermission.attrs,
						data: {
							tooltip: clientPropertiesPermission.tooltip
						},
						elementAttributes: {
							'layout': fieldsLayout
						},
						templateOptions: {
							label: 'Nome completo:',
							type: 'text',
							required: true,
							placeholder: 'Nome do cliente',
							minlength: 6,
							maxlength: 100
						}
					},

					{
						type: 'anaproDate',
						key: 'prospectDtNascimento',
						model: clientPropertiesPermission.readonly
							? {}
							: $scope.model.fields.prospect,
						defaultValue: $scope.client.fields.prospect.prospectDtNascimento,
						ngModelElAttrs: clientPropertiesPermission.attrs,
						data: {
							tooltip: clientPropertiesPermission.tooltip
						},
						className: 'input-nogrow',
						elementAttributes: {
							'layout': fieldsLayout
						},
						templateOptions: {
							label: 'Data de aniversário:',
							max: $filter('date')(
								new Date(),
								'yyyy-MM-ddT00:00:00'
							),
							dateFormat: 'yyyy-MM-ddT00:00:00'
						},
						validation: {
							messages: {
								max: function(){
									return 'A data de nascimento precisa ser menor ou igual a hoje';
								}
							}
						}
					},

					{
						type: 'radio',
						key: 'prospectSexo',
						model: clientPropertiesPermission.readonly
							? {}
							: $scope.model.fields.prospect,
						defaultValue: $scope.client.fields.prospect.prospectSexo,
						ngModelElAttrs: clientPropertiesPermission.attrs,
						data: {
							tooltip: clientPropertiesPermission.tooltip
						},
						elementAttributes: {
							'layout': fieldsLayout
						},
						templateOptions: {
							label: 'Sexo: ',
							noErrorSpace: true,
							options:[
								{
									name: 'Masculino',
									value: 'M'
								},
								{
									name: 'Feminino',
									value: 'F'
								}
							]
						}
					}

				];

				// documentos
				if(permission.permissionStatus('pro_visualizar_documento') === true){

					var clientDocumentsPermission = gernerateClientContactMultiInputFieldsAttrs({
						permissionStatus: permission.permissionStatus('pro_excluir_documento'),
						fieldId: 'prospectDocumentoIdGuid',
						tooltip: {
							disabled: 'Desculpe, a edição de documentos do cliente está '
								+ 'temporariamente desativado',
							forbidden: 'Você, não tem permissão para editar os documentos do cliente'
						}
					});

					$scope.fields.push(
						{
							type: 'multiinput',
							key: 'prospectDocumentos',
							model: $scope.model.fields,
							defaultValue: $scope.client.fields.prospectDocumentos,
							elementAttributes: {
								'layout': 'column'
							},
							className: 'input-nogrow',
							templateOptions: {
								label: 'Número de documentos:'
							},
							data: {
								// layout: 'column',
								keepOnRemoveWhenContainsKey: 'prospectDocumentoIdGuid',
								addLabel: 'Adicionar número de documento',
								fieldTypeKey: 'prospectDocumentoTipo',
								fieldTypeKeyUnique: true,
								fieldsByType: {
									CPF: [
										{
											type: 'maskedInput',
											key: 'prospectDocumentoValor',
											ngModelElAttrs: clientDocumentsPermission.attrs,
											templateOptions: {
												required: true,
												cpf: true,
												placeholder: 'CPF do cliente',
												noErrorSpace: clientDocumentsPermission.readonly,
											},
											expressionProperties: clientDocumentsPermission.expressions
										}
									]
								}
							}
						}
					);

				}

				$scope.fieldsContact = [];

				// emails
				if(permission.permissionStatus('pro_visualizar_email') === true){

					var clientEmailPermission = gernerateClientContactMultiInputFieldsAttrs({
						permissionStatus: permission.permissionStatus('pro_excluir_email'),
						fieldId: 'prospectEmailIdGuid',
						tooltip: {
							disabled: 'Desculpe, a edição de emails do cliente está '
								+ 'temporariamente desativado',
							forbidden: 'Você, não tem permissão para editar os emails do cliente'
						}
					});

					$scope.fieldsContact.push(
						{
							type: 'multiinput',
							key: 'prospectEmails',
							model: $scope.modelContact.fields,
							defaultValue: $scope.client.fields.prospectEmails,
							elementAttributes: {
								'layout': 'column'
							},
							templateOptions: {
								label: 'Emails:'
							},
							data: {
								keepOnRemoveWhenContainsKey: 'prospectEmailIdGuid',
								layout: 'column',
								addLabel: 'Adicionar email',
								fields: [
									{
										type: 'anaproEmail',
										key: 'prospectEmailValor',
										ngModelElAttrs: clientEmailPermission.attrs,
										templateOptions: {
											placeholder: 'exemplo@exemplo.com',
											required: true,
											noErrorSpace: clientEmailPermission.readonly
										},
										expressionProperties: clientEmailPermission.expressions,
									}
								]
							}
						}
					);

				}

				// phone numbers
				if(permission.permissionStatus('pro_visualizar_telefone') === true){

					var clientPhoneNumbersPermission = gernerateClientContactMultiInputFieldsAttrs({
						permissionStatus: permission.permissionStatus('pro_excluir_telefone'),
						fieldId: 'prospectTelefoneIdGuid',
						tooltip: {
							disabled: 'Desculpe, a edição de telefones do cliente está '
								+ 'temporariamente desativado',
							forbidden: 'Você, não tem permissão para editar os telefones do cliente'
						}
					});

					console.log(clientPhoneNumbersPermission);

					$scope.fieldsContact.push(
						{
							type: 'multiinput',
							key: 'prospectTelefones',
							model: $scope.modelContact.fields,
							defaultValue: $scope.client.fields.prospectTelefones,
							elementAttributes: {
								'layout': 'column'
							},
							templateOptions: {
								label: 'Telefones:'
							},
							data: {
								keepOnRemoveWhenContainsKey: 'prospectTelefoneIdGuid',
								layout: 'row',
								addLabel: 'Adicionar telefone',
								fields: [
									{
										type: 'maskedInput',
										key: 'prospectTelefoneFull',
										elementAttributes: {
											'flex': '50'
										},
										ngModelElAttrs: clientPhoneNumbersPermission.attrs,
										templateOptions: {
											required: true,
											type: 'tel',
											placeholder: 'Telefone com DDD',
											mask: '(99) 9?9999-9999'
										},
										expressionProperties: clientPhoneNumbersPermission.expressions,
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
										type: 'input',
										key: 'prospectTelefoneRamal',
										className: 'multiinput-align-fields-row-padding',
										elementAttributes: {
											'flex': 'auto'
										},
										ngModelElAttrs: clientPhoneNumbersPermission.attrs,
										templateOptions: {
											type: 'text',
											placeholder: 'Ramal',
											maxlength: 10
										},
										expressionProperties: clientPhoneNumbersPermission.expressions,
									},
									{
										type: 'input',
										key: 'prospectTelefoneObs',
										elementAttributes: {
											'flex': 'auto'
										},
										ngModelElAttrs: clientPhoneNumbersPermission.attrs,
										templateOptions: {
											type: 'text',
											placeholder: 'Obs.',
											maxlength: 100
										},
										expressionProperties: clientPhoneNumbersPermission.expressions,
									}
								]
							}
						}
					);

				}

				// addresses
				if(permission.permissionStatus('pro_visualizar_endereco') === true){

					var clientAddressesPermission = gernerateClientContactMultiInputFieldsAttrs({
						permissionStatus: permission.permissionStatus('pro_excluir_endereco'),
						fieldId: 'prospectEnderecoIdGuid',
						tooltip: {
							disabled: 'Desculpe, a edição de endereços do cliente está '
								+ 'temporariamente desativado',
							forbidden: 'Você, não tem permissão para editar os endereços do cliente'
						}
					});

					clientAddressesPermission;

					$scope.fieldsContact.push(
						{
							type: 'multiinput',
							key: 'prospectEnderecos',
							model: $scope.modelContact.fields,
							defaultValue: $scope.client.fields.prospectEnderecos,
							elementAttributes: {
								'layout': 'column'
							},
							templateOptions: {
								label: 'Endereços:'
							},
							data: {
								keepOnRemoveWhenContainsKey: 'prospectEnderecoIdGuid',
								layout: 'column',
								addLabel: 'Adicionar endereço',
								fields: [
									{
										type: 'address',
										className: 'no-padding-bottom',
										// ngModelElAttrs: clientAddressesPermission.attrs,
										templateOptions: {
											required: true
										},
										expressionProperties: clientAddressesPermission.expressions,
										data: {
											properties: {
												zipcode: 'prospectEnderecoCEP',
												street: 'prospectEnderecoLogradouro',
												number: 'prospectEnderecoNumero',
												neighborhoodId: 'prospectEnderecoBairroId',
												neighborhood: 'prospectEnderecoBairroNome',
												state: 'prospectEnderecoUF',
												cityId: 'prospectEnderecoCidadeId',
												city: 'prospectEnderecoCidadeNome',
												street2: 'prospectEnderecoComplemento',
												info: 'prospectEnderecoObs'
											}
										}
									}
								]
							}
						}
					);

				}

			};

			initAndUpdateClient();

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

			var submitSuccess = function(response){
				initAndUpdateClient(response.data);
				$scope.submitStatus.success = true;
				postExecute();
			};

			$scope.cancel = function(fields, model){

				anaproFormlyFactory.resetModel(
					fields,
					model
				);

			};

			$scope.submit = function(form, fields, model){

				if(form.$valid && !$scope.loading){

					$scope.loading = true;

					clientsService.patchItem({
						item: $scope.client,
						data: model,
						toastrMessages: {
							serverError: {
								title: 'Desculpe, estamos com dificuldades para atualizar os dados do cliente.',
								message: 'Tente novamente mais tarde, obrigado.'
							}
						},
						success: submitSuccess,
						error: submitError
					});

				}

			};

			$scope.hasBlock = function(block){
				return $scope.blocks.indexOf(block) >= 0;
			};

			$scope.isExpandedBlock = function(block){
				return $scope.expandedBlocks.indexOf(block) >= 0;
			};

			$scope.isTitleBlockHidden = function(block){
				return $scope.hideTitleBlocks.indexOf(block) >= 0;
			};

		}
	)

	.directive('cardClientProfile', function(){
		return {
			restrict: 'E',
			scope: {
				title: '@',
				client: '=',
				blocks: '@',
				expandedBlocks: '@',
				hideTitleBlocks: '@',
			},
			controller: 'CardClientProfileController',
			templateUrl: 'card-client-profile/card-client-profile.html'
		};
	})

	;

})();
