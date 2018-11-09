
'use strict';

(function(){

	angular.module('factories.destroy',[])

	.factory(

		'destroyFactory',

		function(){

			var cleanUp = function(obj){

				Object.keys(obj).map(function(key){
					if(obj[key]){
						if(obj[key].constructor.name == 'Object'){
							cleanUp(obj[key]);
						}else if(obj[key].constructor.name == 'Array'){
							obj[key].splice(0);
						}else{
							obj[key] = null;
							delete obj[key];
						}
					}
				});

				if(obj.constructor.name == 'Array'){
					obj.splice(0);
				}

			};

			var destroyListener = function(attrs){

				attrs.scope.$on(
					'$destroy', function(){

						attrs.objects.map(cleanUp);

						cleanUp(attrs);

					}
				);

			};

			return destroyListener;
		}
	);

})();
