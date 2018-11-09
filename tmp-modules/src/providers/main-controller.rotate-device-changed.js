
'use strict';

(function(){

	angular.module('provider.main-controller.rote-device-changed',[])

	.provider(

		'mainControllerRotateDeviceChanged',

		function(){

			var self = this;

			self.$get = function(
				$window
			){

				var
					mainController,
					lastDevice,
					windowOnResizeListenerAdded = false;

				var windowOnResizeListener = function(){

					lastDevice = mainController.getDevice();

					mainController.setDevice();

					if(lastDevice != mainController.getDevice()){
						angular.element($window).off('resize', windowOnResizeListener);
						windowOnResizeListenerAdded = false;
						$window.location.reload();
					}

				};

				self.init = function(mainControllerProvider){

					mainController = mainControllerProvider;

					angular.element($window).on(
						'orientationchange',
						function(){
							if(!windowOnResizeListenerAdded){
								windowOnResizeListenerAdded = true;
								angular.element($window).on('resize', windowOnResizeListener);
							}
						}
					);

				};

				return self;

			};

		}
	);

})();
