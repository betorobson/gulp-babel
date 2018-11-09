
'use strict';

(function(){

	angular.module('anaproApp', [

		// analytics
		'config.analytics',

		// libs
		'ngRoute',
		'ngAnimate',
		'ngMessages',
		'ngCookies',
		'ngPostMessage',
		'ui.utils.masks',
		'ngMask',
		'angular-cache',
		'nya.bootstrap.select',
		'toastr',
		'angular.filter',

		// providers
		'provider.apiToken',
		'provider.path',
		'provider.urls',
		'provider.main-controller',
		'provider.permission',
		'provider.base64',

		//angular-strap
		'mgcrea.ngStrap.popover',
		'mgcrea.ngStrap.datepicker',
		'mgcrea.ngStrap.timepicker',
		'mgcrea.ngStrap.modal',

		// formly
		'anapro.formly',

		// services
		'services.auth',
		'services.clients',
		'services.firebase',
		'services.longpolling',
		'services.queues',
		'services.pending-processing',
		'services.permissions',
		'services.pipelines',
		'services.products',
		'services.transactions',
		'services.users',
		'services.users.status',
		'services.utils',
		'services.calendar',
		'services.schedules',

		// factories
		'factories.audio',
		'factories.auth-cookie',
		'factories.beamer',
		'factories.desktop-notifications',
		'factories.destroy',
		'factories.error-message',
		'factories.http-interceptor',
		'factories.moment',
		'factories.navigationBar',
		'factories.notification-center',
		'factories.toastr',
		'factories.user-status',

		// directives
		'directives.add-client',
		'directives.automate-new-lead',
		'directives.avatar',
		'directives.breadcrumbs',
		'directives.card-actions',
		'directives.card-client-profile',
		'directives.card-followup',
		'directives.chat',
		'directives.client-avatar',
		'directives.client-contact',
		'directives.enriched-person-data',
		'directives.footer',
		'directives.icon-medal',
		'directives.icon-svg',
		'directives.img-src-error-remove',
		'directives.list',
		'directives.list-filter',
		'directives.loading-spinner',
		'directives.mainController',
		'directives.modal',
		'directives.modal-iframe-anapro-v1',
		'directives.navigationBar',
		'directives.notifications-container',
		'directives.perfil',
		'directives.perfil-transactions-summary',
		'directives.permissions',
		'directives.radial-progress',
		'directives.transaction-finish',
		'directives.transaction-transfer',
		'directives.submit-on-enter',
		'directives.user-position-in-queues',
		'directives.user-status-bullet',
		'directives.user-status-switchers',
		'directives.view-title',

		// views
		'views.auth',
		'views.home',
		'views.clients',
		'views.transactions',
		'views.transaction',
		'views.user-profile',
		'views.calendar',
		'views.queues-handler-position',

		// init
		'config.init.token',
		'config.logout'

	]);

})();
