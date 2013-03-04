define([
	'backbone', 
	'cookie'
	], function(Backbone, Cookie) {

	var sessionModel = Backbone.Model.extend({
		urlRoot: null, 	
		
		authenticated: function() {
			return this.token;
		}, 

		load: function() {
			this.token = $.cookie('access_token');
			this.id = $.cookie('id');
			this.email = $.cookie('email');
			this.name = $.cookie('name');
			this.profile_image = $.cookie('profile_image');
			
			if(this.token)
				this.trigger('session:success');
			else
				this.clearCookies();
		}, 

		clearCookies: function() {
			$.cookie('access_token', null);
			$.cookie('id', null);
			$.cookie('email', null);
			$.cookie('name', null);
			$.cookie('profileimage', null);
			
			this.token = null;
			this.id = null;
			this.email = null;
			this.name = null;
		}, 

		login: function(user) {
			var _this = this;

			this.save(user, {
				wrap: 'user', 
				success: function(model, response) {
					$.cookie('access_token', response.access_token);
					$.cookie('email', response.email);
					$.cookie('name', response.name);
					$.cookie('id', response.id);
					$.cookie('profile_image', response.avatar.avatar.thumb.url);

					_this.load();
				}, 
				error: function(model, response) {
					_this.clear();
					if(response.responseText) {
						// Remote responses
						var response = JSON.parse(response.responseText);
						_this.trigger('session:error', response.error);
					} else {
						// Local validation response
						_this.trigger('session:error', response);
					} 
				}
			});
		}, 

		logout: function() {
			var _this = this;
			this.destroy({
				headers: {HTTP_USER_ACCESS_TOKEN: this.token}
			}).done(function(response) {
				_this.clearCookies();
				_this.clear();
				_this.trigger('session:close', response);
			});
		}, 

		initialize: function(config) {
			this.urlRoot = config.urlRoot;
		}
	});

	return sessionModel;
});