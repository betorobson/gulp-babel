
'use strict';

(function(){

	angular.module('views.calendar.link-integration', [
		'views.calendar.link-integration-factory'
	])

	.controller(
		'linkIntegrationController',
		function(
			$scope,
			schedulesService
		){
			var item;

			$scope.schedulesManual = false;
			$scope.loading = false;

			$scope.integrationManual = function(){
				$scope.schedulesManual = true;
			};

			var buttons = {

				default: {
					icon: 'calendar'
				},
				integrationSchedulesApple: {
					label: 'Apple',
					icon: 'apple'
				},
				integrationSchedulesGoogleOnline: {
					label: 'Google',
					icon: 'google',
				},
				integrationSchedulesManual: {
					label: 'Manualmente',
					icon: 'calendar-download',
				},
				integrationSchedulesOutlook: {
					label: 'Outlook',
					icon: 'outlook',
				},
				integrationSchedulesOutlookOnline: {
					label: 'Outlook',
					small: '(online)',
					icon: 'outlook',
				}
			};

			$scope.getButtons = function(key){
				return buttons[key] || buttons.default;
			};

			var get = function(){

				$scope.loading = true;

				schedulesService.get(
					{
						success:  success,
						error: error
					}
				);

			};

			$scope.list;
			$scope.listKeys;

			var setList = function(){
				$scope.listKeys = Object.keys(item.data[0].fields.integrationSchedules);
				$scope.list = item.data[0].fields.integrationSchedules;
			};

			var success = function(response){
				item = response.data;
				setList();
				$scope.loading = false;
			};

			var error = function(response){
				$scope.error = response.config.errorMessage;
			};

			get();

		}
	)

	.directive('linkIntegration', function(){
		return {
			restrict: 'E',

			scope: {},
			controller: 'linkIntegrationController',
			templateUrl: 'calendar/directives/link-integration/link-integration.html'
		};

	})

	;

})();
