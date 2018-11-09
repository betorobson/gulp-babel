
'use strict';

(function(){

	// custom and VERY complex address field
	// do not touch it before talk to roberto@anapro.com

	var formatter = function(newValue){
		if(newValue[0]){
			delete newValue[0];
		}

		return newValue;
	};

	angular.module('anapro.formly.address-input', [])

	.config(function(formlyConfigProvider){

		var controller = function($rootScope, $scope, $http, $q, $timeout, $tooltip, urls){

			$rootScope, $scope, $http, $q, urls;

			$scope.loading = false;

			// tooltip
			$timeout(function(){

				if($scope.options.ngModelElAttrs && $scope.options.ngModelElAttrs['bs-tooltip']){
					$tooltip(
						$scope.addressForm.$$parentForm.$$element,
						$scope.options.data.tooltip
					);
				}

			},0);

			var properties = {
				street: 'enderecoLogradouro',
				number: 'enderecoNumero',
				neighborhoodId: 'enderecoBairroId',
				neighborhood: 'enderecoBairroNome',
				state: 'enderecoUF',
				cityId: 'enderecoCidadeId',
				city: 'enderecoCidadeNome',
				zipcode: 'enderecoCEP',
				street2: 'enderecoComplemento',
				info: 'enderecoObs'
			};

			if($scope.options.data.properties){
				angular.extend(properties, $scope.options.data.properties);
			}

			var defaultValue = angular.copy($scope.options.defaultValue || {});

			$scope.addressModel;
			$scope.addressForm;
			$scope.addressFormOptions;

			$scope.options.formatters = [formatter];

			var model;

			if($scope.options.key){
				$scope.addressModel = $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || {};
			}else{
				$scope.addressModel = $scope.model = $scope.model || {};
			}

			model = $scope.addressModel;

			if(defaultValue[properties.street] && !model[properties.street]){
				angular.extend(model, defaultValue);
			}

			$scope.getPropertie = function(propertie){
				return $scope.addressModel[properties[propertie]];
			};

			formatter(model);

			if($scope.to.required && $scope.to.label){
				$scope.to.label = $scope.to.label + '*';
			}

			$scope.options.resetModel = function(){
				$scope.addressFormOptions.resetModel();
			};

			var setFullAddress = function(data){

				var fields = data.fields || {};

				model[properties.street] = fields.localidadeLogradouro;
				model[properties.neighborhoodId] = fields.localidadeBairroId;
				model[properties.neighborhood] = fields.localidadeBairroNome;
				model[properties.state] = fields.localidadeUF;
				model[properties.cityId] = fields.localidadeCidadeId;
				model[properties.city] = fields.localidadeCidadeNome;

				$scope.loading = false;

			};

			$scope.formAddressOptions = {};

			var getCEP = function($modelValue){

				if($modelValue){

					$scope.loading = true;

					return $http({
						url: urls.apiHost
							+ urls.apiPaths.utilsCEP
							+ '/'
							+ $modelValue,
						method: 'get',
						toastrMessages: {
							payloadError: null
						}
					}).then(
						function(response){
							setFullAddress(response.data);

							return true;
						},
						function(){
							setFullAddress({});

							return $q.reject();
						}
					);

				}else{
					return $q.reject();
				}

			};

			var setModelEmptyWhenZipcodeIsBlankAndNotRequired = function(){

				Object.keys($scope.addressModel).map(function(key){
					delete $scope.addressModel[key];
				});

				$timeout(function(){
					delete $scope.addressModel[properties.zipcode];
				},0);

			};

			$scope.fields = [
				{
					type: 'zipcode',
					key: properties.zipcode,
					// defaultValue: defaultValue[properties.zipcode],
					ngModelAttrs: {
						autocomplete: {
							attribute: 'autocomplete'
						}
					},
					elementAttributes: {
						'flex-xs': '40',
						'flex-gt-xs': '20'
					},
					templateOptions: {
						noErrorSpace: true,
						autocomplete: false,
						type: 'tel',
						required: $scope.to.required || false,
						placeholder: 'CEP',
						mask: '99999-999'
					},
					modelOptions: {
						debounce: 200
					},
					asyncValidators: {
						cep: {
							expression: function($viewValue, $modelValue, scope){

								$viewValue, $modelValue, scope;

								if(!$modelValue && !scope.options.templateOptions.required){

									setModelEmptyWhenZipcodeIsBlankAndNotRequired();

									return $q.resolve();

								}else if(scope.fc && scope.fc.$error.mask){
									setFullAddress({});

									return $q.reject();

								}else{

									if(!model[properties.street]
										||
										model[properties.zipcode] != $modelValue
									){
										return getCEP($modelValue);
									}else{
										return $q.resolve();
									}

								}

							}
						}
					}
				},
				{
					type: 'input',
					key: properties.number,
					elementAttributes: {
						'flex-xs': '25',
						'flex-gt-xs': '15'
					},
					templateOptions: {
						noErrorSpace: true,
						maxlength: 15,
						placeholder: $rootScope.mainController.device == 'desktop'
							? 'Número'
							: 'N°'
					}
				},
				{
					type: 'input',
					key: properties.street2,
					elementAttributes: {
						'flex-xs': '30',
						'flex-gt-xs': '25'
					},
					templateOptions: {
						noErrorSpace: true,
						placeholder: 'Complemento'
					}
				},
				{
					type: 'input',
					key: properties.info,
					elementAttributes: {
						'flex-xs': '100',
						'flex-gt-xs': '35'
					},
					templateOptions: {
						noErrorSpace: true,
						placeholder: 'Observação'
					}
				}
			];

			$scope.zipcode = $scope.fields[0];

		};

		formlyConfigProvider.setType([
			{
				name: 'zipcode',
				extends: 'input',
				defaultOptions: {
					ngModelAttrs: {
						mask: {
							attribute: 'mask'
						},
						restrict: {
							attribute: 'restrict'
						},
						clean: {
							attribute: 'clean'
						}
					},
					templateOptions: {
						restrict: 'reject',
						clean: true
					}
				}
			},
			{
				name: 'address',
				templateUrl: 'formly-templates/address.html',
				controller: controller,
				defaultOptions: {
					validation: {
						messages: {
							required: '"Endereço é obrigatório"',
							mask: '"CEP Inválido"',
							cep: '"CEP não existe"'
						}
					}
				}
			}
		]);

	})

	;

})();
