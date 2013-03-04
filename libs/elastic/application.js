// Filename: app.js
var Application;

define(['backbone', 'elastic/router', 'elastic/controller', 'config'], function(Backbone, Router, Controller, config) {
	
	Backbone.Application = Backbone.View.extend({
		Router: new Router({routes: config.routes}),
		Models: {}, 
		Collections: {},
		Views: {},
		Controllers: {},
		Api: config.api, 
		Routes: config.routes, 
		root: config.root, 

		config: function() {
			this.el = $('body');

			/*
				OVERRIDE BACKBONE SYNC TO INCLUDE TOKEN HEADERS
			*/
			Backbone._sync = Backbone.sync;
			_this = this;
			Backbone.sync = function(method, model, options) {
				options =  _.extend({
					timeout: _this.Api.timeout, 
					beforeSend: function(xhr, options) {
						// Wrap into object if necessary
						if(options.wrap != undefined) {
							var data = JSON.parse(options.data);
							var wrapped = {};
							wrapped[options.wrap] = {};

							for(var key in data) {
								if(key != 'url' && key != 'urlRoot')
									wrapped[options.wrap][key] = data[key];
							}
							options.data = JSON.stringify(wrapped);
						};

						// Set auth token if resource is authenticated
						if (options.authenticate) {
							var token = Application.Models.Session.token;
							if(token) {
								xhr.setRequestHeader('HTTP_USER_ACCESS_TOKEN', token);
							} else {
								Application.Models.Session.logout();
							}
						}
					}, 

					statusCode: {
						401: function() {
							// Unauthorized
							Application.Models.Session.logout();
						}, 

						404: function() {
							// Not found
						}, 

						200: function() {
							// Resource loaded successfully
						}
					}, 

					complete: function(xhr, status) {
						if(xhr.responseText == '' || ['', 'timeout', 'abort', 'parsererror'].indexOf(status) > -1) {
							// Network / API error
							Application.trigger('connectionerror', 'connection error');
						} else if(status == 'error') {
							// Auth error
							model.trigger('session:error', JSON.parse(xhr.responseText));
						}
					}, 

					error: function() {
						Application.trigger('connectionerror', 'connection error');
					}
				}, options);
				
				return Backbone._sync(method, model, options);
			};

			/*
				Rewrite authenticated routes
			*/
			var self = this;
			_.each(this.Api.authenticatedRoutes, function(e, i, l) {
				l[i] = self.Api.baseUrl + e;
			});
			return this;
		},

		setup: function() {
			this.config();
			Backbone.history.start();

			$(document).on("click", "a[href]:not([data-bypass])", function(evt) {
				// Get the absolute anchor href.
				var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
				// Get the absolute root.
				var root = location.protocol + "//" + location.host + Application.root;
				
				// Ensure the root is part of the anchor href, meaning it's relative.
				if (href.prop.slice(0, root.length) === root) {
					// Stop the default event to ensure the link will not cause a page
					// refresh.
					evt.preventDefault();

					// `Backbone.history.navigate` is sufficient for all Routers and will
					// trigger the correct events. The Router's internal `navigate` method
					// calls this anyways.  The fragment is sliced from the root.
					Backbone.history.navigate(href.attr, true);
				}
  			});
		}
	});

	Application = new Backbone.Application;
});