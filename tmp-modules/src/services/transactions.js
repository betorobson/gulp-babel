
'use strict';

(function(){

	angular.module('services.transactions',[])

	.factory(

		'transactionsService',

		function(
			$rootScope,
			$http,
			$filter,
			path,
			urls,
			listFactory,
			permission
		){

			var statuses = {
				queue: 'AGUARDANDOATENDIMENTO',
				attended: 'ATENDIDO',
				finished: 'ENCERRADO',
				added: 'INCLUIDO'
			};

			var statusesByFieldValue = (function(){

				var obj = {};

				Object.keys(statuses).map(function(key){
					obj[statuses[key]] = key;
				});

				return obj;

			})();

			var expiresProgressThreshold = {
				33: 'ok',
				66: 'warn',
				100: 'danger'
			};

			var getDefaultParams = function(){

				// [todo] replace by preferences service
				var params = {
					fields: [
						'prospectNome',
						'usuarioNome',
						'canalNome',
						'midiaNome',
						'atendimentoDtAtendido',
						'atendimentoInteracaoUsuarioUltimaData',
						'atendimentoInteracaoUsuarioTipo',
						'atendimentoPipelineStageNome',
						'atendimentoPipelineStageIdGuid'
					],
					limit: $rootScope.mainController.device == 'desktop' ? 15 : 5
				};

				params.fields = JSON.stringify(params.fields);

				return params;

			};

			var get = function(attrs){

				var params = {};

				if(!attrs.link){

					params = getDefaultParams();

					if(attrs.params){
						params = angular.extend(params, attrs.params);
					}

				}else{
					attrs.link = attrs.link.replace(
						/.*?(\?.*?)$/g,
						urls.apiPaths.transactions + '$1'
					);
				}

				$http({
					url: urls.apiHost
						+ (
						attrs.link
							? attrs.link
							: urls.apiPaths.transactions
						),
					method: 'GET',
					params: params,
					toastrMessages: attrs.toastrMessages
				}).then(
					function(response){
						if(typeof attrs.success == 'function'){
							attrs.success(response);
						}
					},
					function(response){
						if(typeof attrs.error == 'function'){
							attrs.error(response);
						}
					}
				);

			};

			var getItem = function(attrs){

				$http({
					url: urls.apiHost + urls.apiPaths.transactions + '/' + attrs.id,
					method: 'GET',
					params: attrs.params,
					toastrMessages: attrs.toastrMessages
				}).then(
					function(response){
						if(typeof attrs.success == 'function'){
							attrs.success(response);
						}
					},
					function(response){
						if(typeof attrs.error == 'function'){
							attrs.error(response);
						}
					}
				);

			};

			var patchItem = function(attrs){

				$http({
					url: urls.apiHost + urls.apiPaths.transactions + '/' + attrs.item.id,
					method: 'PATCH',
					data: attrs.data
				}).then(
					function(response){
						if(typeof attrs.success == 'function'){
							attrs.success(response);
						}
					},
					function(response){
						if(typeof attrs.error == 'function'){
							attrs.error(response);
						}
					}
				);

			};

			var patchList = function(attrs){

				$http({
					url: urls.apiHost + urls.apiPaths.transactions,
					method: 'PATCH',
					data: attrs.items
				}).then(
					function(response){
						if(typeof attrs.success == 'function'){
							attrs.success(response);
						}
					},
					function(response){
						if(typeof attrs.error == 'function'){
							attrs.error(response);
						}
					}
				);

			};

			var gerFilterHashLink = function(path, attrs, routeParams){

				var url = path;

				if(attrs.link && routeParams){
					attrs.params =
						listFactory.getAttrsFromRouteParams(routeParams).params || {};
				}

				url += 'filters/' + listFactory.saveAttrsAndGetHashLink(attrs);

				return url;

			};

			var getJSONFilterFromHref = function(href){

				var json;

				try{
					json = JSON.parse(href.replace(/^.*?filters=(\{.*?\}).*?$/,'$1'));
				}catch(e){
					json = null;
				}

				return json;

			};

			var actions = function(attrs){

				attrs = attrs || {};

				$http({
					url: urls.apiHost
					+ urls.apiPaths.transactions
					+ (attrs.item
							? '/' + attrs.item.id
							: ''
					)
					+ urls.apiPaths.transactionsActions[attrs.action],
					method: attrs.method || 'POST',
					data: attrs.data || {},
					params: attrs.params || {},
					toastrMessages: attrs.toastrMessages
				}).then(
					function(response){
						if(typeof attrs.success == 'function'){
							attrs.success(response);
						}
					},
					function(response){
						if(typeof attrs.error == 'function'){
							attrs.error(response);
						}
					}
				);

			};

			var getPipelines = function(attrs){

				$http({
					url: urls.apiHost
						+ urls.apiPaths.transactions
						+ '/' + attrs.id
						+ urls.getCleanPath(urls.apiPaths.pipelines)
						+ '/' + (attrs.stageId || ''),
					method: 'GET'
				}).then(
					function(response){
						if(typeof attrs.success == 'function'){
							attrs.success(response);
						}
					},
					function(response){
						if(typeof attrs.error == 'function'){
							attrs.error(response);
						}
					}
				);

			};

			var activeOffer = function(attrs){

				var params = {};

				if(attrs.item){
					params['campanhaIdGuid'] = attrs.item.fields.campanhaIdGuid;
				}

				$http({
					url: urls.apiHost
						+ urls.apiPaths.transactionsActiveOffer
						+ (attrs.item
								? '/' + attrs.item.id
								: ''
						),
					params: params,
					method: 'GET',
					toastrMessages:attrs.toastrMessages

				}).then(
					function(response){
						if(typeof attrs.success == 'function'){
							attrs.success(response);
						}
					},
					function(response){
						if(typeof attrs.error == 'function'){
							attrs.error(response);
						}
					}
				);

			};

			var updateItem = function(item, newItem){
				angular.merge(item, newItem);
			};

			var isOnQueue = function(item){
				return item
					.fields
					.atendimento
					.atendimentoStatus == statuses.queue;
			};

			var isFinished = function(item){
				return item
					.fields
					.atendimento
					.atendimentoStatus == statuses.finished;
			};

			var isActive = function(item){

				return item
					.fields
					.atendimento
					.atendimentoStatus == statuses.attended;
			};

			var canEditWhenNotActive = function(item){
				return isActive(item) || permission.checkPermissions('atd_edit_nao_atendido') === true;
			};

			var getTransactionsAwaitingLink = function(){

				return gerFilterHashLink(
					path.getPath('transactions'),
					{
						params: {
							removeFilterWhenEmpty: true,
							q: '',
							filters: {
								atendimentoStatus: statuses.queue
							}
						}
					}
				);

			};

			var calcExpiresTimeInDays = function(item, key){

				item.extraInfo[key] = item.extraInfo[key] || 0;

				if(item.extraInfo[key] > 0){
					return Math.floor(item.extraInfo[key] / 60 / 24);
				}else if(item.extraInfo[key] < 0){
					return 0;
				}

				return item.extraInfo[key];

			};

			var getExpiresTimeInDays = function(item){
				return calcExpiresTimeInDays(
					item,
					'atendimentoExpiracaoAutomaticaQtdMinutosRestantesMax'
				);
			};

			var getExpiresTimeConfInDays = function(item){
				return calcExpiresTimeInDays(
					item,
					'atendimentoExpiracaoAutomaticaQtdMinutosConf'
				);
			};

			var getExpiresText = function(item){

				var days = getExpiresTimeInDays(item);

				return 'Você pode perder esse cliente em <strong>'
				+ days
				+ ' dia'
				+ (days > 1 ? 's ' : ' ')
				+ '</strong> ('
				+ $filter('date')(
					item.extraInfo.atendimentoExpiracaoAutomaticaData,
					'dd/MM/yy HH:mm'
				)
				+ ')<br />'
				+ 'caso você não registre um novo <strong>follow-up</strong> ou <strong>agende</strong> uma próxima<br/>'
				+ 'atividade <strong>(próximo passo)</strong>.';

			};

			var getExpiresProgressThreshold = function(){
				return expiresProgressThreshold;
			};

			var factory = {

				get: get,
				getItem: getItem,
				actions: actions,
				patchItem: patchItem,
				patchList: patchList,
				getDefaultParams: getDefaultParams,
				gerFilterHashLink: gerFilterHashLink,
				getTransactionsAwaitingLink: getTransactionsAwaitingLink,
				getJSONFilterFromHref: getJSONFilterFromHref,
				getPipelines: getPipelines,
				activeOffer: activeOffer,

				statuses: statuses,
				statusesByFieldValue: statusesByFieldValue,
				updateItem: updateItem,
				isOnQueue: isOnQueue,
				isFinished: isFinished,
				isActive: isActive,
				canEditWhenNotActive: canEditWhenNotActive,
				getExpiresTimeInDays: getExpiresTimeInDays,
				getExpiresTimeConfInDays: getExpiresTimeConfInDays,
				getExpiresText: getExpiresText,
				getExpiresProgressThreshold: getExpiresProgressThreshold,

			};

			return factory;
		}
	);

})();
