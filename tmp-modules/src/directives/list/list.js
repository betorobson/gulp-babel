
'use strict';

(function(){

	angular.module('directives.list',[
		'directives.list.factory'
	])

	.controller(
		'ListController',

		function(
			$scope
		){

			$scope.listObj = $scope.$parent.listObj;

			$scope.listObj.listType = 'table';

			$scope.listObj.setListType = function(type){
				$scope.listObj.listType = type;
			};

			$scope.listObj.selected = {
				items: [],
				toggle: function(item){
					if(this.has(item)){
						this.items.splice(this.items.indexOf(item),1);
					}else{
						this.items.push(item);
					}
				},
				has: function(item){
					return this.items.indexOf(item) >= 0;
				}
			};

		}
	)

	.directive('list', function(){
		return {
			restrict: 'E',
			templateUrl: 'list/list.html',
			controller: 'ListController',
			scope: {},
			transclude: {
				table: '?listTypeTable',
				column: '?listTypeColumn'
			}
		};
	})

	.controller(
		'ListColumnController',

		function(
			$scope
		){
			$scope.listObj = $scope.$parent.listObj;
		}
	)

	.directive('listColumn', function(){
		return {
			restrict: 'E',
			templateUrl: 'list/list-column.html',
			scope: {},
			controller: 'ListColumnController',
			transclude: true
		};
	})

	.controller(
		'ListTableController',

		function(
			$scope,
			$timeout
		){
			$scope.listObj = $scope.$parent.listObj;
			//$scope.hasPages = $scope.listObj.data.links.totalPages > 1;

			$scope.listObj.removeItem = function(item){
				item.slideOutEffect = true;
				$timeout(function(){
					item.removed = true;
				}, 500);
			};
		}
	)

	.directive('listTable', function(){
		return {
			restrict: 'E',
			templateUrl: 'list/list-table.html',
			scope: {},
			controller: 'ListTableController',
			transclude: true
		};
	})

	.controller(
		'ListPaginationController',

		function(
			$rootScope,
			$scope
		){

			$scope.listObj = $scope.$parent.listObj;

			var limitItems = $rootScope.mainController.device == 'desktop' ? 10 : 5;
			var limitItemsHalf = Math.floor(limitItems / 2);
			var fromItem = 2;
			var toItem = limitItems + 1;

			if($scope.listObj.data.links.totalPages <= limitItems){
				fromItem = 1;
				toItem = $scope.listObj.data.links.totalPages;
			}else if($scope.listObj.data.links.currentPage == $scope.listObj.data.links.totalPages - 1){
				toItem = $scope.listObj.data.links.totalPages;
				fromItem = toItem - limitItems;
			}else if($scope.listObj.data.links.currentPage > limitItemsHalf){
				fromItem = $scope.listObj.data.links.currentPage - limitItemsHalf;
				toItem = fromItem + limitItems;
			}

			if(toItem > $scope.listObj.data.links.totalPages){
				var diff = toItem - $scope.listObj.data.links.totalPages;
				fromItem -= diff;
				toItem = $scope.listObj.data.links.totalPages;
			}

			$scope.limits = {
				limitItems: limitItems,
				fromItem: fromItem,
				toItem: toItem
			};

			var hashLinks = {};

			$scope.linkNavigation = function(link){

				if(hashLinks[link]){
					return hashLinks[link];
				}

				hashLinks[link] = $scope.listObj.delegate.gerFilterHashLink({
					link: link
				});

				return hashLinks[link];

			};

			$scope.linkNavigationFromNumber = function(page){
				return $scope.linkNavigation(
					$scope.listObj.data.links.first.replace(/(page=)./,'$1' + page)
				);
			};

			$scope.getPaginationArray = function(){
				var links = $scope.listObj.data.links;

				if(links && links.totalPages){
					return new Array(parseInt($scope.listObj.data.links.totalPages));
				}

				return new Array(0);
			};

		}
	)

	.directive('listPagination', function(){
		return {
			restrict: 'E',
			templateUrl: 'list/list-pagination.html',
			scope: {},
			controller: 'ListPaginationController'
		};
	})

	;

})();
