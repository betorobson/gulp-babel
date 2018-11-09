
'use strict';

(function(){

	angular.module('views.transaction')

	.controller(
		'viewTransactionDetailsController',

		function(
			$scope,
			$modal,
			$timeout,
			productsService,
			transactionsService,
			utilsStatesService
		){

			$scope.loading = true;
			$scope.submitStatus = {
				success: false,
				error: false
			};
			$scope.item;
			$scope.total = 0;

			var data;

			var productsServiceGetSuccess = function(response){
				response.data.data = response.data.data || [];
				data = response.data.data;
				setProduct();
				$scope.total = data.length;
				$scope.loading = false;
			};

			var setProduct = function(){

				$scope.item = {
					fields: {
						produto: {
							produtoNome: 'Sem produto de interesse',
							produtoValorMedio: 0,
							produtoComissaoMedio: 0

						}
					}
				};

				data.map(function(item){
					if(item.id == $scope.transactionItem.fields.atendimento.atendimentoProdutoIdGuid){
						$scope.item = item;
					}
				});

			};

			var patchProductSuccess = function(response){

				$scope.submitStatus.success = true;

				transactionsService.updateItem(
					$scope.transactionItem,
					response.data
				);
				setProduct();
				postExecute();

			};

			$scope.getStateName = function(state){
				return utilsStatesService[state];
			};

			$scope.getComissao = function(item){
				return item.fields.produto.produtoValorMedio / 100 * item.fields.produto.produtoComissaoMedio;
			};

			$scope.canEditWhenNotActive = function(){
				return transactionsService.canEditWhenNotActive($scope.transactionItem);
			};

			var postExecute = function(){
				$timeout(function(){

					$scope.submitStatus.success = false;
					$scope.submitStatus.error = false;
					$scope.loading = false;

				},500);
			};

			var patchProduct = function(item){

				$scope.submitStatus.success = false;
				$scope.submitStatus.error = false;
				$scope.loading = true;

				transactionsService.patchItem({
					item: $scope.transactionItem,
					data: {
						fields: {
							atendimento: {
								atendimentoProdutoIdGuid: item.id
							}
						}
					},
					success: patchProductSuccess,
					error: function(){
						$scope.submitStatus.error = true;
						postExecute();
					}
				});
			};

			var modalDelegate = {
				patchProduct: function(item){
					patchProduct(item);
					modalDelegate.hide();
				}
			};

			$scope.showProducts = function(){

				var item = $scope.item;

				var getStateName = function(state){
					return utilsStatesService[state];
				};

				var getComissao = function(item){
					return item.fields.produto.produtoValorMedio / 100 * item.fields.produto.produtoComissaoMedio;
				};

				$modal({
					templateUrl: 'transaction/directives/details/details-modal.html',
					show: true,
					animation: 'am-fade-and-slide-top',
					controller: function($scope){

						$scope.data = data;
						$scope.patchProduct = modalDelegate.patchProduct;
						$scope.delegate = modalDelegate;
						$scope.getStateName = getStateName;
						$scope.getComissao = getComissao;

						$scope.showFilter = data.length > 20;
						$scope.model = {};

						$scope.getClassButton = function(itemProduct){
							return itemProduct == item ? 'selected' : '';
						};

						$scope.getData = function(){

							var regExp = new RegExp(
								($scope.model.filter || '')
									.toLowerCase()
									.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
									.replace(/([*()\u005B\u005D{}.?^$])/g,'\\$1'),
								'i'
							);

							if($scope.showFilter && $scope.model.filter){
								return data.filter(function(item){
									return regExp.test(
										item.fields.produto.produtoNome
										.toLowerCase()
										.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
									);
								});
							}else{
								return data;
							}

						};

					}

				});
			};

			productsService.get({
				item: $scope.transactionItem,
				success: productsServiceGetSuccess
			});

		}
	)

	.directive('viewTransactionDetails', function(){
		return {
			restrict: 'E',
			scope: {
				transactionItem: '='
			},
			controller: 'viewTransactionDetailsController',
			templateUrl: 'transaction/directives/details/details.html'
		};
	})

	.directive('viewTransactionDetailsProduct', function(){
		return {
			restrict: 'E',
			templateUrl: 'transaction/directives/details/details-product.html'
		};
	})

	;

})();
