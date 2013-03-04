define([], function() {
	var config = {
		root: '/', 
		routes: {
			// Home
			'': 						'home#index', 	
			// Landing
			'landing/friwix': 			'home#landing', 
			'landing/business': 		'home#business', 
			// Account
			'account/login': 			'account#login', 
			'account/create': 			'account#register', 
			// Profile
			'profilo': 					'profile#index', 
			'profilo/personale':		'profile#personal', 
			'profilo/contatti':			'profile#contact', 
			'profilo/posizione':		'profile#location', 
			// Contests
			'concorsi': 				'contests#index', 
			'concorsi/:id': 			'contest#home',
			'concorsi/:id/informazioni':'contest#home',
			'concorsi/:id/partecipa': 	'contest#participate', 
			'concorsi/:id/condividi':	'contest#share', 
			'concorsi/:id/premi': 		'contest#prizes',
			'concorsi/:id/commenti':	'contest#comments', 
			'concorsi/:id/:page': 		'contest#page', 
			//'*actions': 'defaultAction'
		}, 

		api: {
			baseUrl: 'http://95.110.169.47:3000/v1/', 
			//baseUrl: 'http://stage.friwix.com/api/v1/', 
			authenticatedRoutes: ['contests'], 
			timeout: 10000
		}
	};

	return config;
});