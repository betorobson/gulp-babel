
'use strict';

(function(){

	angular.module('directives.card-actions-call',[])

	.controller(
		'CardActionsCallController',

		function(
			$rootScope,
			$scope,
			$timeout,
			$filter,
			$element,
			followupService,
			followupSubTypes,
			cardActionFactory
		){

			$scope.cardActionsPhoneSelectDelegate = {
				phoneSelected: function(phoneNumber){
					$scope.delegate.data.phoneClient = phoneNumber;
					registerCall();
					makeCall();
					setFields();

				}
			};

			$scope.$parent.cardActionsTabSelectedDelegate['call-activity'] = function(){

				if($scope.$parent.modalDelegate){
					$scope.$parent.modalDelegate.setTitle($scope.$parent.tabSelected);
				}

				cardActionFactory.getSubTypeId({
					interacaoTipoSub: followupSubTypes.call,
					success: function(id){

						$scope.model.fields.interacaoAtividade.interacaoTipoSubIdGuid = id;

						if($scope.delegate.data.phones.length == 1){
							registerCall();
							makeCall();
							setFields();
						}

					}
				});

				if($scope.delegate.data.phones.length > 1){
					$scope.delegate.data.phoneClient = null;
				}

			};

			var registerCall = function(){
				if($rootScope.mainController.device == 'mobile'){
					var model = getModelBeforeSubmit();

					model.fields.interacaoAtividade.interacaoTexto = 'Tentativa de ligação';

					var attrs = {
						data: model,
						success: function(response){
							delegate(response);
						}
					};

					attrs.resource = $scope.$parent.resource || null;
					followupService.post(attrs);
				}

				$scope.model.fields.interacaoAtividade.interacaoTexto =
						'Entrei em contato através do telefone '
						+ $filter('mask')(
							$scope.delegate.data.phoneClient,
							'tel'
						)
						+ ' e foi tratado';

			};

			$scope.phoneSelectedTitle = function(){
				if($rootScope.mainController.device == 'desktop') {
					return 'Clique no número do telefone e já registre a ligação';
				}else{
					return 'Escolha o telefone para ligar.';
				}
			};

			var makeCall = function(){
				if($rootScope.mainController.device == 'mobile'){
					document.location = cardActionFactory
						.getContactLinks($scope.delegate.data)
						.phone;
					console.log(cardActionFactory
							.getContactLinks($scope.delegate.data)
							.phone);
				}
			};

			$scope.loading = false;
			$scope.submitStatus = {
				success: false,
				error: false
			};
			$scope.form = null;
			$scope.formOptions = {};

			$scope.model = {
				fields: {
					interacaoAtividade: {},
				}
			};

			$scope.fields = [];

			var setFields = function(){
				$scope.fields = [
					{
						key: 'interacaoDtInteracao',
						type: 'anaproDateTime',
						model: $scope.model.fields.interacaoAtividade,
						defaultValue: $filter('date')(
							new Date(),
							'yyyy-MM-ddTHH:mm:00'
						),
						templateOptions: {
							label: 'Data da atividade',
							required: true
						}
					},
					{
						type: 'textarea',
						model: $scope.model.fields.interacaoAtividade,
						key: 'interacaoTexto',
						templateOptions: {
							label: 'Registre aqui o que foi tratado na ligação com o número '
							+ $filter('mask')(
								$scope.delegate.data.phoneClient,
								'tel'
							),
							required: true,
							rows: 10,
							hint: 'Dica: Adicione Hashtags (#) para se organizar melhor!'
						}
					}
				];

			};

			var postExecute = function(response){

				$timeout(function(){

					$scope.submitStatus.success = false;
					$scope.submitStatus.error = false;
					$scope.loading = false;

					if($scope.$parent.modalDelegate){
						$scope.$parent.modalDelegate.hide();
					}

					delegate(response);

				},500);
			};

			var delegate = function(response){
				if($scope.delegate && response){
					$scope.delegate.postItem(response.data);
				}
			};

			var getModelBeforeSubmit = function(){
				return angular.copy($scope.model);
			};

			$scope.cancel = function(){
				if($scope.$parent.modalDelegate){
					$scope.$parent.modalDelegate.hide();
				}
			};

			$scope.submit = function(form){

				$scope.form = form;

				if($scope.form.$valid && !$scope.loading){

					$scope.loading = true;
					var model = getModelBeforeSubmit();

					var attrs = {
						data: model,
						toastrMessages: getToastrMessages(),
						success: function(response){

							$scope.submitStatus.success = true;
							postExecute(response);
							$scope.formOptions.resetModel();
						},
						error: function(){
							$scope.submitStatus.error = true;
							postExecute();
						}
					};

					attrs.resource = $scope.$parent.resource || null;
					followupService.post(attrs);

				}
			};

			var getToastrMessages = function(){

				return {
					success: {
						title: 'Mensagem registrada com sucesso.'
					},
					serverError: {
						title: 'Desculpe, estamos com dificuldades para registrar sua mensagem',
						message: 'Tente novamente mais tarde, obrigado.'
					}
				};

			};

		}
	)

	.directive('cardActionsCall', function(){

		return {
			restrict: 'E',
			templateUrl: 'card-actions/card-actions-call.html',
			controller: 'CardActionsCallController',
			scope: {
				active: '=?',
				delegate: '=?'
			},
			replace: true
		};

	});

})();
