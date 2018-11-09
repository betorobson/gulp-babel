
'use strict';

(function(){

	angular.module('anapro.formly.time-input', [])

	.run(function(formlyConfig, mainController, $filter, anaproFormlyFactory){

		var device = mainController.getDevice(),
			parseDate = anaproFormlyFactory.parseDate,
			formatterDate = anaproFormlyFactory.formatterDate,
			timeISOFromString = anaproFormlyFactory.timeISOFromString;

		var controller = function($scope, $timeout){

			$scope.options.resetModel = function(){
				if($scope.options.templateOptions.type == 'time'){
					$scope.options.parsers = [parseDate];
					$scope.options.formatters = [formatterDate];
				}

				$scope.model[$scope.options.key] = null;

				var defaultValue = timeISOFromString($scope.options.defaultValue);

				if(defaultValue){
					$timeout(function(){
						$scope.model[$scope.options.key] =
							$filter('date')(
								timeISOFromString($scope.options.defaultValue),
								$scope.options.templateOptions.dateFormat
							);
					},0);
				}
			};

			$scope.options.resetModel();

			$scope.iconClick = function($event){
				$($event.target).closest('.form-input-extras').find('input').focus();
			};

		};

		formlyConfig.setType({
			name: 'anaproTime',
			extends: 'input',
			controller: controller,
			defaultOptions: {
				ngModelAttrs: {
					off: {
						value: 'autocomplete'
					},
					datePicker: {
						attribute: 'bs-timepicker'
					},
					autoclose: {
						attribute: 'autoclose'
					},
					dateFormat: {
						attribute: 'data-model-Time-Format'
					},
					dateType: {
						attribute: 'data-time-type'
					},
					min: {
						attribute: device == 'mobile' ? 'min' : 'data-min-time'
					},
					max: {
						attribute: device == 'mobile' ? 'max' : 'data-max-time'
					}
				},
				templateOptions: (function(){
					var to = {
						type: 'time'
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
				validators: (function(){

					var timeValidator = {};

					// if(device == 'mobile'){
					timeValidator = {
						max: {
							expression: function(viewValue, modelValue, scope){
								viewValue, modelValue, scope;

								if(!scope.options.templateOptions.max){
									return true;
								}

								if(!modelValue){
									return false;
								}

								var value = timeISOFromString(modelValue);
								var max = timeISOFromString(scope.options.templateOptions.max, value);

								return value.getTime() <= max.getTime();
							}
						},
						min: {
							expression: function(viewValue, modelValue, scope){
								viewValue, modelValue, scope;

								if(!scope.options.templateOptions.min){
									return true;
								}

								if(!modelValue){
									return false;
								}

								var value = timeISOFromString(modelValue);
								var min = timeISOFromString(scope.options.templateOptions.min, value);

								return value.getTime() >= min.getTime();
							}
						}
					};
					// }

					return timeValidator;
				})(),
				validation: {
					messages: {
						max: function(viewValue, modelValue, scope){
							return scope.to.label
								+ ' precisa ser menor que '
								+ scope.to.max;
						},
						min: function(viewValue, modelValue, scope){
							return scope.to.label
								+ ' precisa ser maior que '
								+ scope.to.min;
						},
						date: function(){
							return 'Horário inválido';
						},
						time: function(){
							return 'Horário inválido';
						}
					}
				}
			}
		});

	})

	;

})();
