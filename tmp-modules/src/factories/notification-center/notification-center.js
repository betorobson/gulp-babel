
'use strict';

(function(){

	angular.module('factories.notification-center',[
		'factories.notification-center.dialogs',
		'factories.notification-center.toastr',
		'factories.notification-center.transactions-awaiting',
		'factories.notification-center.transactionSumary',
		'factories.notification-center.position-in-queues'
	])

	.provider(
		'notificationCenter',

		function(){

			var self = this;

			self.$get = function(
				notificationCenterFactory,
				firebaseService,
				pendingProcessingService
			){

				self.init = function(){
					firebaseService.init();
					pendingProcessingService.init();
				};

				return self;

			};

		}

	)

	.factory(
		'notificationCenterFactory',

		function(){

			var

				registeredServices = [],

				registerToGetNotifications = function(register){
					if(register.service){
						registeredServices.push(register);
					}
				},

				generateDataByServicesRegistered = function(collection, register, data){

					var registerData = {};

					if(register.types.indexOf(collection) >= 0){

						registerData[collection] = data;

					}else{

						var filteredType = Object.keys(data).filter(function(key){
							return register.types.indexOf(key) >= 0;
						});

						filteredType.map(function(type){
							registerData[type] = data[type];
						});
					}

					return registerData;

				},

				removeNotificationById = function(id, doNotShowAgain){
					registeredServices.map(function(register){
						if(register.service.removeById){
							register.service.removeById(id, doNotShowAgain);
						}
					});
				},

				removeNotificationByAttribute = function(attrs, doNotShowAgain){
					registeredServices.map(function(register){
						if(register.service.removeByAttribute){
							register.service.removeByAttribute(attrs, doNotShowAgain);
						}
					});
				},

				dispatch = function(collection, data){

					registeredServices.map(function(register){

						if(register.collection.indexOf(collection) >= 0){

							var registerData = generateDataByServicesRegistered(collection, register, data);

							if(Object.keys(registerData).length){
								register.service.dispatch(registerData);
							}

						}

					});

				},

				factory = {
					registerToGetNotifications: registerToGetNotifications,
					dispatch: dispatch,
					removeNotificationById: removeNotificationById,
					removeNotificationByAttribute: removeNotificationByAttribute
				};

			return factory;
		}
	);

})();
