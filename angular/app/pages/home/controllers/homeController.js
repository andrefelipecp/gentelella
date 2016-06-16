define([ 
        'app'
        ], function(app) {

	app.controller('homeController', ['$scope','comumService', '$timeout','msModalService','$rootScope','$cookies',
	                          function($scope, comumService, $timeout,msModalService,$rootScope,$cookies){
		
		limparMensagens();
		
		$scope.filtro = {};
		
		$scope.transporte = {};
		/**
		 * Metodo que completa o nome do orgão a medida em que o usuario vai digitando
		 */
		$scope.completarOrgaoPorNome = function(nomeParcial) {
			var nomeConsulta = '';
			if(nomeParcial && nomeParcial != null){
				nomeConsulta = nomeParcial.toString().replace(/[^A-Za-z ]/gi, "");
			}

			if(nomeConsulta != '' && nomeConsulta.length >= 3) {
				return comumService.listaOrgaoPorNome(nomeConsulta, 5)
				.then(function(data) {
					return data.resultado;
				});
			} else {
				return [];
			}
		};
		
		/***
		 * Verifica se uma localidade foi selecionada ao perder o foco do campo,
		 * caso nao tenha sido selecionada da lista, resetar o valor
		 */
		$scope.verificaSelecaoOrgao = function(){
			$timeout(function (){
				if(_.isEmpty($scope.rota) || $scope.rota.nome.id == undefined) {
					$scope.rota = null;
				}
			}, 100);
		};

		$scope.rota = {};
		$scope.pessoas = [];
		$scope.empresa = {};
		$scope.veiculo = {};
		
		/**
		 * VERIFICAÇÃO DO LOCAL DE TRABALHO DO USUARIO LOGADO
		 * */
		
		$scope.completarNomeDsei = function(value) {
			
			var nomeConsulta = '';
			if(value && value != null){
				nomeConsulta = value.toString().replace(/[^A-Za-z ]/gi, "");
			}
			
			if(nomeConsulta != '' && nomeConsulta.length >= 3) {
				
				return comumService.listaDseiPorNome(nomeConsulta, 10).then(function(data) {
					return data.resultado;
				});
				
			} else {
				return [];
			}
		};
		
		/***
		 * AutoComplete
		 * Verifica se um nome do DSEI foi selecionada ao perder o foco do campo,
		 * Tendo sido selecionado o dsei, lista todos os casais vinculados com este dsei
		 */
		$scope.selecionarCasaiDaDsei = function(){
			if(_.isEmpty($scope.filtro.dsei) || $scope.filtro.dsei.id == undefined) {
				$scope.filtro.dsei = null;
			} else {
				comumService.listarCasaisPorDsei(($scope.filtro.dsei.id).toString()).then(function(resposta){
					$scope.casais = resposta.resultado;
				});
			}
		};
		
		
		/***
		Selecionar os Polo Base da Dsei selecionada
		 */
		$scope.selecionarPoloBaseDsei = function(){

			if(_.isEmpty($scope.filtro.dsei) || $scope.filtro.dsei.id == undefined) {
				$scope.filtro.dsei = null;
			} else {
				comumService.listarPolosDsei(($scope.filtro.dsei.id).toString()).then(function(resposta){
					$scope.polobases = resposta.resultado;						   
				});
			}
		};
		
		
		/***
		Selecionar os Polo Base da Dsei selecionada
		 */
		$scope.selecionarAldeiaPorPoloBase = function(){
			if(_.isEmpty($scope.filtro.polobase) || $scope.filtro.polobase.id == undefined) {
				$scope.filtro.polobase = null;
			} else {
				comumService.listarAldeiasPolos(($scope.filtro.polobase.id).toString()).then(function(resposta){
					$scope.aldeias = resposta.resultado;
						   
				});
			}
		};
		
		function limparMensagens() {
	    	
			$(".alert-danger").remove();
			$(".alert-success").remove();
			$(".alert-info").remove();
			$(".alert-warning").remove();
		}	
	}]);

	return app;
});