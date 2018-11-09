
'use strict';

(function(){

	angular.module('anapro.formly.datetime-input', [])

	.run(function(formlyConfig, mainController, $filter, anaproFormlyFactory){

		var device = mainController.getDevice(),
			parseDate = anaproFormlyFactory.parseDate,
			formatterDate = anaproFormlyFactory.formatterDate;

		var controller = function($scope, $timeout){

			if(device == 'desktop'){
				$scope.dateTimeForm = null;
				$scope.dateTimeFields = [
					{
						key: $scope.options.key,
						type: 'anaproDate',
						defaultValue: anaproFormlyFactory.getDateFromString($scope.options.defaultValue),
						templateOptions: {
							icon: 'calendar',
							dateFormat: $scope.options.templateOptions.dateFormat,
							noErrorSpace: true
						}
					},

					{
						elementAttributes: {
							'flex': '5'
						},
						template: '<div></div>'
					},

					{
						key: $scope.options.key,
						type: 'anaproTime',
						defaultValue: anaproFormlyFactory.getDateFromString($scope.options.defaultValue),
						templateOptions: {
							icon: 'clock',
							dateFormat: $scope.options.templateOptions.dateFormat,
							noErrorSpace: true
						}
					}
				];
			}

			$scope.options.resetModel = function(){

				if($scope.options.templateOptions.type == 'datetime-local'){
					$scope.options.parsers = [parseDate];
					$scope.options.formatters = [formatterDate];
					$scope.model[$scope.options.key] = null;
				}

				$timeout(function(){
					$scope.model[$scope.options.key] =
						$filter('date')(
							anaproFormlyFactory.getDateFromString($scope.options.defaultValue),
							$scope.options.templateOptions.dateFormat
						);
				},0);

			};

			$scope.options.resetModel();

		};

		var field = {
			name: 'anaproDateTime',
			extends: 'input',
			controller: controller,
			defaultOptions: {
				templateOptions: {
					dateFormat: 'yyyy-MM-ddTHH:mm:ss'
				},
				validators: {
					max: {
						expression: function(viewValue, modelValue, scope){
							if(!scope.options.templateOptions.max || !modelValue){
								return true;
							}

							var max = anaproFormlyFactory.getDateFromString(scope.options.templateOptions.max);
							var value = anaproFormlyFactory.getDateFromString(modelValue);

							return value.getTime() <= max.getTime();
						}
					},
					min: {
						expression: function(viewValue, modelValue, scope){
							if(!scope.options.templateOptions.min || !modelValue){
								return true;
							}

							var min = anaproFormlyFactory.getDateFromString(scope.options.templateOptions.min);
							var value = anaproFormlyFactory.getDateFromString(modelValue);

							return value.getTime() >= min.getTime();
						}
					}
				},
				validation: {
					messages: {
						max: function(newValue, oldValue, scope){
							var maxDate = anaproFormlyFactory.getDateFromString(scope.to.max);

							return scope.to.label
								+ ' precisa ser menor ou igual que '
								+ $filter('date')(
									maxDate,
									'dd/MM/yy HH:mm'
								);
						},
						min: function(newValue, oldValue, scope){
							var minDate = anaproFormlyFactory.getDateFromString(scope.to.min);

							return scope.to.label
								+ ' precisa ser maior ou igual que '
								+ $filter('date')(
									minDate,
									'dd/MM/yy HH:mm'
								);
						}
					}
				}
			}
		};

		if(device == 'desktop'){
			field.templateUrl = 'formly-templates/datetime-input.html';
		}else{
			field.defaultOptions.templateOptions.type = 'datetime-local';
		}

		formlyConfig.setType(field);

	})

	;

})();
