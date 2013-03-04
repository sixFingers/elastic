// Filename: app.js
define([
	'elastic/application', 
	'views/common/menu', 
	'views/common/sidebar', 
	'models/session', 
	'models/user', 
], function(A, menuView, sidebarView, sessionModel, userModel) {
	
	_.extend(Application, {

		errorModalTemplate: '<div class="modal hide fade">\
								<div class="modal-header">\
    								<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
    								<h3>Ooops!</h3>\
  								</div>\
	  							<div class="modal-body">\
	    							<p><%= error %></p>\
	  							</div>\
							</div>',

		initialize: function() {
			this.setup();

			// Setup session
			Application.Models.Session = new sessionModel({urlRoot: Application.Api.baseUrl + 'session'});
			
			Application.Models.Session.bind('session:success', function() {
				Application.Models.User = new userModel({
					urlRoot: Application.Api.baseUrl + 'users', 
					id: Application.Models.Session.id
				});
			});

			Application.Models.Session.bind('session:close', function() {
				Application.Router.navigate('/account/login', {trigger: true});
			});

			Application.Models.Session.load();

			// Load common views
			Application.Views.Menu = new menuView;
			Application.Views.Menu.render();

			Application.Views.Sidebar = new sidebarView;
			Application.Views.Sidebar.render();

			// Global handlers
			Application.bind('connectionerror', function(error) {
				Application.errorModal(error)
			});

			Application.Router.bind('controller:ready', function() {
				Application.toggleSidebar();
			});
		}, 

		toggleSidebar: function() {
			var controller = Application.Router.currentController;
			if(controller.sidebarLinks)
				Application.Views.Sidebar.render(controller.sidebarLinks);
			
			if(controller.sidebarVisible !== undefined && !controller.sidebarVisible)
				Application.Views.Sidebar.hide();
			else
				Application.Views.Sidebar.show();
		}, 

		errorModal: function(error) {
			$modal = _.template(this.errorModalTemplate, {error: error});
			$(this.el).append($modal);
			$('.modal').modal();
			$('.modal').on('hidden', function() {
				$(this).remove();
				// Reset handler
				Application.bind('connectionerror', function(error) {
					Application.errorModal(error)
				});
			});

			// Remove handler
			Application.unbind('connectionerror');
		}
	});
});