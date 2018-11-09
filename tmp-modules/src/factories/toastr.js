
'use strict';

(function(){

	angular.module('factories.toastr',[])

	.factory(

		'toastrFactory',

		function($rootScope, toastr, defaultErrorMessages){

			var success = function(attrs){
				return toastr.success(
					attrs.message,
					attrs.title,
					angular.merge(
						{
							autoDismiss: true
						},
						attrs,
						(
							typeof attrs.autoDismiss != 'undefined' && !attrs.autoDismiss
							? {timeOut: 0, closeButton: true}
							: {}
						)
					)
				);
			};

			var error = function(attrs){
				return toastr.error(
					attrs.message,
					attrs.title,
					angular.merge(
						{
							timeOut: 0,
							autoDismiss: false,
							closeButton: true,
						},
						attrs
					)
				);
			};

			var warn = function(attrs){
				return toastr.warning(
					attrs.message,
					attrs.title,
					angular.merge(
						{
							timeOut: 0,
							autoDismiss: false,
							closeButton: true,
						},
						attrs,
						(
							attrs.autoDismiss
							? {timeOut: 5000, closeButton: false}
							: {}
						)
					)
				);
			};

			var info = function(attrs){
				return toastr.info(
					attrs.message,
					attrs.title,
					angular.merge(
						{
							autoDismiss: true,
							closeButton: true,
						},
						attrs,
						(
							typeof attrs.autoDismiss != 'undefined' && !attrs.autoDismiss
							? {timeOut: 0}
							: {}
						)
					)
				);
			};

			var setOptionsBeforeShow = function(response, type){

				var configToastrMessage = response.config.toastrMessages[type];

				if(configToastrMessage && configToastrMessage.setOptions){
					angular.merge(
						configToastrMessage,
						configToastrMessage.setOptions(response.data)
					);
				}

			};

			// factories.toastr.success
			$rootScope.$on('factories.toastr.success', function(
				event,
				response
			){

				response.config.toastrMessages = response.config.toastrMessages || {};

				setOptionsBeforeShow(response, 'success');

				success(
					angular.merge(
						{},
						defaultErrorMessages.success,
						response.config.toastrMessages.success || {}
					)
				);

			});

			// factories.toastr.forbidden
			$rootScope.$on('factories.toastr.forbidden', function(
				event,
				response
			){

				response.config.toastrMessages = response.config.toastrMessages || {};

				setOptionsBeforeShow(response, 'forbidden');

				error(
					angular.merge(
						{},
						defaultErrorMessages.forbidden,
						response.config.toastrMessages.forbidden || {}
					)
				);

			});

			// factories.toastr.payloadError
			$rootScope.$on('factories.toastr.payloadError', function(
				event,
				response
			){

				response.config.toastrMessages = response.config.toastrMessages || {};

				setOptionsBeforeShow(response, 'payloadError');

				warn(
					angular.merge(
						{},
						defaultErrorMessages.payloadError,
						response.config.toastrMessages.payloadError || {}
					)
				);

			});

			// factories.toastr.serverError
			$rootScope.$on('factories.toastr.serverError', function(
				event,
				response
			){

				response.config.toastrMessages = response.config.toastrMessages || {};

				setOptionsBeforeShow(response, 'serverError');

				error(
					angular.merge(
						{},
						defaultErrorMessages.serverError,
						response.config.toastrMessages.serverError || {}
					)
				);

			});

			// factories.toastr.offLine
			$rootScope.$on('factories.toastr.offline', function(
				event,
				response
			){

				response.config.toastrMessages = response.config.toastrMessages || {};

				setOptionsBeforeShow(response, 'offline');

				error(
					angular.merge(
						{},
						defaultErrorMessages.offline
					)
				);

			});

			var factory = {
				success: success,
				error: error,
				warn: warn,
				info: info
			};

			return factory;
		}
	);

})();
