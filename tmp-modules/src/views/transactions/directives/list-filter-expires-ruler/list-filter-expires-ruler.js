
'use strict';

(function(){

	angular.module('views.transactions')

	.controller(

		'ViewTransactionsListFilterExpiresRulerController',

		function(
			$scope,
			$timeout
		){

			$scope.listFilter = $scope.$parent.$parent.listFilter;
			$scope.listObj = $scope.$parent.listObj;

			$scope.filterObj;

			var setFilterObj = function(){
				$scope.listObj.data.filters.map(function(item){

					if(item.key == 'atendimentoExpiracaoAutomaticaQtdDiasRestantes'){
						$scope.filterObj = item;
					}

				});
			};

			$timeout(setFilterObj);

			$scope.setFilter = function(item){

				$scope.listFilter.model = {
					q: $scope.listFilter.model.q,
					filters: {
						atendimentoExpiracaoAutomaticaQtdDiasRestantes: item.value
					}
				};

				$scope.listFilter.setFilters();

			};

			$scope.isActive = function(item){
				return $scope.filterObj.initialValue == item.value;
			};

		}
	)

	.directive('viewTransactionsListFilterExpiresRuler', function(){
		return {
			restrict: 'E',
			scope: {},
			controller: 'ViewTransactionsListFilterExpiresRulerController',
			templateUrl: 'transactions/directives/list-filter-expires-ruler/list-filter-expires-ruler.html'
		};
	})

	;

})();
