
'use strict';

(function(){

	angular.module('factories.auth-cookie',[])

	.factory(

		'authCookieFactory',

		function(
			$rootScope,
			$cookies,
			apiToken,
			urls
		){

			var cookieObj = {
				name: 'mvl3',
				user: (function(){

					var name = 'keyIns';
					var regexp = new RegExp(name + '=((.*?)(&|$))');

					return {
						name: name,
						match: regexp
					};

				})(),
				properties: {
					domain: '.anapro.com.br',
					path: '/'
				}
			};

			var loginUrl = '//login.anapro.com.br/web/pages/login/anapro.aspx';
			var goUrl = (
				/^https/.test(urls.app)
					?
						'https'
					:
						'http'
			)
				+ '%3a%2f%2fcrm.anapro.com.br%2fwebcrm%2fpages%2flogin%2fdefault.aspx';

			var urlAnaproLogin = [
				loginUrl,
				'?sys=SUPERCRM',
				'&returnUrlAnapro=' + urls.app,
				'&goUrl=' + goUrl,
				'&img=http%3a%2f%2fcrm.anapro.com.br%2fwebcrm%2fcontasistema%2fPadrao%2fimagens%2flogo01.jpg&exit=1',
				'&msg=Por+favor%2c+para+acessar+o+sistema+digite+seu+email+e+senha+cadastrado.+Caso+ainda+não+seja+cadastrado+entre+em+contato+com+o+seu+gerente.',
				'&g=6a6b7614-805f-43d6-811f-23a71efb2fe2'
			].join('');

			var get = function(){
				return $cookies.get(cookieObj.name);
			};

			var goToAnaproLogin = function(){
				window.location.replace(urlAnaproLogin);
			};

			var isSameUser = function(token){

				if(cookieObj.user.match.test(token)
					&& cookieObj.user.match.test($cookies.get(cookieObj.name))
				){

					var currentUser = token.match(cookieObj.user.match)[2];
					var newUser = $cookies.get(cookieObj.name)
						.match(cookieObj.user.match)[2];

					return currentUser == newUser;

				}else{
					return false;
				}

			};

			var clear = function(){

				$cookies.remove(
					cookieObj.name,
					cookieObj.properties
				);

				// goToAnaproLogin();
			};

			var checkCookie = function(){

				var hasCookieChangedToOtherUser = false;
				var cacheToken = apiToken.getCache();
				var token = cacheToken.get('token') || {};
				token = token.token || null;

				if(!$cookies.get(cookieObj.name)){

					// goToAnaproLogin();

				}else if(token != $cookies.get(cookieObj.name)){

					if(isSameUser(token)){

						console.log([
							'Token Cookie has been changed however the user is the same, so ',
							'just update the token!'].join('')
						);

						$rootScope.$broadcast('tokenCookieHasBeenChangedButUserIsTheSame');

					}else{

						console.error(
							[
								'Token Cookie has been changed and was detected it is an other',
								' user, so app is redirecting to home'
							].join(''),
							{
								currentLocalStorageToken: token,
								newTokenCookie: $cookies.get(cookieObj.name)
							}
						);

						$rootScope.$broadcast('tokenCookieHasBeenChanged');

						hasCookieChangedToOtherUser = true;

					}

				}

				return hasCookieChangedToOtherUser;

			};

			var factory;

			var noop = function(){
				console.log('factories.auth-cookie.noop()');
			};

			if(window.APIFAKE){
				factory = {
					get: noop,
					checkCookie: noop,
					clear: noop,
					goToAnaproLogin: noop
				};
			}else{
				factory = {
					get: get,
					checkCookie: checkCookie,
					clear: clear,
					goToAnaproLogin: goToAnaproLogin
				};
			}

			return factory;
		}
	);

})();
