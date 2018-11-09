
'use strict';

(function() {

	angular.module('directives.enriched-person-data', [])

		.controller(
			'EnrichedPersonDataController',
			function(
				$scope,
				enrichedDataTypesFactory,
				maskFilter
			){

				var typesByFields = enrichedDataTypesFactory.getTypesByField();

				console.log(typesByFields);

				$scope.getTypeByField = function(item){
					return typesByFields[item.field] || 'dataList';
				};

				$scope.getLabel = function(option, item){
					
					if(item.field == 'enrichPersonPhone'){
						return maskFilter(option.name, 'tel');
					}	

					return option.name;
				};

				var userImagesError = [];

				$scope.hideIcon = function(item){
					userImagesError.push(item);
				};

				$scope.isUserImageError = function(item){
					return userImagesError.indexOf(item) >= 0;
				};
			}
		)

		.factory('enrichedDataTypesFactory', function(){
			var listTypes = {
				dataIcons: [
					'enrichPersonUrl'
				],
				dataImages: [
					'enrichPersonImage'
				],
				dataText: [
					'enrichPersonGender'
				]
			};

			var typesByFields = {};

			Object.keys(listTypes).map(function(key) {
				listTypes[key].map(function(field) {
					typesByFields[field] = key;
				});
			});

			var getTypesByField = function(){
				return typesByFields;
			};

			return {
				getTypesByField: getTypesByField
			};

		})

		.directive('enrichedPersonData', function() {
			return {
				restrict: 'E',
				scope: {
					person: '='
				},
				controller: 'EnrichedPersonDataController',
				templateUrl: 'enriched-person-data/enriched-person-data.html'
			};
		})

		.directive('enrichedPersonDataIcons', function() {
			return {
				restrict: 'E',
				// controller: 'EnrichedPersonDataController',
				templateUrl: 'enriched-person-data/enriched-person-data-icons.html'
			};
		})

		.directive('enrichedPersonDataText', function() {
			return {
				restrict: 'E',
				// controller: 'EnrichedPersonDataController',
				templateUrl: 'enriched-person-data/enriched-person-data-text.html'
			};
		})

		.directive('enrichedPersonDataList', function() {
			return {
				restrict: 'E',
				// controller: 'EnrichedPersonDataController',
				templateUrl: 'enriched-person-data/enriched-person-data-list.html'
			};
		})

		.directive('enrichedPersonDataImages', function() {
			return {
				restrict: 'E',
				// controller: 'EnrichedPersonDataController',
				templateUrl: 'enriched-person-data/enriched-person-data-images.html'
			};
		})

	;

})();
