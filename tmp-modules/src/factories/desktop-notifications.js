
'use strict';

(function(){

	angular.module('factories.desktop-notifications',[])

	.constant('notificationSupported', !!window.Notification)

	.factory(
		'desktopNotificationsFactory',

		function(
			$rootScope,
			$timeout,
			notificationSupported,
			toastrFactory
		){

			var toast;

			var notificationsById = {};

			var initialPermission;

			if(notificationSupported){
				initialPermission = Notification.permission;
			}

			var helpURL;
			var helpURLs = {
				Chrome: {
					test: /Google/.test(navigator.vendor),
					url: 'https://support.google.com/chrome/answer/114662?hl=pt-BR',
				},
				Firefox: {
					test: /Firefox/.test(navigator.userAgent),
					url: 'https://support.mozilla.org/pt-BR/kb/notificacoes-web-push-firefox',
				},
				Safari: {
					test: /Apple/.test(navigator.vendor),
					url: 'https://support.apple.com/pt-br/guide/safari/sfri40734/mac',
				},
				Edge: {
					test: /Microsoft/.test(navigator.vendor),
					url: 'https://microsoftedgetips.microsoft.com/pt-br/3/45?source=f1'
				}
			};

			Object.keys(helpURLs).map(function(key){
				if(helpURLs[key].test){
					helpURL = helpURLs[key].url;
				}
			});

			var showToast = function(){

				if(document.title.indexOf('🔕') < 0){
					document.title += '🔕';
				}

				var message;

				if(Notification.permission == 'default'){
					message = 'Clique aqui para ativar.<br /><br />Depois clique em permitir na mensagem que apareceu no seu navegador.';
				}else{
					message = 'Você bloqueou as notificações.<br/><br/>Clique aqui para saber como permitir o Anapro App disparar notificações.';
				}

				if(toast){
					toast.scope.close();
					toast = null;
				}

				toast = toastrFactory.info({
					title: 'As suas notificações estão desligadas!',
					message: message,
					autoDismiss: false,
					tapToDismiss: false,
					closeButton: false,
					allowHtml: true,
					iconClass: 'notifications-disabled',
					onTap: function(){
						if(Notification.permission == 'default'){
							hasPermission();
						}else{
							window.open(helpURL);
						}
					}
				});
			};

			var checkPermission = function(permission){

				var permissionValue = permission || Notification.permission;

				if(permissionValue !== 'granted' && !toast){
					showToast();
				}

			};

			var hasPermission = function(callback){

				if(!notificationSupported){
					console.log('Browser does not support Web API Notifications');

					return null;
				}

				checkPermission();

				if(Notification.permission === 'granted'){
					if(callback){
						return callback();
					}
				}else if(Notification.permission !== 'denied'){
					Notification.requestPermission(function(){

						var permission = Notification.permission;

						checkPermission(permission);

						if(permission === 'granted'){

							if(toast){
								document.title = document.title.replace(/🔕/g, '');
								toast.scope.close();
								$rootScope.$digest();
								toast = null;
							}

							if(callback){
								return callback();
							}

						}else if(initialPermission == 'default' && permission == 'denied'){
							showToast();
						}

					});
				}
			};

			var newNotification = function(attrs){

				var notification = new Notification(attrs.title, attrs);

				if(attrs.onshow){
					notification.onshow = attrs.onshow;
				}

				if(attrs.tag){
					notificationsById[attrs.tag] = notification;
				}

				notification.onclick = function(){

					window.focus();

					if(attrs.callback){
						attrs.callback();
					}

					this.close();

				};

				return notification;
			};

			var send = function(attrs){

				return hasPermission(function(){
					return newNotification(attrs);
				});

			};

			var noop = function(){
				console.log('desktop-notifications.noop()');
			};

			var getById = function(id){
				return notificationsById[id];
			};

			var closeById = function(id){

				if(notificationsById[id] && notificationsById[id].close){
					notificationsById[id].close();
					notificationsById[id] = null;
				}

			};

			var factory = {
				getById: getById,
				closeById: closeById,
				send: notificationSupported ? send : noop,
				hasPermission: hasPermission
			};

			return factory;
		}
	);

})();
