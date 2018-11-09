
'use strict';

(function(){

	angular.module('views.calendar.list-filter', [])

	.controller(

		'viewCalendarListFilterController',

		function(
			$scope,
			anaproFormlyFactory,
			linkIntegrationFactory,
			mainController
		){

			$scope.listFilter = $scope.$parent.$parent.listFilter;
			$scope.listObj = $scope.$parent.listObj;
			$scope.fields = [];

			var filterList = function(){
				return $scope.listObj.data.filters.filter(function(item){
					return !/dateEnd/.test(item.field);
				});
			};

			anaproFormlyFactory.createFormlyFieldsFromAPI(
				filterList(),
				$scope.fields,
				{
					merge: {
						dateStart: {
							className: 'field-month layout-reverse',
							type: 'anaproDate',
							templateOptions: {
								label: 'Escolha o mês',
								dateFormat: 'yyyy-MM-01T00:00:00',
								placeholder: 'mm/aaaa',
								icon: 'calendar',
								type: 'month',
								noErrorSpace: true,
								datePickerOnHide: 'to.onHide',
								onHide: function(){
									setFilters();
								}
							},
							elementAttributes:{
								layout: 'row'
							},
						},
						followupScheduleOpcao:{
							className: 'followup-schedule-opcao',
							type: 'anaproSelectButtons',
							templateOptions:{
								noErrorSpace: true,
							},
							data:{
								onChange: function(){
									setFilters();
								}
							}
						},
						followupScheduleStatus:{
							className: 'followup-schedule-status',
							type: 'anaproSelectButtons',
							templateOptions:{
								noErrorSpace: true,
							},
							data: {
								onChange: function(){
									setFilters();
								}
							}

						}
					}
				}
			);

			var setFilters = function(){
				if(mainController.getDevice() == 'desktop'){
					$scope.setFilters();
				}
			};

			$scope.setFilters = function(){
				if($scope.listFilter.model.filters.dateStart){
					$scope.listFilter.model.filters.dateEnd = moment($scope.listFilter.model.filters.dateStart)
						.add(1, 'month')
						.subtract(1, 'day')
						.format('YYYY-MM-DDT23:59:59');
				}

				$scope.listFilter.setFilters();
			};

			$scope.resetFilters = function(){
				$scope.listFilter.model.filters = {};
				$scope.listFilter.setFilters();
			};

			$scope.addNewAppointment = function(){
				$scope.listObj.delegate.calendarListFilter.newAction();
			};

			$scope.showModalLinkIntegration = function(){
				linkIntegrationFactory.showModal();
			};

		}
	)

	.directive('viewCalendarListFilter', function(){
		return {
			restrict: 'E',
			scope: {},
			controller: 'viewCalendarListFilterController',
			templateUrl: 'calendar/directives/list-filter/list-filter.html'
		};
	})

	.directive('calendarListFilterForm', function(){
		return {
			restrict: 'E',
			templateUrl: 'calendar/directives/list-filter/list-filter-form.html'
		};
	})

	;

})();
