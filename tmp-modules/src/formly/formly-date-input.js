
'use strict';

(function(){

	angular.module('anapro.formly.date-input', [])

	.run(function(formlyConfig, mainController, $filter, anaproFormlyFactory){

		var device = mainController.getDevice(),
			parseDate = anaproFormlyFactory.parseDate,
			formatterDate = anaproFormlyFactory.formatterDate;

		var controller = function($scope, $timeout){

			$scope.options.ngModelElAttrs = $scope.options.ngModelElAttrs || {};

			if(device == 'desktop' && $scope.options.templateOptions.type == 'month'){
				$scope.options.templateOptions.type = 'text';
				$scope.options.ngModelElAttrs['data-min-view'] = '1';
				$scope.options.ngModelElAttrs['data-date-format'] = 'MM/yyyy';
			}

			$scope.options.resetModel = function(){

				if(/date|month/.test($scope.options.templateOptions.type)){
					$scope.options.parsers = [parseDate];
					$scope.options.formatters = [formatterDate];
					$scope.model[$scope.options.key] = null;
				}

				$timeout(function(){
					if($scope.options.defaultValue){
						$scope.model[$scope.options.key] =
						$filter('date')(
							$scope.options.defaultValue,
							$scope.options.templateOptions.dateFormat
						);
					}
				},0);

			};

			parseDate, formatterDate;

			$scope.options.resetModel();

			$scope.iconClick = function($event){
				$($event.target).closest('.form-input-extras').find('input').focus();
			};

		};

		formlyConfig.setType({
			name: 'anaproDate',
			extends: 'input',
			controller: controller,
			defaultOptions: {
				ngModelAttrs: {
					off: {
						value: 'autocomplete'
					},
					datePicker: {
						attribute: 'bs-datepicker'
					},
					autoclose: {
						attribute: 'autoclose'
					},
					dateFormat: {
						attribute: 'data-model-Date-Format'
					},
					dateType: {
						attribute: 'data-date-type'
					},
					min: {
						attribute: 'data-min-date'
					},
					max: {
						attribute: 'data-max-date'
					},
					datePickerOnHide: {
						attribute: 'bs-on-hide'
					},
					datePickerOnBeforeHide:{
						attribute: 'bs-on-before-hide'
					},
					datePickerOnBeforeShow:{
						attribute: 'bs-on-before-show'
					}
				},
				templateOptions: (function(){

					var to = {
						type: 'date'
					};

					if(device == 'desktop'){
						to = {
							type: 'text',
							dateType: 'string',
							datePicker: true,
							autoclose: true,
						};
					}

					angular.extend(to,{dateFormat: 'yyyy-MM-ddTHH:mm:ss'});

					return to;
				})(),
				validators: {
					max: {
						expression: function(viewValue, modelValue, scope){
							viewValue, modelValue, scope;

							if(!scope.options.templateOptions.max || !modelValue){
								return true;
							}

							var max = new Date(scope.options.templateOptions.max);
							var value = new Date(modelValue);

							return value.getTime() <= max.getTime();
						}
					},
					min: {
						expression: function(viewValue, modelValue, scope){
							viewValue, modelValue, scope;

							if(!scope.options.templateOptions.min || !modelValue){
								return true;
							}

							var min = new Date(scope.options.templateOptions.min);
							var value = new Date(modelValue);

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
								+ maxDate.getDate() + '/'
								+ (maxDate.getMonth() + 1) + '/'
								+ maxDate.getFullYear();
						},
						min: function(newValue, oldValue, scope){
							var minDate = anaproFormlyFactory.getDateFromString(scope.to.min);

							return scope.to.label
								+ ' precisa ser maior ou igual que '
								+ minDate.getDate() + '/'
								+ (minDate.getMonth() + 1) + '/'
								+ minDate.getFullYear();
						}
					}
				}
			}
		});

	})

	;

})();
