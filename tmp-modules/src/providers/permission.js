
'use strict';

(function(){

	angular.module('provider.permission', [])

	.provider(
		'permission',
		function(){

			var self = this;

			var adm = false;
			var permissions = [];
			var config = {};
			var descriptions = {};

			self.setAdm = function(){
				adm = true;
			};

			self.set = function(userPermissions){
				permissions = userPermissions;
			};

			var hasPermission = function(permission){

				// permission do not exists any where
				if(!descriptions[permission] && !config[permission]){
					console.warn(
						'Permission key "' + permission + '" do not exists, it was ignored.'
					);

					return true;

				// override that removes permission for everone
				}else if(isRemoved(permission)){
					return false;

				// return permission in user profile
				}else{
					return adm || permissions.indexOf(permission) >= 0 || !!config[permission];
				}

			};

			self.permissionStatus = function(userPermission){
				if(isDisabled(userPermission)){
					return 'disabled';
				}else{
					return hasPermission(userPermission);
				}
			};

			var isRemoved = function(userPermission){
				return config[userPermission]
					&&
					config[userPermission].removed
					|| false
				;
			};

			var isDisabled = function(userPermission){
				return config[userPermission]
					&&
					config[userPermission].disabled
					|| false
				;
			};

			self.getDescription = function(userPermissions){
				return (descriptions[userPermissions] || '').replace(/\.$/,'');
			};

			self.checkPermissions = function(list){

				var permissionsResult = false;

				var listOR = list.split('||');

				for(var i=0; i<listOR.length; i++){

					var listAND = listOR[i].split('&&');

					if(listAND.length > 1){

						for(var z=0; z<listAND.length; z++){

							permissionsResult = self.permissionStatus(listAND[z].trim());

							if(!permissionsResult || permissionsResult == 'disabled'){
								break;
							}

						}

						if(permissionsResult === true){
							break;
						}

					}else{

						permissionsResult = self.permissionStatus(listOR[i].trim());

						if(permissionsResult === true){
							break;
						}

					}

				}

				return permissionsResult;

			};

			this.$get = function(
				$rootScope,
				permissionsDescription,
				permissionsConfig
			){

				$rootScope.permission = self;

				descriptions = permissionsDescription;
				config = permissionsConfig;

				return self;
			};

		}
	);

})();
