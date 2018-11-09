
'use strict';

(function(){

	angular.module('anapro.formly.multi-input', [])

	.config(function(formlyConfigProvider){

		var controller = function($scope, $timeout){

			var isReady = false;

			$timeout(function(){
				isReady = true;
			});

			var isArrayOfValues = $scope.options.data.isArrayOfValues;

			var keepKey = $scope.options.data.keepOnRemoveWhenContainsKey;

			var defaultValue = angular.copy($scope.options.defaultValue || []);

			var originalDefaultValue = angular.copy(defaultValue);

			var multiTypesFields = $scope.options.data.fieldsByType || null;

			if(defaultValue){
				$scope.model[$scope.options.key] = angular.copy(defaultValue);
			}

			var getDefaultValue = function(){
				if(isReady){
					return defaultValue;
				}else{
					return originalDefaultValue;
				}
			};

			$scope.form.multiInputForms = {};
			$scope.options.multiInputFields = [];

			// sync child multiInputForms $submitted propertie same of its parent form
			// please, be very carefully when change this code
			var setMultiInputForms = function(form){

				var multiInputForms = form.multiInputForms[$scope.options.key];
				var forms = Object.keys(multiInputForms || {});

				forms.map(function(index){

					multiInputForms[index].$submitted = true;

					if(multiInputForms[index].multiInputForms){
						setMultiInputForms(multiInputForms[index]);
					}

				});

			};

			var submitListenerMultiinputs = function(){
				$timeout(function(){
					setMultiInputForms($scope.form);
				},0);
			};

			if(!isArrayOfValues){
				angular.element($scope.form.$$element).on(
					'submit',
					submitListenerMultiinputs
				);
			}

			// end sync submitted

			var model = $scope.model[$scope.options.key];

			$scope.modelMultiinput = model;

			// please, if you need change anything here talk to roberto@anapro before
			// This reset will delete the model and multi input forms
			// Then, it will create model based on a copy of defaultValue
			$scope.options.resetModel = function(){
				delete $scope.form.multiInputForms[$scope.options.key];
				$scope.options.fields.splice(0, $scope.options.fields.length);
				setAndCleanUPModel(originalDefaultValue);
			};

			var setAndCleanUPModel = function(value){

				defaultValue = angular.copy(value);

				// $scope.options.fields.splice(0, $scope.options.fields.length);

				model.splice(0, model.length);

				delete $scope.form.multiInputForms[$scope.options.key];

				$timeout(function(){
					defaultValue.map(function(item){
						model.push(item);
					});
				});

			};

			// old resetModel reseting by fields
			// $scope.options.resetModel = function(){

			// 	if(model.constructor == Array
			// 		&& model.length
			// 		&& $scope.options.fields.length > defaultValue.length
			// 	){
			// 		model.splice(defaultValue.length, model.length);
			// 		$scope.options.fields.splice(defaultValue.length, model.length);
			// 	}

			// 	$scope.options.fields.map(function(fields, index){
			// 		if(model[index]){
			// 			anaproFormlyFactory.resetModel(
			// 				fields,
			// 				model[index]
			// 			);
			// 		}
			// 	});

			// };

			$scope.options.fields = [];

			var setFieldsDefaultValue = function(fields, defaultValueModel){
				fields.map(function(field){
					if(field){
						if(!field.key || !isNaN(field.key)){
							field.defaultValue = defaultValueModel;
						}else{
							field.defaultValue = defaultValueModel[field.key];
						}
					}
				});
			};

			var multiTypesSelectOptions = [];

			if(multiTypesFields){
				Object.keys(multiTypesFields).map(function(key){
					multiTypesSelectOptions.push({
						name: multiTypesFields[key][0].templateOptions.optionLabel || key,
						value: key
					});
				});
			}

			var getMultiTypesSelectUniqueValidator = {
				expression: function(viewValue, modelValue){

					if(!$scope.options.data.fieldTypeKeyUnique){
						return true;
					}

					var value = $scope.model[$scope.options.key];
					var fieldType = $scope.options.data.fieldTypeKey;
					var typesCount = 0;

					value.map(function(item){
						if(item[fieldType] == modelValue){
							typesCount++;
						}
					});

					return typesCount < 2;
				},
				message: function(viewValue){

					var desc = viewValue;

					if(multiTypesFields[viewValue][0] && multiTypesFields[viewValue][0].templateOptions){
						desc = multiTypesFields[viewValue][0].templateOptions.optionLabel || desc;
					}

					return 'É permitido apenas um ' + desc + '.';
				}
			};

			var getMultiTypesSelect = function(key, index, fieldsBasedOnModel){

				return {
					key: key,
					type: 'select',
					className: 'multi-type-select',
					ngModelElAttrs: fieldsBasedOnModel[0].ngModelElAttrs,
					templateOptions: {
						required: true,
						notNull: true,
						options: multiTypesSelectOptions,
						onChange: function(){

							$scope.options.multiInputFields[index].splice(
								0,
								$scope.options.multiInputFields[index].length
							);

							var fields = getMultiTypeFieldsBasedOnModel(index);

							angular.extend(
								$scope.options.multiInputFields[index],
								fields
							);

						}
					},
					expressionProperties: fieldsBasedOnModel[0].expressionProperties,
					validators: {
						getMultiTypesSelectUniqueValidator: getMultiTypesSelectUniqueValidator
					}
				};

			};

			var getMultiTypesFieldBasedOnModelValue = function(fieldType, value){

				var field = angular.copy(multiTypesFields[value[fieldType]]);

				if(!field){
					return null;
				}

				return field;
			};

			var getMultiTypeFieldsBasedOnModel = function(index){

				var value = $scope.model[$scope.options.key][index];
				var fieldType = $scope.options.data.fieldTypeKey;
				var fieldsBasedOnModel = getMultiTypesFieldBasedOnModelValue(fieldType, value);
				var fields = [
					getMultiTypesSelect(
						fieldType,
						index,
						fieldsBasedOnModel
					)
				];

				if(fieldsBasedOnModel){
					fields = fields.concat(fieldsBasedOnModel);
				}else{
					fields = [];
				}

				$timeout(function(){
					fields[0].formControl.$touched = true;
					fields[0].formControl.$untouched = false;
				});

				return fields;

			};

			$scope.hasMatchFields = function(index){

				// is not a multi types fields
				if(!multiTypesFields){
					return true;
				}

				var value = $scope.model[$scope.options.key][index];
				var fieldType = $scope.options.data.fieldTypeKey;

				return !!multiTypesFields[value[fieldType]];

			};

			$scope.getFields = function(index){

				if(!isArrayOfValues){
					$timeout(function(){
						$scope.options.data.multiInputForms =
							$scope.form.multiInputForms[$scope.options.key];
					});
				}

				var value = getDefaultValue();
				var fields = $scope.options.fields[index];

				if(!fields){

					if(multiTypesFields){
						fields = getMultiTypeFieldsBasedOnModel(index);
					}else{
						fields = angular.copy($scope.options.data.fields);
					}

					$scope.options.fields.push(fields);

				}

				if(value && value.length){

					var defaultValueModel = value[$scope.options.fields.length-1];

					if(defaultValueModel){
						setFieldsDefaultValue(
							fields,
							defaultValueModel,
							$scope.options.fields.length-1
						);
					}

				}

				return fields;

			};

			$scope.add = function(event){

				var target = event.target;

				var model = $scope.model[$scope.options.key];

				if(!model || model.constructor != Array){
					model = $scope.model[$scope.options.key] = [];
				}

				var newModel = isArrayOfValues
					? ''
					: {};

				if(multiTypesFields){
					newModel[$scope.options.data.fieldTypeKey] = multiTypesSelectOptions[0].value;
				}

				model.push(newModel);

				$timeout(function(){

					var input = $(target)
						.closest('.formly-field-multiinput')
						.find('ng-form, formly-field').last()
						.find('input:not([type=hidden])')[0];

					if(input){
						input.focus();
					}

				},0);

			};

			$scope.remove = function(index, item){

				if(isArrayOfValues){

					model.splice(index, 1);

					setAndCleanUPModel(model);

				}else{

					if(item[keepKey]){

						Object.keys(item).map(function(key){
							if(key != keepKey){
								delete item[key];
							}
						});

					}else{

						delete $scope.form.multiInputForms[$scope.options.key][index];
						$scope.options.fields.splice(index, 1);

						model.splice(index, 1);

						setAndCleanUPModel(model);

					}

				}

			};

			$scope.isRemoved = function(item){
				return typeof item != 'undefined'
					&& item.constructor.name == 'Object'
					&& Object.keys(item).length === 1
					&& Object.keys(item)[0] == keepKey;
			};

		};

		formlyConfigProvider.setType({
			name: 'multiinput',
			templateUrl: 'formly-templates/multi-input.html',
			//extends: 'input',
			// defaultOptions: {
			// 	noFormControl: false,
			// },
			controller: controller
		});

	})

	;

})();
