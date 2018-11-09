
'use strict';

(function(){

	angular.module('factories.error-message',[
		'factories.error-message.config'
	])

	.factory(

		'errorMessage',

		function(){

			var getErrorType = function(status){

				var type;

				if(!navigator.onLine){
					return 'offline';
				}

				switch(status) {

					case -1:
						type = 'offline';
						break;

					case 401:
						type = 'requestUserAuthentication';
						break;

					case 403:
						type = 'forbidden';
						break;

					case 400:
					case 404:
					case 422:
						type = 'payloadError';
						break;

					case 500:
					default:
						type = 'serverError';
						break;

				}

				return type;

			};

			return {
				getErrorType: getErrorType
			};

		}
	);

})();
