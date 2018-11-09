
'use strict';

(function(){

	angular.module('directives.card-actions-whatsapp',[])

	.controller(
		'CardActionsWhatsappController',

		function(
			$rootScope,
			$scope,
			$timeout,
			$filter,
			$element,
			followupService,
			followupSubTypes,
			cardActionFactory,
			mainController
		){

			$scope.cardActionsPhoneSelectDelegate = {
				phoneSelected: function(phoneNumber){
					$scope.delegate.data.phoneClient = phoneNumber;
				}
			};

			if($scope.$parent.cardActionsTabSelectedDelegate){

				$scope.$parent.cardActionsTabSelectedDelegate['whatsapp'] = function(){

					if($scope.$parent.modalDelegate){
						$scope.$parent.modalDelegate.setTitle($scope.$parent.tabSelected);
					}

					cardActionFactory.getSubTypeId({
						interacaoTipoSub: followupSubTypes.whatsapp,
						success: function(id){
							$scope.model.fields.interacaoAtividade.interacaoTipoSubIdGuid = id;
						}
					});

					if($scope.delegate.data.phones.length > 1){
						$scope.delegate.data.phoneClient = null;
					}

				};

			}

			var getMessageUrl = function(){
				return cardActionFactory
				.getContactLinks($scope.delegate.data)
				.whatsapp
				+ '?text='
				+ encodeURIComponent(
					$scope.model.fields.interacaoAtividade.interacaoTexto
				);
			};

			var sendMessage = function(newWindow){
				if(newWindow){
					window.open(getMessageUrl(), 'AnaproAppWhatsapp');
				}else{
					document.location = getMessageUrl();
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
					interacaoAtividade: {}
				}
			};

			$scope.fields = [
				{
					type: 'textarea',
					model: $scope.model.fields.interacaoAtividade,
					key: 'interacaoTexto',
					defaultValue: 'Olá ' + $scope.delegate.data.prospectNome,
					templateOptions: {
						label: 'Whatsapp',
						required: true,
						placeholder: 'Escreva aqui a mensagem para enviar pelo Whatsapp',
						rows: 10
					}
				}
			];

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

					if(mainController.getDevice() == 'desktop'){
						sendMessage(true);
					}

					$scope.loading = true;
					var model = getModelBeforeSubmit();

					var attrs = {
						data: model,
						toastrMessages: getToastrMessages(),
						success: function(response){

							$scope.submitStatus.success = true;
							postExecute(response);

							if(mainController.getDevice() == 'mobile'){
								sendMessage();
							}

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

	.directive('cardActionsWhatsapp', function(){

		return {
			restrict: 'E',
			templateUrl: 'card-actions/card-actions-whatsapp.html',
			controller: 'CardActionsWhatsappController',
			scope: {
				active: '=?',
				delegate: '=?'
			},
			replace: true
		};

	});

})();
