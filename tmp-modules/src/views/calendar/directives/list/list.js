
'use strict';

(function(){

	angular.module('views.calendar.list', [
		'views.calendar.list-item'
	])

	.controller(
		'viewCalendarListController',
		function(
			$scope,
			$window,
			$rootScope,
			path
		){
			$scope.list = [];
			$scope.listFilter = $scope.$parent.$parent.listFilter;
			$scope.listObj = $scope.$parent.listObj;

			var setList = function(){
				$scope.list = $scope.listObj.data.data;
			};

			var redirToPathItem = function(item){
				$rootScope.mainController.go(path.get('transaction').withItem(item));
			};

			var goToItem = function(item, event){

				console.log(item);

				var pathItem = path.get('transaction').withItem(item.parentResources.transactions);

				if(event.ctrlKey || event.which === 2){
					$window.open(pathItem);
				}else if(event.which === 1){
					redirToPathItem(item.parentResources.transactions);
				}

			};

			$scope.clickItem = function(item, $event){

				if(
					$($event.target).closest('[preventClickItem]').length
					||
					$($event.target).closest('.expanded').length
					||
					angular.element($event.target).hasClass('dropdown-backdrop')
				){
					return;
				}

				$event.preventDefault();
				goToItem(item, $event);
			};

			var patchItem = function(oldItem, newItem){

				var index = $scope.list.indexOf(oldItem);
				$scope.list[index].fields = newItem.fields;
			};

			$scope.delegate ={
				patchItem: patchItem,
				calendarListItem: $scope.listObj.delegate.calendarListItem
			};

			setList();
		}
	)

	.directive('viewCalendarList', function(){
		return {
			restrict: 'E',

			scope: {},
			controller: 'viewCalendarListController',
			templateUrl: 'calendar/directives/list/list.html'
		};

	});

})();
