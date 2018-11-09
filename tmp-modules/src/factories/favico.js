
'use strict';

(function(){

	angular.module('factories.favico', [])

		.factory(

			'favicoFactory',

			function(
			){

				var bgColors = {
					clients: '#ff5a5f',
					chat: '#348e6d'
				};

				var favicons = [];

				var links = document.querySelectorAll('head link[rel=icon]');

				for(var i=0; i<links.length; i++){

					var image = new Image();
					image.src = angular.element(links[i]).attr('href');

					favicons.push({
						element: links[0],
						image: image
					});
				}

				var getFavico = function(favicon, totalClients){

					var bgColor = totalClients.chat
						? bgColors.chat
						: bgColors.clients;

					if(favicon.favico){
						favicon.favico.reset();
					}

					var favicoObj = new Favico({
						animation:'none',
						bgColor: bgColor,
						element: favicon.element,
						image: favicon.image
					});

					if(totalClients.chat){
						favicoObj.badge(totalClients.chat);
					}else if(totalClients.clients){
						favicoObj.badge(totalClients.clients);
					}

					return favicoObj;

				};

				var set = function(totalClients){
					favicons.map(function(favicon){
						favicon.favico = getFavico(favicon, totalClients);
					});
				};

				return {
					set: set
				};

			});

})();
