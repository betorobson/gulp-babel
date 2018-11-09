
'use strict';

(function(){

	angular.module('factories.audio',[])

	.factory(

		'audioFactory',

		function(
			$rootScope,
			$timeout,
			mainController,
			base64,
			toastrFactory,
			desktopNotificationsFactory
		){

			var audioIsReady = false;
			var audioMutedToastNotification;
			var resumeAfterInteractionList = [];

			var playPromiseSuccess = function(){

				console.log(
					'Audio is enabled',
					audioMutedToastNotification
				);

				document.title = document.title.replace(/🔇/g, '');

				audioIsReady = true;

				if(audioMutedToastNotification){
					audioMutedToastNotification.scope.close();
					audioMutedToastNotification = null;
					$rootScope.$digest();
				}

				desktopNotificationsFactory.closeById('audioDisabled');

				runResumeAfterInteraction();

			};

			var runResumeAfterInteraction = function(){
				resumeAfterInteractionList.map(function(func){
					func();
				});
				resumeAfterInteractionList = [];
			};

			var playPromiseError = function(error, resumeAfterInteraction){

				console.error('audio is disabled', error);

				if(document.title.indexOf('🔇') < 0){
					document.title += '🔇';
				}

				if(typeof resumeAfterInteraction == 'function'){
					resumeAfterInteractionList.push(resumeAfterInteraction);
				}

				$timeout(function(){

					if(!audioMutedToastNotification){
						audioMutedToastNotification = toastrFactory.info({
							title: 'O áudio esta desligado.',
							message: 'Clique aqui para ligar.',
							autoDismiss: false,
							closeButton: false,
							iconClass: 'toast-volume-mute',
							tapToDismiss: false,
							onTap: function(){
								play('system');
							}
						});
					}

					if(!document.hasFocus()){

						desktopNotificationsFactory.send({
							tag: 'audioDisabled',
							title: 'Anapro áudio desligado.',
							body: 'Clique aqui para ligar.',
							icon: '/assets/imgs/icons/volume-muted-desktop-notification.png',
							requireInteraction: true,
							callback: function(){
								play('system');
							},
							onshow: function(){
								if(audioIsReady){
									this.close();
								}
							}
						});

					}

				});

			};

			var play = function(name, resumeAfterInteraction){

				var sound = base64.getFilesType('sounds')[name];

				if(!sound){

					console.warn('Sorry, the audio ' + name + ' do not exists within base64 source');

					return;
				}

				var audio = new Audio(sound);
				var audioPromise = audio.play();

				if(audioPromise && mainController.getDevice() == 'desktop'){
					audioPromise
					.then(playPromiseSuccess)
					.catch(
						function(error){
							playPromiseError(error, resumeAfterInteraction);
						}
					);
				}

				return audio;

			};

			$timeout(function(){
				if(base64.getFilesType('sounds')['system']){
					var soundSystem = play('system');
					soundSystem.muted = true;
				}
			}, 5000);

			var factory = {
				play: play
			};

			return factory;
		}
	);

})();
