// Filename: elastic/router.js
define(['backbone'], 
	function(Backbone) {

		// Add capitalize function mixin to Underscore
		_.mixin({ 
			capitalize : function(string) {
				return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
			}
		});

		var Router = Backbone.Router = Backbone.Router.extend({

			currentController: null, 
			currentControllerKey: null, 

			initialize: function() {}, 	

			_bindRoutes: function() {
				if (!this.routes) return;
				var routes = [];
				for (var route in this.routes) {
					routes.unshift([route, this.routes[route]]);
				}

				for (var i = 0, l = routes.length; i < l; i++) {
					this.route(routes[i][0], routes[i][1], this.action);
				}
			},

			route: function(route, name, callback) {
				Backbone.history || (Backbone.history = new Backbone.History);
				if (!_.isRegExp(route)) route = this._routeToRegExp(route);
				if (!callback) callback = this[name];

				Backbone.history.route(route, _.bind(function(fragment) {
			        var map = name.split('#');
					var controllerPath = map[0];
					var methodName = map[1];
					var controllerName = _(controllerPath).capitalize();
					var args = [controllerName, methodName, this._extractParameters(route, fragment)];
					callback && callback.apply(this, args);
			        this.trigger.apply(this, ['route:' + name].concat(args));
			        Backbone.history.trigger('route', this, name, args);
		      	}, this));

		    	return this;
		    },

			action: function(controller, method, args) {
				var _this = this;
				require(['controllers/'+controller], function(Controller) {
					Application.Controllers[controller] = Application.Controllers[controller] || new Controller(args);
					Application.Controllers[controller][method].apply(Application.Controllers[controller], args);
					if(_this.currentControllerKey != controller) {
						_this.trigger('controller:switched', _this.currentController, Application.Controllers[controller]);
						_this.currentController = Application.Controllers[controller];
						_this.currentControllerKey = controller;
					}
				});
			}
		});

		return Router;
	}
);