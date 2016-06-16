define([], function() {
   
   var routes = [        
        {
            module: 'home', 
            view: 'home', 
            text: 'Página Inicial',
            roles: ['*']
        } 
    ];
    
   return routes;
});