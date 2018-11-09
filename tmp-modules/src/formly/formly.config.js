
'use strict';

(function(){

	angular.module('anapro.formly')

	.run(function(formlyConfig){

		formlyConfig.extras.errorExistsAndShouldBeVisibleExpression =
			'fc.$touched || form.$submitted';

		formlyConfig.setType([
			{
				name: 'anaproCheckbox',
				templateUrl: 'formly-templates/checkbox.html',
				extends: 'checkbox'
			},
			{
				name: 'anaproEmail',
				extends: 'input',
				defaultOptions: {
					templateOptions: {
						type: 'email'
					}
				}
			},
			{
				name: 'anaproMultiCheckbox',
				templateUrl: 'formly-templates/multicheckbox.html',
				extends: 'multiCheckbox',
				wrapper: 'anaproMultiCheckbox'
			},
			{
				name: 'maskedInput',
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
						},
						cpf: {
							attribute: 'ui-br-cpf-mask'
						},
						cnpj: {
							attribute: 'ui-br-cnpj-mask'
						},
						cpfCnpj: {
							attribute: 'ui-br-cpfcnpj-mask'
						}
					},
					templateOptions: {
						type: 'tel', // force mobile show numeric keyboard
						restrict: 'reject',
						clean: true
					}
				}
			},
			{
				name: 'numberInput',
				extends: 'input',
				controller: function($scope){
					$scope.options.resetModel = function(){
						if($scope.options.defaultValue === 0){
							$scope.options.defaultValue = '0';
						}

						$scope.model[$scope.options.key] = $scope.options.defaultValue;
					};
				},
				defaultOptions: {
					ngModelAttrs: {
						minValue: {
							attribute: 'min'
						},
						maxValue: {
							attribute: 'max'
						},
						decimals: {
							attribute: 'ui-number-mask'
						},
						money: {
							attribute: 'ui-money-mask'
						},
						hideSeparator: {
							attribute: 'ui-hide-group-sep'
						}
					},
					templateOptions: {
						type: 'tel' // force mobile show numeric keyboard
					}
				}
			},
			{
				name: 'hidden',
				template: '',
				defaultOptions: {
					noFormControl: true,
					hide: true
				}
			}

		]);

		formlyConfig.setWrapper([
			{
				name: 'anaproMultiCheckbox',
				templateUrl: 'formly-templates/multicheckbox-wrapper.html'
			},
			{
				name: 'anaproSelect',
				types: ['select'],
				templateUrl: 'formly-templates/select-wrapper.html'
			},
			{
				name: 'anaproSelectAsync',
				types: ['select-async'],
				templateUrl: 'formly-templates/select-async-wrapper.html'
			},
			{
				name: 'anaproRadio',
				types: ['radio'],
				templateUrl: 'formly-templates/radio-wrapper.html'
			},
			{
				name: 'extras',
				types: [
					'input',
					'maskedInput',
					'numberInput',
					'select',
					'anaproEmail',
					'anaproDate',
					'anaproTime',
					'anaproDateTime',
					'textarea',
					'nya-select',
					'select-async',
					'anaproSelectButtons'
				],
				templateUrl: 'formly-templates/extras-wrapper.html'
			},
			{
				name: 'validation',
				types: [
					'input',
					'maskedInput',
					'numberInput',
					'select',
					'radio',
					'anaproEmail',
					'anaproDate',
					'anaproTime',
					'anaproDateTime',
					'nya-select',
					'select-async',
					'anaproSelectButtons'
				],
				templateUrl: 'formly-templates/error-messages-wrapper.html'
			}
		]);

	});

})();
