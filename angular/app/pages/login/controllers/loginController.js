define([ 
        'app',
        'pages/utils/menuUtils',
        'pages/login/services/loginService',
        ], function(app, menuUtils) {
	
        
            app.controller('loginController', ['ngTableParams', '$filter', '$scope','msAutenticacaoService', 'msSegurancaService', '$rootScope', '$timeout',
                                               '$validator', '$state', 'msModalService', 'loginService', '$translatePartialLoader','$cookies', 
                                                    function(ngTableParams, $filter, $scope, msAutenticacaoService, msSegurancaService, $rootScope, $timeout, 
                                                $validator, $state, msModalService, loginService, $translatePartialLoader,$cookies){
            	
            		limparMensagens();
            		
            		$scope.possuiVariasEsfera = false;
            		
            		$scope.perfilEscolhido = {};
            		
            		$scope.listaEsferas = [];

            		$scope.listaPerfils = [];
            		
            		var usuariol = {};
            		
        			msAutenticacaoService.recuperarDadosUsuario().then(function(result) {
        				setUsuarioScope(result);
        			}, function(error) {
        				if(error.status === 401
                    			&& msSegurancaService.isUsuarioAutenticado()
                    			&& msSegurancaService.getToken()){
                    		msSegurancaService.setUsuarioAutenticado(false);
                    		$state.go('login');
                    	}
                    });
        			
        			$scope.url_trocar_senha = appConfig.scpa.trocar_senha;
        			$scope.url_novo_usuario = appConfig.scpa.novo_usuario;
        			
            		
            		function setUsuarioScope(usuario){
            			
            			$timeout(function() {
        					msSegurancaService.setUsuario(usuario);
        					$rootScope.isUsuarioAutenticado = true;
        					$rootScope.usuarioAutenticado = usuario;
        					$rootScope.perfilSelecionado = (typeof usuario.perfil != 'undefined');
        					$rootScope.$apply();
        					$scope.listaPerfils = [];
        					$scope.listaPerfils = usuario.perfis;
        					//atualizarTabelaPerfil(usuario);
        					if(!perfilSelecionado(usuario)
             						&& usuario.perfis != null
             						&& usuario.perfis.length > 1){
         						$state.go("login.selecionar-perfil"); 
         					}
        				});
            		}
            		
            		function perfilSelecionado(usuario){
            			
            			return (typeof usuario != 'undefined'
            				&& typeof usuario.perfil != 'undefined'
     						&& usuario.perfil.id != null);
            		}
            		
//            		function atualizarTabelaPerfil(usuario){
//            			
//            			var data = usuario.perfis; 
//    			 		$scope.tabelaPerfil = new ngTableParams({
//		        			page: 1,  
//		        	        count: 30 
//		        		}, {
//				 			counts: [],
//				 			total: (data.length) ? data.length : 0,
//				 			getData: function($defer, params) {
//				 				
//				 				var orderedData = params.sorting() ?
//				 						$filter('orderBy')(data, params.orderBy()) :
//				 							data;
//				 						
//		 						params.total(orderedData.length);
//		 						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
//				 			}
//				 		});
//            		}
            		
            		$scope.formLogin = {
                        email: null,
                        password: null,
                        client_id : 'clientAngularMS',
                        client_secret : 'secret'
                    };
            		            		
                    $scope.login = function() {
          
                    	     
                            if(!appConfig.login) {
                                throw 'Não foi informada uma configuração de login para a aplicação. Vide appConfig(main.js)';
                            }
                            
                            if(msSegurancaService.isUsuarioAutenticado()) {
                                $state.transitionTo(appConfig.login.sucesso);
                            }
                            
                            $validator.validate($scope)
                			.success(function(){
                				         
                				 var senhaCrypto = CryptoJS.SHA256($scope.formLogin.password).toString();

                                 var credentials = {
                                     grant_type : 'password',
                                     client_id : $scope.formLogin.client_id,
                                     client_secret : $scope.formLogin.client_secret,
                                     username : $scope.formLogin.email,
                                     password : senhaCrypto
                                 };
                                 
                				msAutenticacaoService.autenticar(credentials).then(function(msSegurancaService) {
                					
                					msAutenticacaoService.recuperarDadosUsuario().then(function(result) {
                						setUsuarioScope(result);
	                				
	            					 	if(!perfilSelecionado(result)
	                     						&& result.perfis != null
	                     						&& result.perfis.length > 1){
	                 						$state.go("login.selecionar-perfil"); 
	                 					}else{
	                 						$state.go(appConfig.login.sucesso);
	                 					}
                					});
                                
                				}, function(reason) {
                                    $scope.$msAlert.error(reason.data.error_description);
                                }) ;
                			});
                           
                    };
                    
                    $scope.logout = function() {
                        try {
                            msAutenticacaoService.sair().then(function(result) {
                            	$timeout(function() {	                            	                                         		
                            		$rootScope.isUsuarioAutenticado = false;
	            					$rootScope.usuarioAutenticado = {};
	            					$rootScope.perfilSelecionado = false;	            						            				
	            					//Adicionado para a integração do caso de uso solicitacao e agenda.
	            					$rootScope.solicitacao = null;
	            					
	            					$rootScope.$apply();
	                                $state.go('login');
                            	});
                            });
                        }
                        catch(e) {
                            $scope.$msNotify.error(e);
                        }
                    };
                    
                    $scope.editUsuario = function() {
                    	
    					//atualizarTabelaPerfil($rootScope.usuarioAutenticado);
                    	$scope.listaPerfils = [];
                    	$scope.listaPerfils = $rootScope.usuarioAutenticado.perfis;
                		 msModalService.setOptions({
             				title: 'Informações do Usuário',
             				content: '#modalInformacoesUsuario',

             			}).init();
                    };
                    
                    $scope.alterarPerfil = function(perfil) {
                    	
                    	$scope.perfilEscolhido = perfil;
                    	loginService.selecionarPerfil(perfil).then(function(resposta) {
                    		//setUsuarioScope(resposta.resultado.usuario); 
                    		$scope.listaPerfils = resposta.resultado.usuario.perfis;
                    		if(resposta.resultado.usuario.esferaUnica==false){
                    			$scope.possuiVariasEsfera = true;                    			
                    			$scope.listaEsferas=resposta.resultado.usuario.esferasPerfil;                    			
                    			
                    		}else{
                    			setUsuarioScope(resposta.resultado.usuario);                    		
                    			$scope.possuiVariasEsfera = false;                    			
                        		msModalService.close();
                        		$state.transitionTo(appConfig.login.sucesso);
                    		}
                 		
                    		
//	                    	$scope.alterarMenu(obterMenu());
//	                    	$timeout(function(){
//	                    		$scope.$apply();
//	                    	});

                        });
                		
                    };
                    
                    $scope.atualizarPerfil = function(perfil) {
                    	
                    	loginService.selecionarPerfil(perfil).then(function(resposta) {
                    		setUsuarioScope(resposta.resultado.usuario);                    	                    	
                    		$scope.possuiVariasEsfera = false;                    			
                        	msModalService.close();
                        	$state.transitionTo(appConfig.login.sucesso);
                        });
                		
                    };
              
                    $scope.alterarEsfera = function(esfera) {
                    	$scope.perfilEscolhido.esferaSelecionada=esfera;                    	
                    	$scope.perfilEscolhido.isSelecionarEsfera = true;
                    	loginService.selecionarPerfil($scope.perfilEscolhido).then(function(resposta) {
                    	
                    		$scope.listaPerfils = resposta.resultado.usuario.perfis;
							setUsuarioScope(resposta.resultado.usuario);                    		                 			
                        	msModalService.close();
                        	$state.transitionTo(appConfig.login.sucesso);

                        });
                		
                    };
                    
                    $scope.voltar = function() {
                    	
                    	$scope.possuiVariasEsfera = false; 
                    	$scope.listaEsferas=$rootScope.usuarioAutenticado.perfis; 
                    };
                    
    				$scope.selecionarPerfil = function(perfil) {
    					
    					loginService.selecionarPerfil(perfil).then(function(resposta) {
    						
    						menuUtils.adicionarPerfis(resposta.resultado.usuario.perfis, $scope);
    						setUsuarioScope(resposta.resultado.usuario);
//    						var user = resposta.resultado.usuario;
//    						console.log(JSON.stringify(user));
//    						var t = window.btoa(JSON.stringify(user));
//    						console.log(t);
//    						var y = window.atob(t); 
//    						console.log(y);
//    						console.log(JSON.parse(y));
    						$state.transitionTo(appConfig.login.sucesso);

    						$scope.alterarMenu(menuUtils.obterMenu());
    						$timeout(function(){
    							$scope.$apply();
    						});
    						
                        });
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