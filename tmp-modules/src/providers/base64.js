
'use strict';

(function(){

	angular.module('provider.base64', [])

	.run(function(
		$http,
		$timeout,
		base64
	){

		$http({
			url: '/base64/sounds.json',
			mehtod: 'GET'
		}).then(
			function(response){
				base64.putFiles('sounds', response.data);
			},
			function(response){
				console.log(response);
			}
		);

	})

	.provider('base64', function(){

		var
			self = this,
			files = {};

		self.putFiles = function(type, data){
			files[type] = data;
		};

		self.getFilesType = function(type){
			return files[type];
		};

		self.$get = function(){

			return self;

		};

	});

})();
