
'use strict';

(function(){

	angular.module('services.firebase')

	.provider(
		'firebaseProvider',
		function(){

			var
				self = this,
				firestoreDB,
				token;

			var signout = function(success){
				firebase.auth().signOut().then(function() {

					console.log('firebase: sign out success');

					if(typeof success == 'function'){
						success();
					}

				}).catch(function(error) {
					console.log('firebase: sign out error', error);
				});
			};

			var signin = function(attrs){

				console.log('signin()');

				signout(function(){

					firebase.auth().signInWithCustomToken(token)
						.then(function(){
							console.log(
								'firebase: sign in success',
								'uid: ' + firebase.auth().currentUser.uid
							);

							if(attrs.success){
								attrs.success();
							}

						})
						.catch(function(error){

							console.log('sign in error', error);

							if(attrs.error){
								attrs.error();
							}

						});

				});

			};

			self.setFirestoreDB = function(){
				firestoreDB = firebase.firestore();
			};

			self.getFirestoreDB = function(){
				return firestoreDB;
			};

			self.getCurrentUser = function(){
				return firebase.auth().currentUser;
			};

			var getTokenService;

			var getTokenServiceSuccess = function(response){
				token = response.data.fields.firebaseUserWebToken;
			};

			self.$get = function($rootScope, $timeout){

				var countErrorLimit = 4;

				var getToken = function(attrs){
					getTokenService({
						fromUserProfile: attrs.fromUserProfile,
						success: function(response){
							getTokenServiceSuccess(response);
							signin(attrs);
						}
					});
				};

				var init = function(attrs){

					if(attrs.getToken){
						getTokenService = attrs.getToken;
					}

					var errorInitCallback = attrs.error;

					attrs.error = function(){

						countErrorLimit--;
						attrs.fromUserProfile = false;

						if(countErrorLimit >= 0){
							$timeout(function(){
								getToken(attrs);
							},3000);
						}

						if(errorInitCallback){
							errorInitCallback();
						}

					};

					if(token){
						signin(attrs);
					}else{
						attrs.fromUserProfile = true;
						getToken(attrs);
					}

				};

				self.init = init;
				self.signout = signout;

				return self;

			};

		}
	);

})();
