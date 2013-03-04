define([
	'backbone', 
	'validation'
	], function(Backbone, Validation) {

	_.extend(Backbone.Model.prototype, Backbone.Validation.mixin);
	var userModel = Backbone.Model.extend({
		
		register: function(user) {
			var _this = this;

			this.validation = {
				first_name: {
					required: true
				}, 
				last_name: {
					required: true
				}, 
				email: {
					required: true, 
					pattern: 'email'
				}, 
				password: {
					required: true, 
					minLength: 6
				}, 
				password_confirmation: {
					equalTo: 'password', 
					minLength: 6
				}, 
			}, 
			
			this.save(user, {
				wrap: 'user', 
				success: function(model, response) {
					_this.trigger('register:success', response);
				}, 
				error: function(model, response) {
					if(response.responseText) {
						// Remote responses
						var response = JSON.parse(response.responseText);
						_this.trigger('register:error', response.error);
					} else {
						// Local validation response
						_this.trigger('register:error', response);	
					} 
				}
			});
		}, 

		updatePersonal: function(user) {
			this.validation = {
				first_name: {
					required: true
				}, 
				last_name: {
					required: true
				}
			};

			this.update(user);
		}, 

		updateContact: function(user) {
			this.validation = {
				email: {
					required: true, 
					pattern: 'email'
				}
			};

			this.update(user);
		}, 

		update: function(user) {
			var _this = this;
			
			this.save(user, {
				wrap: 'user', 
				authenticate: true, 
				success: function(model, response) {
					_this.trigger('profile:success', response);
				}, 
				error: function(model, response) {
					if(response.responseText) {
						// Remote responses
						var response = JSON.parse(response.responseText);
						_this.trigger('profile:error', response.error);
					} else {
						// Local validation response
						_this.trigger('profile:error', response);	
					} 
				}
			});
		}, 

		initialize: function(config) {
			this.urlRoot = config.urlRoot;
		}
	});

	return userModel;
});