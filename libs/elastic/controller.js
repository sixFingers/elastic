// Filename: elastic/controller.js
define(['backbone'], 
	function(Backbone) {
		var Controller = Backbone.Controller = Backbone.View.extend({
			currentView: false, 

			swapView: function(view, args) {
				if(this.currentView) {
					this.currentView.remove();
					if(this.currentView.leave) 
						this.currentView.leave();
				}

				var $el = $(this.el);
				var _this = this;

				require(['views/'+view], function(view) {
					_this.currentView = new view;
					_this.currentView.render(args);
					$el.empty().append(_this.currentView.el);
					Application.Router.trigger('controller:ready', _this)
					
					if (_this.currentView && _this.currentView.after) {
						_this.currentView.after();
					}
				});
			}
		});

		return Controller;
	}
);