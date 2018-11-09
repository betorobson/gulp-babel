
'use strict';

(function(){

	angular.module('anapro.formly.nya-select', [])

	.run(function($interpolate, $sce, formlyConfig, nyaBsConfig){

		angular.merge(nyaBsConfig, {
			defaultNoneSelection: 'Nada selecionado',
			noSearchResult: 'Nenhum resultado foi encontrado',
			numberItemSelected: '%d selecionado(s)',
			selectAll: 'Todos',
			deselectAll: 'Descelecionar todos'
		});

		var controller = function(
			$scope,
			$timeout,
			anaproFormlyFactoryAsyncOptions
		){

			$scope.options.data = $scope.options.data || {};
			$scope.optionsLimit = 20;
			$scope.showSearchBoxHint = false;

			// WORKAROUND delete array model when it is not multiple type
			// if(
			// 	!$scope.options.data.multiple
			// 	&&
			// 	$scope.model[$scope.options.key]
			// 	&&
			// 	$scope.model[$scope.options.key].constructor.name == 'Array'
			// ){
			// 	delete $scope.model[$scope.options.key];
			// }

			var isAllOptionsSelected = false;

			var init = function(){

				$timeout(function(){

					$($scope.fc.$$element).find('.dropdown-toggle').on(
						'blur',
						function(){
							$scope.$digest();
						}
					);

					$($scope.fc.$$element).find('.bs-searchbox input').on(
						'keyup',
						function(){
							$scope.$digest();
						}
					);

					if($scope.options.data.multiple){

						var element = $($scope.options.formControl.$$element[0]).find('.bs-select-all');

						var buttonOK = $('<button type="button" class="bs-select-ok btn btn-default">Ok</button>');

						buttonOK.on(
							'click',
							function(){
								$($($scope.fc.$$element)).removeClass('open');
							}
						);

						$($scope.options.formControl.$$element[0])
								.find('.bs-actionsbox .btn-group')
								.append(buttonOK);

						$(element).unbind('click');

						$(element).click(function(event){
							event.stopPropagation();
							event.preventDefault();
							toggleSelectAll();
						});

					}

				});

			};

			var toggleSelectAll = function(){
				var model = $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];

				if(!isAllOptionsSelected){
					$scope.options.templateOptions.options.map(function(item){
						if(model.indexOf(item.value) < 0){
							model.push(item.value);
						}

					});
				}else{
					model.splice(0, model.length);
				}

				isAllOptionsSelected = !isAllOptionsSelected;
			};

			$scope.isAllOptionsSelected = function(){
				return isAllOptionsSelected;
			};

			var asyncOptionsSuccess = function(){
				$timeout(function(){
					angular.element(
						$scope.options.formControl.$$element[0].querySelector('input')
					)
					.attr('autocomplete', 'false');
				},0);
			};

			var interpolateCustomDesc = function(obj){
				return $interpolate(
					$scope.options.data.customDesc
				)(obj);
			};

			var setCustomDescTemplate = function(obj){

				var template = interpolateCustomDesc(obj);

				obj.customDescOnlyText = template
					.replace(/<.*?>/g,' ')
					.toLowerCase()
					.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

				obj.customDescTemplate = $sce.trustAsHtml(
					template
					+ '<span class="hidden-normalized-name">'
					+ obj.customDescOnlyText
					+ '</span>'
				);

			};

			$scope.optionIsSelected = function(option){

				var model = $scope.model[$scope.options.key];

				if(
					model
					&&
					model.constructor.name == 'Array'
				){

					return model.indexOf(option.value) > -1;
				}

				return false;

			};

			$scope.removeSelectedOption = function(option){

				var model = angular.copy($scope.model[$scope.options.key]);

				model.splice(model.indexOf(option.value), 1);

				$scope.options.value(model);

				if(!model.length){
					delete $scope.model[$scope.options.key];
				}

				$scope.fc.$touched = true;
				$scope.fc.$untouched = false;

			};

			$scope.getOptions = function(){

				var searchBoxVal = $($scope.fc.$$element)
					.find('.bs-searchbox input')
					.val()
					.toLowerCase()
					.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
				;

				$($scope.fc.$$element)
					.find('.bs-searchbox input')
					.attr(
						'placeholder',
						'Digite para filtrar ' + $scope.to.label
					);

				var searchBoxValRegExp = new RegExp(
					searchBoxVal.replace(/([*()\u005B\u005D{}.?^$])/g,'\\$1'),
					'i'
				);

				var optionsLimit = 0;

				var model = $scope.model[$scope.options.key];

				var filteredOptions = $scope.options.templateOptions.options.filter(function(item){

					item.displayName = item.displayName || angular.copy(item.name);
					item.name = item.name
						.toLowerCase()
						.normalize('NFD')
						.replace(/[\u0300-\u036f]/g, '');

					if(
						(searchBoxValRegExp.test(item.customDescOnlyText || item.name) && optionsLimit < $scope.optionsLimit)
						||
						model && model.constructor.name == 'Array' && model.indexOf(item.value) >= 0
					){
						optionsLimit++;

						return true;
					}

					return false;
				});

				$scope.showSearchBoxHint = optionsLimit >= $scope.optionsLimit;

				if(filteredOptions.length){
					$($scope.fc.$$element).find('.no-search-result').removeClass('show');
				}

				return filteredOptions;

			};

			$scope.cleanup = function($event){
				$event.stopPropagation();

				if($scope.model[$scope.options.key]){
					delete $scope.model[$scope.options.key];
				}
			};

			anaproFormlyFactoryAsyncOptions.getInstance($scope).init({
				success: asyncOptionsSuccess
			});

			if($scope.options.data.customDesc){
				$scope.options.templateOptions.options.map(function(item){
					setCustomDescTemplate(item);
				});
			}

			init();

		};

		formlyConfig.setType({
			name: 'nya-select',
			extends: 'input',
			templateUrl: 'formly-templates/nya-select.html',
			controller: controller,
			defaultOptions: {
				templateManipulators: {
					preWrapper: [
						function(template, options, scope){

							if(scope.options.data.multiple){

								var x = angular.element('<div></div>').html(template);

								angular.element(x[0].querySelector('.nya-bs-select'))
									.attr('multiple', '')
									.attr('actions-box', 'true');

								return angular.element(x).html();

							}

							return template;

						}
					]
				}
			}
		});

	})

	;

})();
