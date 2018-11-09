
'use strict';

(function(){

	angular.module('services.calendar', [])

		.factory(

			'calendarService',

			function(
				$http,
				$rootScope,
				listFactory,
				urls
			){

				var getDefaultParams = function(){

					// [todo] replace by preferences service
					var params = {
						limit: $rootScope.mainController.device == 'desktop' ? 30 : 5
					};

					params.fields = JSON.stringify(params.fields);

					return params;

				};

				var get = function(attrs){

					var params = {};

					if(!attrs.link){

						params = getDefaultParams();

						if(attrs.params){
							params = angular.extend(params, attrs.params);
						}

					}else{
						attrs.link = attrs.link.replace(
							/.*?(\?.*?)$/g, '' + '$1'
						);
					}

					attrs = attrs || {};

					$http({
						url: urls.apiHost + urls.apiPaths.calendar
						+(
							attrs.link
							? attrs.link
							: ''
						)
						,
						method: 'GET',
						params: params,
						toastrMessages: attrs.toastrMessages
					}).then(
						function(response){
							if(typeof attrs.success == 'function'){
								attrs.success(response);
							}
						},
						function(response){
							if(typeof attrs.error == 'function'){
								attrs.error(response);
							}
						}
					);

				};

				var gerFilterHashLink = function(path, attrs, routeParams){
					var url = path;

					if(attrs.link && routeParams){
						attrs.params =
							listFactory.getAttrsFromRouteParams(routeParams).params || {};
					}

					url += 'filters/' + listFactory.saveAttrsAndGetHashLink(attrs);

					return url;
				};

				var service = {
					get: get,
					gerFilterHashLink: gerFilterHashLink,
				};

				return service;

			});

})();
