
'use strict';

(function(){

	angular.module('views.transaction')

	.controller(
		'viewTransactionEditAmountsController',
		function(
			$scope,
			$timeout,
			transactionsService,
			anaproFormlyFactory,
			permission
		){

			$scope.getHide = function(){
				return $scope.$parent.$hide || $scope.modalDelegate.hide || null;
			};

			$scope.loading = false;

			$scope.submitStatus = {
				success: false,
				error: false
			};

			$scope.form = {};
			$scope.formOptions = {};

			var readOnlyValue = !permission.permissionStatus('resfim_editar_atd_valor');
			var readOnlyCommission = !permission.permissionStatus('resfim_editar_atd_comissao');

			$scope.model = {
				fields: {
					atendimento: {}
				}
			};

			var resetModel = function(){
				$scope.formOptions.resetModel();
			};

			$scope.fields = [];

			if(permission.permissionStatus('resfim_mostrar_atd_valor') === true){
				$scope.fields.push({
					type: 'numberInput',
					key: 'atendimentoNegocioValor',
					defaultValue: $scope.transactionItem.fields.atendimento.atendimentoNegocioValor,
					model: readOnlyValue
						? {}
						: $scope.model.fields.atendimento,
					ngModelElAttrs: readOnlyValue
						? {disabled: 'true'}
						: {},
					templateOptions: {
						type: 'tel',
						label: 'Valor:',
						icon: 'currency',
						required: true,
						money: 2,
						minValue: 1,
						hint: readOnlyValue
							? 'Você não tem permissão para alterar o valor.'
							: 'Valor aproximado do imóvel que está sendo negociado.'
					},
					ngModelAttrs: {
						off: {
							value: 'autocomplete'
						}
					},
					elementAttributes: {
						layout: 'row'
					}
				});
			}

			if(permission.permissionStatus('resfim_mostrar_atd_comissao') === true){
				$scope.fields.push({
					type: 'numberInput',
					key: 'atendimentoNegocioComissao',
					defaultValue: $scope.transactionItem.fields.atendimento.atendimentoNegocioComissao,
					model: readOnlyCommission
						? {}
						: $scope.model.fields.atendimento,
					className: 'input-nogrow atendimentoNegocioComissao align-right',
					ngModelElAttrs: readOnlyCommission
						? {disabled: 'true'}
						: {},
					templateOptions: {
						type: 'tel',
						icon: 'percentage',
						label: 'Comissão:',
						required: true,
						decimals: 2,
						minValue: 0.01,
						maxValue: 99.99,
						hint: readOnlyCommission
							? 'Você não tem permissão para alterar a comissão.'
							: 'Percentual aproximado da comissão na venda do imóvel negociado.'
					},
					ngModelAttrs: {
						off: {
							value: 'autocomplete'
						}
					},
					elementAttributes: {
						layout: 'row'
					}
				});
			}

			var updateTransactionItem = function(data){

				$scope.transactionItem.fields.atendimento.atendimentoNegocioValor =
					data.fields.atendimento.atendimentoNegocioValor;

				$scope.transactionItem.fields.atendimento.atendimentoNegocioComissao =
					data.fields.atendimento.atendimentoNegocioComissao;

				$scope.transactionItem.extraInfo.atendimentoNegocioComissaoValor =
					data.extraInfo.atendimentoNegocioComissaoValor;

			};

			var postExecute = function(callback){
				$timeout(function(){

					$scope.submitStatus.success = false;
					$scope.submitStatus.error = false;
					$scope.loading = false;

				},500);

				if(callback){
					$timeout(function(){
						callback();
					},700);
				}
			};

			$scope.submit = function(callback){

				if($scope.form.$valid && !$scope.loading){

					$scope.loading = true;

					transactionsService.actions({
						item: $scope.transactionItem,
						action: 'amounts',
						data: $scope.model,
						toastrMessages: {
							serverError: {
								title: 'Desculpe, estamos com dificuldades para atualizar o valor e comissão do negócio.',
								message: 'Tente novamente mais tarde, obrigado.'
							}
						},
						success: function(response){
							$scope.submitStatus.success = true;
							updateTransactionItem(response.data);
							postExecute(callback);
						},
						error: function(){
							$scope.submitStatus.error = true;

							postExecute(callback);
						}
					});

				}

			};

			$scope.cancel = function(callback){

				resetModel();

				if(callback){
					callback();
				}

			};

		}
	)

	.directive('viewTransactionEditAmounts', function(){
		return {
			restrict: 'E',
			scope: {
				transactionItem: '=',
				modalDelegate: '='
			},
			controller: 'viewTransactionEditAmountsController',
			templateUrl: 'transaction/directives/edit-amounts/edit-amounts.html'
		};
	})

	;

})();
