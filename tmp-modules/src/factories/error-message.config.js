
'use strict';

(function(){

	angular.module('factories.error-message.config',[])

	.constant(
		'defaultErrorMessages',
		{
			offline: {
				title: 'Você aparentemente esta sem acesso a internet.',
				message: 'Verifique sua conexão e tente novamente.'
			},
			success: {
				title: 'Operação realizada com sucesso.',
				message: ''
			},
			forbidden: {
				title: 'Permissão negada.',
				message: 'Você não tem permissão para realizar essa operação.'
			},
			payloadError: {
				title: 'Por favor, verifique os dados enviados e tente novamente',
				message: ''
			},
			serverError: {
				title: 'Desculpe, estamos com dificuldades para realizar essa operação.',
				message: 'Tente novamente mais tarde.'
			}
		}
	);

})();
