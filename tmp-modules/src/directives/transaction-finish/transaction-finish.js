
'use strict';

(function(){

	angular.module('directives.transaction-finish',[])

	.controller(
		'TransactionFinishController',

		function(
			$rootScope,
			$scope,
			$filter,
			anaproFormlyFactory,
			transactionsService,
			$timeout
		){

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

			var runDelegates = function(response){

				delegateHide(response.data);
				delegateUpdateItem(response.data);

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
					action: $scope.action,
					method: 'POST',
					item: $scope.item,
					data: {
						fields:  $scope.model
					},
					toastrMessages: {
						success: {
							title:
								$scope.action == 'won' 
								? 'Atendimento fechado como ganho.'
								: 'Atendimento fechado como perdido.',
						},
						serverError: {
							title:
								'Desculpe, estamos com dificuldades para fechar o atendimento.',
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
					$scope.fields
				);

				anaproFormlyFactory.setFieldsOrder(
					$scope.fields,
					[
						'atendimentoNegocioValor',
						'atendimentoNegocioComissaoValor',
					]
				);

			};

			var update = function(){
				var model = angular.copy($scope.model);

				$scope.loading = true;

				transactionsService.actions({
					action: $scope.action,
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
			
			$scope.submitLabel = function(){
				return $scope.action == 'won'
					? 'Registrar venda'
					: 'Marcar como perdido';
			};

			update();

		}
	)

	.directive('transactionFinish', function(){
		return {
			restrict: 'E',
			templateUrl: 'transaction-finish/transaction-finish.html',
			controller: 'TransactionFinishController',
			scope: {
				delegate: '=?',
				item: '=',
				action: '='
			}
		};
	})

	.factory(
		'transactionFinishFactory',

		function($modal){

			var show = function(attrs){

				attrs = attrs || {};

				$modal({
					templateUrl: 'transaction-finish/transaction-finish-modal.html',
					show: true,
					animation: 'am-fade-and-slide-top',
					controller: function($scope){
						$scope.item = attrs.item;
						$scope.action = attrs.action,
						$scope.delegate = attrs.delegate;
						$scope.title = $scope.action == 'won' 
							? 'Registrar venda'
							: 'Marcar como perdido';
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
