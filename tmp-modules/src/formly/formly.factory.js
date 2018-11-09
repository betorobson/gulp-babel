
'use strict';

(function(){

	angular.module('anapro.formly.factory', [])
		.factory('anaproFormlyFactory',

			function(
				$filter
			){

				// default field type converter
				var fieldTypes = {
					'email': 'anaproEmail',
					'date': 'anaproDate',
					'time': 'anaproTime',
					'datetime': 'anaproDateTime',
					'boolean': 'anaproCheckbox',
					'multiselect': 'anaproMultiCheckbox'
				};

				var fieldTypeMaker = {

					text: function(field){
						return angular.extend(
							field,
							{
								type: 'input',
								templateOptions: angular.extend(
									field.templateOptions,
									{
										type: 'text',
										minlength: field.templateOptions.minLength || null,
										maxlength: field.templateOptions.maxLength || null
									}
								)
							}
						);
					},

					numberInput: function(field){

						field = angular.extend(
							field,
							{
								type: 'numberInput'
							}
						);

						if(field.templateOptions.money){
							field.validation = {
								messages: {
									max: function(newValue, oldValue, scope){
										newValue, oldValue;

										return 'Valor máximo permitido é '
											+ $filter('currency')(scope.to.maxValue, 'R$ ');
									},
									min: function(newValue, oldValue, scope){
										newValue, oldValue;

										return 'Valor mínimo permitido é '
											+ $filter('currency')(scope.to.minValue, 'R$ ');
									}
								}
							};
						}else if(field.templateOptions.decimals){
							field.validation = {
								messages: {
									max: function(newValue, oldValue, scope){
										newValue, oldValue;

										return 'Valor máximo permitido é '
											+ $filter('number')(scope.to.maxValue, scope.to.decimals);
									},
									min: function(newValue, oldValue, scope){
										newValue, oldValue;

										return 'Valor mínimo permitido é '
											+ $filter('number')(scope.to.minValue, scope.to.decimals);
									}
								}
							};
						}else{
							field.templateOptions.decimals = 0;
						}

						return field;
					},

					maskedInput: function(field){
						return angular.extend(
							field,
							{
								type: 'maskedInput',
								templateOptions: angular.extend(
									field.templateOptions,
									{
										type: 'text'
									}
								)
							}
						);
					},

					select: function(field){

						if(field.templateOptions.options.length > 20){
							field.type = 'nya-select';
						}

						return field;
					}

				};

				var replacePropertyFieldByKey = function(field){
					field.key = field.field;
					delete field.field;
				};

				var moveOptionsToTemplateOptions = function(field){
					field.templateOptions = field.templateOptions || {};

					if(field.options){
						field.templateOptions.options = field.options;
						delete field.options;
					}
				};

				var mergeFieldsByKey = function(field, options){
					field.templateOptions = field.templateOptions || {};

					if(options.merge && options.merge[field.key]){
						field = angular.merge(
							field,
							options.merge[field.key]
						);
					}
				};

				var createFormlyFieldType = function(field){
					if(field.templateOptions &&
						/mask|cnpj|cpf/
							.test(Object.keys(field.templateOptions)
							.join(',').toLowerCase())
					){
						return fieldTypeMaker['maskedInput'](field);
					}else if(/integer|decimals/.test(field.type)){
						return fieldTypeMaker['numberInput'](field);
					}else if(fieldTypeMaker[field.type]){
						return fieldTypeMaker[field.type](field);
					}else{
						return field;
					}
				};

				var createFormlyFieldsFromAPI = function(
					apiFields,
					formlyFields,
					options
				){

					options = options || {};

					apiFields.map(function(field){
						replacePropertyFieldByKey(field);
						moveOptionsToTemplateOptions(field);
						mergeFieldsByKey(field, options);
						field.type = fieldTypes[field.type.toLowerCase()] || field.type;
						field = createFormlyFieldType(field) || field;
						formlyFields.push(field);
					});

				};

				var resetModel = function(fields, model){
					for(var i=0; i<fields.length; i++){

						var fieldModel = fields[i].model || model;
						var defaultValue = fields[i].defaultValue;

						if(typeof fields[i].key != 'undefined' && defaultValue
							||
							fieldModel[fields[i].key]
						){

							if(fields[i].type == 'anaproCheckbox'){
								delete fieldModel[fields[i].key];

							}else if(fields[i].type == 'anaproMultiCheckbox'){
								fieldModel[fields[i]['key']] = [];

							}else if(fields[i].fieldGroup){
								resetModel(fields[i], fieldModel[fields[i]['key']]);
								delete fieldModel[fields[i]['key']];

							}else if(
								defaultValue
								||
								/multiinput|address/.test(fields[i].type)
								||
								/anaproDate|anaproTime|anaproDateTime/.test(fields[i].type)
							){
								fields[i].resetModel();
							}else{
								delete fieldModel[fields[i].key];

							}

						}
					}
				};

				// var getFormattedModel = function(fields, model){
				// 	var formattedModel = angular.copy(model);

				// 	for(var i=0; i<fields.length; i++){

				// 		var field = fields[i];
				// 		var fieldModel = fields[i].model || formattedModel;

				// 		if(fieldModel[fields[i].key]){

				// 			if(fields[i].data && fields[i].data.getFormattedValue){

				// 				formattedModel[field.key] = fields[i].data.getFormattedValue();

				// 			}else if(fields[i].fieldGroup){

				// 				formattedModel[fields[i].key] = getFormattedModel(
				// 					fields[i].fieldGroup,
				// 					formattedModel[fields[i].key]
				// 				);

				// 				if(fields[i].data && fields[i].data.merge){
				// 					angular.merge(
				// 						formattedModel,
				// 						formattedModel[fields[i].key]
				// 					);
				// 					delete formattedModel[fields[i].key];
				// 				}

				// 			}
				// 		}

				// 	}

				// 	return formattedModel;
				// };

				var groupOptionsByExpression = function(fields, key, expression){

					var options;

					fields.map(function(item){
						if(item.field == key){
							options = item.options;
						}
					});

					if(options){
						options.map(function(item){
							if(expression.test(item.name)){
								item.group = item.name.match(expression)[1];
								item.name = item.name.replace(expression,'');
							}
						});
					}

					return options;
				};

				var parseDate = function(newValue, oldValue, scope){
					return $filter('date')(newValue,scope.options.templateOptions.dateFormat);
				};

				var formatterDate = function(newValue){

					if(!newValue){
						return newValue;
					}

					return new Date(
						newValue +
							(!/T(\d\d:?){3}/.test(newValue)
								? 'T00:00:00'
								: ''
							)
					);
				};

				var getDateFromString = function(dateString){

					if(!dateString){
						return null;
					}else if(dateString.constructor.name == 'Date'){
						return dateString;
					}else{
						var d = dateString.split(/\D/);

						return new Date(
							d[0],
							d[1]-1,
							d[2],
							d[3] || 0,
							d[4] || 0,
							d[5] || 0
						);
					}

				};

				var timeISOFromString = function(val, baseDate){

					if(!val){
						return null;
					}

					var valDate = new Date(val);
					var match;

					if(!isNaN(valDate.getTime())){
						return valDate;

					}else{

						match = val.match(/(..):(..)(:(..))?/);

						if(baseDate
							&& baseDate.constructor.name == 'Date'
							&& !isNaN(baseDate.getTime())
						){
							return new Date(
								baseDate.getFullYear(),
								baseDate.getMonth(),
								baseDate.getDate(),
								match[1],match[2],match[4] || '00','000'
							);
						}else{
							return new Date(1970,1,1,match[1],match[2],match[4] || '00','000');
						}

					}

				};

				var setFieldsOrder = function(fields, order){

					var orderedFields = [];

					for(var index=0; index<fields.length; index++){

						var newFieldIndex = order.indexOf(fields[index].key);

						if(newFieldIndex >= 0){
							orderedFields[newFieldIndex] = fields.splice(index, 1)[0];
							index--;
						}

					}

					for(var i = orderedFields.length; i--; i>=0){

						if(orderedFields[i]){
							fields.splice(0, 0, orderedFields[i]);
						}

					}

				};

				var service = {
					createFormlyFieldsFromAPI: createFormlyFieldsFromAPI,
					resetModel: resetModel,
					// getFormattedModel: getFormattedModel,
					groupOptionsByExpression: groupOptionsByExpression,
					parseDate: parseDate,
					formatterDate: formatterDate,
					timeISOFromString: timeISOFromString,
					getDateFromString: getDateFromString,
					setFieldsOrder: setFieldsOrder
				};

				return service;

			}
		);

})();
