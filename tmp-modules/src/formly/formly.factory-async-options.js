
'use strict';

(function(){

	angular.module('anapro.formly.factory-async-options', [])
		.factory('anaproFormlyFactoryAsyncOptions',

			function(
				utilsService,
				utilsStatesService,
				followupService
			){

				var asyncResources = {

					utilsOccupations: {
						get: utilsService.getOccupations,
						success: function(field, data){

							data.data.map(function(item){
								field.templateOptions.options.push({
									value: item.fields.profissaoIdGuid,
									name: item.fields.profissaoNome
								});
							});

						}
					},

					utilsStates: {
						get: utilsService.getStates,
						success: function(field, data){

							data.data.map(function(item){
								field.templateOptions.options.push({
									value: item.fields.localidadeUF,
									name: utilsStatesService[item.fields.localidadeUF]
								});
							});

						}
					},

					followupsSubTypes: {
						get: followupService.getSubTypes,
						success: function(field, data){

							data.data.map(function(item){
								field.templateOptions.options.push({
									value: item.fields.interacaoTipoSubIdGuid,
									name: item.fields.interacaoTipoSubValor
								});
							});

						}
					}

				};

				var preSuccess = function(){
					this.scope.loading = true;
				};

				var postSuccess = function(){

					if(this.attrs.success){
						this.attrs.success();
					}

					this.scope.loading = false;
				};

				var getAsyncOptions = function(){

					var instance = this;
					var async = this.scope.options.data.async;

					var resource = async.resource,
						success = async.success || asyncResources[resource].success;

					if(asyncResources[resource]){

						preSuccess.apply(instance);

						asyncResources[resource].get({
							success: function(response){
								success(instance.scope.options, response.data);
								postSuccess.apply(instance);
							}
						});

					}

				};

				var getInstance = function(scope){
					return (function(scope){

						var init = function(attrs){

							instance.attrs = attrs || {};

							scope.loading = false;
							scope.options.templateOptions.options = scope.options.templateOptions.options || [];

							if(scope.options.data.async){
								getAsyncOptions.apply(instance);
							}

						};

						var instance = {
							init: init,
							scope: scope
						};

						return instance;

					})(scope);
				};

				var service = {
					getInstance: getInstance
				};

				return service;

			}
		);

})();
