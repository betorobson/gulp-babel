
'use strict';

(function(){

	angular.module('directives.list-filter',[])

	.controller(
		'ListFilterController',

		function(
			$scope,
			$routeParams,
			listFactory,
			destroyFactory
		){

			$scope.listObj = $scope.$parent.listObj;

			if(!$scope.listObj.delegate
				|| !$scope.listObj.delegate.get){
				console.error(
					'You must to implement the \'listObj.delegate.get\' on current $scope'
				);
			}

			var setFilters = function(){
				$scope.listObj.delegate.get({
					params: {
						q: $scope.listFilter.model.q,
						filters: $scope.listFilter.model.filters
					},
					success: function(){
						if($scope.listFilter.modalDelegate.hide){
							$scope.listFilter.modalDelegate.hide();
						}
					}
				});
			};

			var formQSubmit = function(form){

				if(form.$invalid){
					return;
				}

				$scope.listObj.delegate.get({
					params: {
						q: $scope.listFilter.model.q
					}
				});

			};

			var model = {
				q: '',
				filters: {}
			};

			model = listFactory.getAttrsFromRouteParams($routeParams).params || model;

			$scope.listFilter = {
				model: model,
				formQSubmit: formQSubmit,
				setFilters: setFilters,
				modalDelegate: {}
			};

			destroyFactory({
				scope: $scope,
				objects: [
					$scope.listFilter
				]
			});

		}
	)

	.directive('listFilter', function(){
		return {
			restrict: 'E',
			transclude: true,
			scope: {},
			templateUrl: 'list-filter/list-filter.html',
			controller: 'ListFilterController'
		};
	});

})();
