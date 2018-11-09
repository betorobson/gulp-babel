
'use strict';

(function(){

	angular.module('factories.beamer',[])

	.factory(

		'beamerFactory',

		function(
			usersService
		){

			var filters = [];

			var getFilters = function(){
				return filters.join(';');
			};

			var setFilters = function(data){

				if(usersService.isAdm()){
					filters.push('adm');
				}

				filters.push(data.extraInfo.contaSistemaVendasUrl);

			};

			var setConfig = function(attrs){

				if(!window.beamer_config){
					usersService.getUserProfile({
						success: function(response){

							setFilters(response.data);

							window['beamer_config'] = {
								product_id : 'PgCiLFgn5949',
								selector: '#beamer-button',
								lazy: true,
								language: 'PT_BR',
								filters: getFilters(),
								user_id: response.data.id,
								user_firstname: response.data.fields.usuario.usuarioNome,
								user_lastname:  response.data.fields.usuario.usuarioApelido,
								user_email:  response.data.fields.usuario.usuarioEmail,
								callback: function(){

									// remove beamer selector when add on footer
									$('#beamerSelector').remove();
								}
							};

							console.log('factories.beamer.setConfig()');
							console.table(window.beamer_config);

							attrs.success();

						}
					});

				}else{

					attrs.success();

					window['beamer_config']['selector'] = '#beamer-button';

				}

			};

			var beamerInit = function(){

				if($('#beamer-button').is(':visible')){
					Beamer.init();
				}

			};

			var init = function(){
				setConfig({
					success: beamerInit
				});
			};

			var factory = {
				init: init
			};

			return factory;
		}
	);

})();
