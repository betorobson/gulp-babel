
'use strict';

(function(){

	angular.module('views.transaction')

	.factory(
		'stageFormFactory',
		function(
			$compile,
			permission,
			toastrFactory
		){
			return {
				setTransactionStage: function(attrs){

					var scope = attrs.scope.$new();
					var element = $(attrs.element).closest('[stage-form]');

					scope.stageFormScope = attrs;

					angular.element(element).append(
						$compile(
							'<view-transaction-stage-form stage-form-scope="stageFormScope">'
							+ '</view-transaction-stage-form>'
						)(scope)
					);

				},

				checkPermissionsToastr: function(){
					var permissionSetStage = permission.checkPermissions('atd_expectativa');

					if(permissionSetStage === true){
						return true;
					}

					if(permissionSetStage === false){
						toastrFactory.warn({
							message: 'Você não tem permissão para alterar a fase do cliente'
						});
					}else if(permissionSetStage == 'disabled'){
						toastrFactory.error({
							message: 'Desculpe, alterar a fase do cliente está temporariamente desabilitado.'
						});
					}

					return false;
				}
			};
		}
	)

	.controller(
		'viewTransactionStageFormController',
		function(
			$scope,
			$timeout,
			$element,
			transactionsService,
			anaproFormlyFactory
		){

			var stageItem = {};

			var delegate = $scope.stageFormScope.delegate;

			$scope.submitStatus = {
				success: false,
				error: false
			};

			$scope.formFields = {
				fields: [],
				model: {},
				form: {},
				options: {}
			};

			$scope.cancel = function(){

				$scope.$destroy();
				$element.remove();

				if($scope.formFields.options.resetModel){
					$scope.formFields.options.resetModel();
				}

				if(delegate.onFormDestroy){
					delegate.onFormDestroy();
				}

			};

			var showStageFields = function(stage){

				if(delegate.onFormShowUp){
					delegate.onFormShowUp();
				}

				anaproFormlyFactory.createFormlyFieldsFromAPI(
					angular.copy(stage.fields.pipelineStage.pipelineStageFields),
					$scope.formFields.fields
				);

			};

			var forceDownloadStage = function(){

				transactionsService.getPipelines({
					id: $scope.stageFormScope.transactionItem.id,
					stageId: $scope.stageFormScope.stageItem.id,
					success: function(response){
						$scope.stageFormScope.stageItem = response.data;
						$scope.stageFormScope.forceDownloadStage = false;
						setTransactionStage();
					}
				});

			};

			var setTransactionStage = function(){

				stageItem = $scope.stageFormScope.stageItem;

				// workaround
				if(!stageItem.id){
					stageItem.id = stageItem.fields.pipelineStage.pipelineStageIdGuid;
				}

				if($scope.stageFormScope.forceDownloadStage){
					forceDownloadStage();
				}else if(stageItem.fields.pipelineStage.pipelineStageFields){
					showStageFields(stageItem);
				}else{
					postActionPipelineStage();
				}

			};

			$scope.submit = function(){
				if($scope.formFields.form.$valid && !$scope.loading){
					postActionPipelineStage();
				}
			};

			var postActionPipelineStage = function(){

				if(delegate.onInitSetStage){
					delegate.onInitSetStage();
				}

				$scope.loading = true;

				var data = {
					fields: {
						pipelineStage: {
							pipelineStageIdGuid: stageItem.id,
							pipelineStageFields: $scope.formFields.model
						}
					}
				};

				transactionsService.actions({
					item: $scope.stageFormScope.transactionItem,
					action: 'pipelineStage',
					data: data,
					toastrMessages: {
						success: {
							title: 'Fase alterada com sucesso.'
						},
						serverError: {
							title: 'Desculpe, estamos com dificuldades para atualizar a fase do negócio.',
							message: 'Tente novamente mais tarde, obrigado.'
						}
					},
					success: function(response){

						if(delegate.success){
							delegate.success(response);
						}

						$scope.cancel();

					},
					error: function(response){

						if(delegate.error){
							delegate.error(response);
						}

						$scope.cancel();

					}
				});

			};

			setTransactionStage();

		}
	)

	.directive('viewTransactionStageForm', function(){
		return {
			restrict: 'E',
			scope: {
				stageFormScope: '='
			},
			controller: 'viewTransactionStageFormController',
			templateUrl: 'transaction/directives/stage/stage-form.html'
		};
	})

	;

})();
