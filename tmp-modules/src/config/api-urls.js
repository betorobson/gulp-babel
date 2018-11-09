'use strict';

(function(){

	var hostApiFakes = {
		remote: 'https://sheltered-eyrie-99519.herokuapp.com',
		local: 'http://' + location.hostname + ':3000'
	};

	var getHostApiFake = function(){
		return hostApiFakes[window.APIFAKE] || hostApiFakes['remote'];
	};

	angular.module('anaproApp')

		// default prod api URLs
		.value('URLs', {
			apiHost: '',

			apiPaths: {

				// auth
				auth: '/auth/v1/auth',

				// logout
				logout: '/login/v1/logout',

				// utils
				utilsCEP: '/localidades/v1/ceps',
				utilsLocation: {
					base: '/localidades/v1',
					states: '/ufs',
					cities: '/cidades',
					neighborhoods: '/bairros'
				},
				utilsOccupations: '/utils/v1/profissoes',

				// clients: Carteira de clientes
				clients: '/clients/v1/clients',

				// transactions: Negócios
				transactions: '/transactions/v1/transactions',
				transactionsActions: {
					amounts: '/actions/amounts',
					pipelineStage: '/actions/pipelinestage',
					automateLead: '/actions/automate-lead',
					transfer: '/actions/transfer',
					attend: '/actions/attend',
					request: '/actions/request',
					won: '/actions/won',
					lost: '/actions/lost',
					followers: '/actions/followers'
				},

				// transactions/activeoffer: Oferta Ativa
				transactionsActiveOffer: '/transactions/v1/activeoffer',

				// transactions-summary: Resumo de Negócios
				transactionsSummary: '/transactions-summary/v1/transactions-summary',

				// transactions-report: Compromissos e pendências de Negócios
				transactionsReport: '/transactions-report/v1/transactions-report',

				// followups: Tarefas
				followups: '/followups/v1/followups',
				followupsSubTypes: '/followups/v1/interacoestiposub',
				followupsGroupByStatus: '/followups/v1/followups-groupbystatus',
				followupsActions: {
					taskDone: '/actions/task-done',
					reschedule: '/actions/task-reschedule'
				},

				// queues: Fila de atendimento
				queues: '/queues/v1/queues',
				queuesActions: {
					position: '/actions/position'
				},

				//calendar: Agenda
				calendar: '/followups/v1/schedules',

				//schedules: Links de integração para agendas
				schedules: '/schedules/v1/integrationSchedules',

				// users
				users: '/users/v1/users',
				usersServiceChannel: '/servicechannel',
				myUser: '/users/v1/myuser',

				// user profile
				userProfile: '/userprofiles/v1/userprofiles',

				// permissions
				permissions: '/permissions/v1/permissions',

				// pipelines
				pipelines: '/pipelines/v1/pipelines',

				// products
				products: '/products/v1/products',

				// services
				servicesPendingprocessing: '/services/v1/pendingprocessing',
				firebaseToken: '/services/v1/firebase/token',

				// longlopping
				legacyLongPollingPresence: '/legacy/v1/longpolling/presence'

			}
		})

		.value('URLsProduction', {
			maxvendas: '//anapro.crm.anapro.com.br',
			app: location.protocol
				+ '//'
				+ location.hostname.match(/^(.+)\.anapro/)[1]
				+ '.anapro.com.br',
			apiHost: '//api.anapro.com.br/webcrm/webapi/crm/v1',
			// apiHost: '//anapro.azure-api.net/app',
			// ocpApimSubscriptionKey: '8080e97ede474b29ba653fe9520a0053'
		})

		.value('URLsDevelopment', {
			maxvendas: '//testedev.crm.anapro.com.br',
			app: location.protocol
				+ '//'
				+ location.hostname.match(/^(.+)\.anapro/)[1]
				+ (location.port ? ':' + location.port : '' )
				+ '.anapro.com.br',
			apiHost: '//apidev.anapro.com.br/webcrm/webapi/crm/v1'
		})

		.value('URLsDevelopmentLocal', {
			maxvendas: '//testedev.crm.anapro.com.br',
			app: location.protocol
				+ '//appdevlocal.anapro.com.br'
				+ (location.port ? ':' + location.port : '' ),
			apiHost: '//apidev.anapro.com.br/webcrm/webapi/crm/v1'
		})

		// local api URLs
		.value('URLsFake', {
			apiHost: getHostApiFake(),

			apiPaths: {

				// auth
				auth: '/auth',

				// utils
				utilsCEP: '/utils/cep',

				// clients: Carteira de clientes
				clients: '/clients',

				// transactions: Negócios
				transactions: '/transactions/v1/transactions',
				transactionsActions: {
					automateLead: '/actions/automate-lead',
				},

				// transactions-summary: Resumo de Negócios
				transactionsSummary: '/transactions-summary',

				// transactions-report: Compromissos e pendências de Negócios
				transactionsReport: '/transactions-report',

				// followups: Tarefas
				followups: '/followups',
				followupsGroupByStatus: '/followups-groupbystatus',

				// users
				userProfile: '/userprofiles',

				// permissions
				permissions: '/permissions',

				// services
				servicesPendingprocessing: '/services/v1/pendingprocessing',
				firebaseToken: '/services/firebase/token'
			}
		})

	;

})();
