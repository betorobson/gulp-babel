
'use strict';

(function(){

	angular.module('views.user-profile',[])

	.controller(
		'ViewUserProfileController',

		function(
			$scope,
			$filter,
			$timeout,
			path,
			usersService
		){

			path.setCurrent('user-profile');

			$scope.breadcrumbs = [{
				label: path.get('user-profile').label,
				path: false
			}];

			$scope.viewTitle = {
				title: 'Dados',
				subtitle: 'pessoais'
			};

			var data = {};

			$scope.urlAvatar;

			$scope.formOptions = {};
			$scope.model = {};
			$scope.fields = [];

			$scope.error = false;
			$scope.loading = true;
			$scope.submitStatus = {
				success: false,
				error: false
			};

			var setFields = function(){

				var fieldsLayout = 'column';

				$scope.fields = [

					{
						type: 'input',
						key: 'usuarioNome',
						defaultValue: data.fields.usuario.usuarioNome,
						elementAttributes: {
							'layout': fieldsLayout
						},
						templateOptions: {
							label: 'Nome completo:',
							type: 'text',
							required: true,
							minlength: 6,
							maxlength: 100
						}
					},

					{
						type: 'input',
						key: 'usuarioApelido',
						defaultValue: data.fields.usuario.usuarioApelido,
						elementAttributes: {
							'layout': fieldsLayout
						},
						templateOptions: {
							label: 'Apelido:',
							type: 'text',
							maxlength: 100
						}
					},

					{
						type: 'anaproEmail',
						key: 'usuarioEmail',
						defaultValue: data.fields.usuario.usuarioEmail,
						elementAttributes: {
							'layout': fieldsLayout
						},
						templateOptions: {
							label: 'Email:',
							placeholder: 'exemplo@exemplo.com',
							required: true
						}
					},

					{
						type: 'anaproSelectButtons',
						key: 'usuarioSexo',
						defaultValue: data.fields.usuario.usuarioSexo,
						elementAttributes: {
							'layout': fieldsLayout
						},
						templateOptions: {
							label: 'Sexo:',
							options: [
								{
									value: 'M',
									name: 'Masculino'
								},
								{
									value: 'F',
									name: 'Feminino'
								}
							]
						}
					},

					{
						type: 'maskedInput',
						key: 'usuarioCPF',
						className: 'fieldCPF',
						defaultValue: data.fields.usuario.usuarioCPF,
						elementAttributes: {
							'layout': fieldsLayout
						},
						templateOptions: {
							label: 'CPF:',
							type: 'tel',
							required: true,
							cpf: true
						}
					},

					{
						type: 'anaproDate',
						key: 'usuarioDtNascimento',
						defaultValue: data.fields.usuario.usuarioDtNascimento,
						className: 'input-nogrow',
						elementAttributes: {
							'layout': fieldsLayout
						},
						templateOptions: {
							required: true,
							label: 'Data de nascimento:',
							placeholder: 'dd/mm/aaaa',
							max: $filter('date')(
								new Date(),
								'yyyy-MM-ddT00:00:00'
							),
							dateFormat: 'yyyy-MM-ddT00:00:00',
							icon: 'calendar'
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
						type: 'multiinput',
						key: 'usuarioTelefones',
						className: 'user-profile-phones-field',
						defaultValue: data.fields.usuario.usuarioTelefones,
						elementAttributes: {
							'layout': fieldsLayout
						},
						data: {
							isArrayOfValues: true,
							addLabel: '+',
							fields: [
								{
									type: 'maskedInput',
									elementAttributes: {
										'flex': ''
									},
									templateOptions: {
										required: true,
										type: 'tel',
										mask: '(99) 9?9999-9999'
									}
								}
							]
						},
						templateOptions: {
							label: 'Telefones:'
						}
					},

					{
						className: 'dividerPassword',
						template: '<hr/>'
					},

					{
						type: 'input',
						key: 'usuarioSenhaAtual',
						className: 'fieldPassword',
						elementAttributes: {
							'layout': fieldsLayout
						},
						templateOptions: {
							type: 'password',
							label: 'Senha atual:',
							hint: 'Deixe em branco caso não queira alterar a senha'
						},
						expressionProperties: {
							'templateOptions.required': '!!model.usuarioSenhaNova'
						}
					},

					{
						type: 'input',
						key: 'usuarioSenhaNova',
						className: 'fieldPassword',
						elementAttributes: {
							'layout': fieldsLayout
						},
						expressionProperties: {
							'templateOptions.required': '!!model.usuarioSenhaAtual'
						},
						templateOptions: {
							type: 'password',
							label: 'Nova senha:',
							minlength: 8,
							maxlength: 15,
							hint: 'A senha deve conter entre 8 e 15 caracteres.'
						},
						validators: {
							passwordConfirm: {
								expression: function(viewValue, modelValue){

									if(!modelValue){
										var passwordConfirmField = $scope.fields[$scope.fields.length-1];
										passwordConfirmField.value('');
										passwordConfirmField.resetModel();
									}

									return true;
								}
							}
						}
					},

					{
						type: 'input',
						key: 'usuarioSenhaNovaConfirmacao',
						className: 'fieldPassword',
						model: {},
						elementAttributes: {
							'layout': fieldsLayout
						},
						templateOptions: {
							type: 'password',
							label: 'Confirmar nova senha:',
							hint: 'Digite novamente sua nova senha'
						},
						expressionProperties: {
							'templateOptions.required': function(){
								if($scope.model.usuarioSenhaNova){
									return true;
								}else{
									return false;
								}
							},
							'templateOptions.disabled': function(){
								if($scope.model.usuarioSenhaNova){
									return '';
								}else{
									return 'true';
								}
							}
						},
						validators: {
							passwordConfirm: {
								expression: function(viewValue, modelValue){
									return modelValue == $scope.model.usuarioSenhaNova;
								},
								message: '"A confirmação de senha não confere."'
							}
						}
					}

				];
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

			var success = function(response){

				data = response.data;

				setFields();
				setUrlAvatar();

				$scope.loading = false;

			};

			var setUrlAvatar = function(){
				$scope.urlAvatar = data.fields.usuario.usuarioUrlImagem;
			};

			var submitSuccess = function(response){

				$scope.submitStatus.success = true;

				data = response.data;

				usersService.updateCurrentProfile(data.fields.usuario);

				$scope.model = {};

				setFields();
				setUrlAvatar();

				postExecute();

			};

			$scope.submit = function(form){

				if(form.$valid && !$scope.loading){

					$scope.loading = true;

					usersService.patchMyUser({
						data: {
							fields: {
								usuario: $scope.model
							}
						},
						success: submitSuccess,
						error: submitError
					});

				}

			};

			$scope.cancel = function(){

				$scope.formOptions.resetModel();

			};

			var getUserProfileError = function(response){
				$scope.error = response.config.errorMessage;
			};

			$scope.$on(
				'$viewContentLoaded',
				function(){
					usersService.getMyUser({
						success: success,
						error: getUserProfileError,
						toastrMessages: {
							serverError: {
								title: 'Os seus dados estão indisponíveis.',
								message: 'Por favor, tente novamente mais tarde.'
							}
						}
					});
				}
			);

		}
	)

	;

})();
