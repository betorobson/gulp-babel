
'use strict';

(function(){

	angular.module('services.permissions', [])

	.factory(

		'permissionsService',

		function(
			$http,
			urls,
			permissionsDescription
		){

			var setPermissionsDescription = function(permissions){
				permissions.fields.permissionKeys.map(function(permissionItem){
					permissionsDescription[permissionItem.fields.permissionKey] = permissionItem.fields.permissionKeyDescricao;
				});
			};

			var setDescriptions = function(response){
				var permissions = response.data.data;
				permissions.map(function(permissionsFields){
					setPermissionsDescription(permissionsFields);
				});
			};

			var service = {

				get: function(attrs){

					$http({
						url: urls.apiHost + urls.apiPaths.permissions,
						method: 'GET'
					}).then(
						function(response){

							setDescriptions(response);

							if(typeof attrs.success == 'function'){
								attrs.success();
							}
						},
						function(){
							// use default
							if(typeof attrs.success == 'function'){
								attrs.success();
							}
						}
					);

				},
				getItem: function(attrs){

					$http({
						url: urls.apiHost + urls.apiPaths.permissions + '/' + attrs.permissionKey,
						method: 'GET'
					}).then(
						function(response){

							setPermissionsDescription(response.data);

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

				}

			};

			return service;

		});

})();
