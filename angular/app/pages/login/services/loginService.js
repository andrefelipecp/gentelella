define(['app'], 
		function(app){

	app.factory("loginService", ['$http','$q', 'resourcesService', '$rootScope', '$translatePartialLoader',
	                             function($http, $q, resourcesService, $rootScope, $translatePartialLoader){

		//I18n
		$translatePartialLoader.addPart('login');

		var selecionarPerfil = function(perfil) {
			return resourcesService.login.customPOST(perfil, 'selecionarPerfil');
		};

		var listarUfs = function(){
			return resourcesService.comuns.all("ufs").getList();
		};

		var verificaSituacaoServidorColaborador = function(cpf, perfil){
			var queryParams ={
					'cpf': cpf,
					'perfil': perfil

				};
			return resourcesService.login.customGET("verificaSituacaoServidorColaborador", queryParams);
		};

		return {
			selecionarPerfil : selecionarPerfil,
			verificaSituacaoServidorColaborador : verificaSituacaoServidorColaborador,
			listarUfs : listarUfs
		};
	}]);

	return app;

});