define([], function() {
	   
	var routes = [                 		
       		{
       			module: 'login',
                  text: 'Selecionar Perfil',
                  view: 'selecionarPerfil', 
                  controller : 'loginController',
                  state : {
                  	name : 'login.selecionar-perfil',
                  },
                  roles: ['*'],
       		}];
	    
	   return routes;
	});