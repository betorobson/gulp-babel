
'use strict';

(function(){

	angular.module('factories.notification-center.toastr',[])

	.run(function(
		notificationCenterFactory,
		notificationCenterToastr,
		firebaseCollections
	){

		notificationCenterFactory.registerToGetNotifications({
			collection: [
				firebaseCollections.systemMessages
			],
			service: notificationCenterToastr,
			types: [
				'newsMessages',
				'systemMessages'
			]
		});

	})

	.factory(
		'notificationCenterToastr',

		function(
			toastrFactory,
			audioFactory,
			notificationCenterFactory,
			CacheFactory
		){
			var

				cache = CacheFactory(
					'toastsMessagesInfo',
					{
						storagePrefix: 'AnaproAPP-Caches.',
						storageMode: 'localStorage'
					}
				),

				removedIds = cache.get('removedIds') || [],
				registeredToasts = [],
				toastsById = {},

				createToasts = function(messages){
					messages.map(function(message){

						audioFactory.play('system');

						var toast = toastrFactory[message.type];

						if(
							toast
							&&
							registeredToasts.indexOf(message.id) == -1
							&&
							removedIds.indexOf(message.id) == -1
						){

							registeredToasts.push(message.id);

							toastsById[message.id] = toast({
								title: message.title,
								message: message.message,
								autoDismiss: false,
								onTap: message.onTap || null,
								onHidden: function(){

									if(message.onHidden){
										message.onHidden();
									}

									removeById(message.id);
								}
							});

						}
					});
				},

				lookForMessages = function(data){

					Object.keys(data).map(function(key){
						createToasts(data[key]);
					});

				},

				dispatch = function(data){
					console.log([
						'factories.notification-center.toastr.dispatch('
							+ Object.keys(data).join(',')
							+ ')',
						angular.copy(data)
					]);
					lookForMessages(data);
				},

				removeById = function(id){

					removedIds.push(id);

					if(toastsById[id]){
						toastsById[id].scope.close();
						toastsById[id] = null;
						delete toastsById[id];
					}

					cache.put('removedIds', removedIds);
				},

				factory = {
					dispatch: dispatch,
					removeById: removeById
				};

			return factory;
		}
	);

})();
