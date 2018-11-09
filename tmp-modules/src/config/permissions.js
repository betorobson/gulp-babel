'use strict';

(function(){

	angular.module('anaproApp')

	// Permissions disabled and overwritten
	.value(
		'permissionsConfig',

		// all removed or disabled permissions must be listed below
		// you also are able to create new permission
		// key: {removed:true|false, disabled:true|false}
		{
			// custom permissions
			'usr_reports': {removed: false, disabled: true},
			'email_marketing': {removed: false, disabled: true},
			'view.clients': {removed: false, disabled: true},
			'view.calendar': {removed: false, disabled: false},
			'view.realties': {removed: false, disabled: false},
			'view.help': {removed: false, disabled: true},
			'view.settings': {removed: false, disabled: true},
			'view.transactoins.filter.with-tasks': {removed: false, disabled: false},
			'navigation-bar.notifications': {removed: false, disabled: true},
			'card-actions.tour': {removed: false, disabled: true},
			'card-actions.note': {removed: false, disabled: false},
			'card-actions.activity': {removed: false, disabled: false},
			'atd_enviar_sms': {removed: false, disabled: true},
			'atd_voltar_fase': {removed: false, disabled: false},
			'module-sells': {removed: false, disabled: false},

			//existing permissions
		}
	)

	;

})();
