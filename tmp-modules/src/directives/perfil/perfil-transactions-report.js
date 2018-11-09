
'use strict';

(function(){

	angular.module('directives.perfil-transactions-report', [
		'services.transactions-report'
	])

	.controller(
		'PerfilTransactionsReportController',

		function(
			$scope,
			path,
			transactionsService,
			transactionsReportService
		){

			$scope.currentDate = new Date();
			$scope.loading = true;
			$scope.error = false;
			$scope.data = {};

			$scope.getLinkFilter = function(item){

				var filterJSON = transactionsService.getJSONFilterFromHref(item.href);

				if(filterJSON){
					return transactionsService.gerFilterHashLink(
						path.getPath('transactions'),
						{
							params:{
								q: '',
								filters: filterJSON
							}
						}
					);
				}else{
					return path.getPath('transactions');
				}
			};

			var success = function(response){
				$scope.data = response.data;
				$scope.loading = false;
			};

			var error = function(){
				$scope.data = {};
				$scope.loading = false;
				$scope.error = true;
			};

			var getData = function(){

				$scope.loading = true;
				$scope.error = false;

				transactionsReportService.get({
					success: success,
					error: error
				});

			};

			getData();

		}
	)

	.directive('perfilTransactionsReport', function(){
		return {
			restrict: 'E',
			scope: {

			},
			templateUrl: 'perfil/perfil-transactions-report.html',
			controller: 'PerfilTransactionsReportController'
		};
	});

})();
