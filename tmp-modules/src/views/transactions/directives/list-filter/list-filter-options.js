'use strict';

(function(){

	angular.module('views.transactions')

	.controller(
		'listFilterOptionsController',
		function(
			$scope,
			anaproFormlyFactory
		){

			$scope.delegateListFilter = $scope.delegateListFilter || {};

			$scope.listFilter = $scope.$parent.listFilter;
			$scope.listObj = $scope.$parent.listObj;

			$scope.formlyFields = [];
			$scope.formlyFieldsAdvanced = [];

			$scope.listFilter.modelAdvanced = {};

			var advancedFiltersModelRemoved = false;
			var fieldsAdvancedOriginal = [];

			var defaultFilters = [
				'produtoIdGuid',
				'atendimentoPipelineStageIdGuid',
				'atendimentoExpiracaoAutomaticaQtdDiasRestantesMax',
				'atendimentoInteracaoUsuarioQtdDiasSem'
			];

			var defaultFiltersRegexp = new RegExp(defaultFilters.join('|'));

			var removeFiltersFromModel = function(keys){
				keys.map(function(item){
					delete $scope.listFilter.model.filters[item];
				});
			};

			$scope.setFilters = function($event){
				if($scope.formFilters.$valid){
					removeFiltersFromModel([
						'atendimentoPendencias',
						'atendimentoCompromissos'
					]);
					$scope.listFilter.setFilters();
					$().hideParentDropdown($event.target);
				}
			};

			$scope.delegateListFilter.setFilters = $scope.setFilters;

			$scope.resetFilters = function(){

				anaproFormlyFactory.resetModel(
					$scope.formlyFields,
					$scope.listFilter.model.filters
				);

				if($scope.listFilter.advanced){
					anaproFormlyFactory.resetModel(
						$scope.formlyFieldsAdvanced,
						$scope.listFilter.model.filters
					);
				}

			};

			$scope.toggleAdvancedFilters = function(){

				$scope.listFilter.advanced = !$scope.listFilter.advanced;

				toggleAdvancedFilters();

			};

			var toggleAdvancedFilters = function(){

				if($scope.listFilter.advanced){

					angular.merge(
						$scope.listFilter.model.filters,
						$scope.listFilter.modelAdvanced
					);

					$scope.formlyFieldsAdvanced.splice(0);

					createFieldsFromAPI(
						angular.copy(fieldsAdvancedOriginal),
						$scope.formlyFieldsAdvanced
					);

				}else{
					removeAdvancedFiltersFromModel();
				}

			};

			$scope.delegateListFilter.toggleAdvancedFilters = toggleAdvancedFilters;

			var removeAdvancedFiltersFromModel = function(){

				if($scope.listFilter.model.filters){

					var listToRemove = Object.keys($scope.listFilter.model.filters)
						.filter(function(key){
							if(!defaultFiltersRegexp.test(key)){

								if(!advancedFiltersModelRemoved){
									$scope.listFilter.modelAdvanced[key] = $scope.listFilter.model.filters[key];
								}

								return true;
							}

							return false;
						});

					removeFiltersFromModel(listToRemove);

				}

				advancedFiltersModelRemoved = true;

			};

			var setFields = function(){

				var fieldsDefault = $scope.listObj.data.filters.filter(function(item){
					return defaultFiltersRegexp.test(item.field);
				});

				var fieldsDefaultAdvanced = $scope.listObj.data.filters.filter(function(item){
					return !defaultFiltersRegexp.test(item.field);
				});

				createFieldsFromAPI(fieldsDefault, $scope.formlyFields);

				fieldsAdvancedOriginal = angular.copy(fieldsDefaultAdvanced);

			};

			var createFieldsFromAPI = function(fields, formlyFields){

				anaproFormlyFactory.createFormlyFieldsFromAPI(
					fields,
					formlyFields,
					{
						merge: {
							atendimentoCodigo: {
								type: 'hidden'
							},
							atendimentoOpcao: {
								type: 'anaproSelectButtons',
								templateOptions: {
									noErrorSpace: true
								}
							},
							atendimentoStatus: {
								type: 'anaproSelectButtons',
								templateOptions: {
									noErrorSpace: true
								}
							},
							atendimentoPipelineStageIdGuid: {
								templateOptions: {
									noErrorSpace: true,
									options: anaproFormlyFactory.groupOptionsByExpression(
										$scope.listObj.data.filters,
										'atendimentoPipelineStageIdGuid',
										/\((.*?)\)/
									)
								}
							},
							atendimentoInteracaoUsuarioQtdDiasSem: {
								className: 'ipt-days'
							},
							atendimentoExpiracaoAutomaticaQtdDiasRestantesMax: {
								className: 'ipt-days'
							},
							atendimentoPendencias: {
								type: 'hidden'
							},
							atendimentoCompromissos: {
								type: 'hidden'
							},
							atendimentoExpiracaoAutomaticaQtdDiasRestantes: {
								type: 'hidden'
							},
							produtoIdGuid: {
								templateOptions: {
									noErrorSpace: true
								}
							},
							interacaoAtividadeSem: {
								type: 'anaproSelectButtons',
								templateOptions: {
									noErrorSpace: true
								}
							}
						}
					}
				);

			};

			setFields();
			removeAdvancedFiltersFromModel();

		}
	)

	.directive('listFilterOptions', function(){
		return {
			restrict: 'E',
			scope: {
				delegateListFilter: '='
			},
			templateUrl: 'transactions/directives/list-filter/list-filter-options.html',
			controller: 'listFilterOptionsController'
		};
	})

	;

})();
