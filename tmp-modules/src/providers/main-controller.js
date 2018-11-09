
'use strict';

(function(){

	angular.module('provider.main-controller', [
		'provider.main-controller.rote-device-changed'
	])

	.provider('mainController', function(){

		var
			self = this,
			device;

		self.setDevice = function(){
			device = document.querySelector('body').offsetWidth < 960 ?
				'mobile'
				:
				'desktop';
		};

		self.setDevice();

		self.getDevice = function(){
			return device;
		};

		self.$get = function(mainControllerRotateDeviceChanged){

			mainControllerRotateDeviceChanged.init(self);

			return self;
		};

	});

})();
