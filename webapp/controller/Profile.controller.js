sap.ui.define([
	"com/sap/healtybiker/HealtyBiker/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"com/sap/healtybiker/HealtyBiker/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter"
], function(BaseController, JSONModel, History, formatter, Filter, FilterOperator, Sorter) {
	"use strict";

	return BaseController.extend("com.sap.healtybiker.HealtyBiker.controller.Profile", {

		formatter: formatter,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com-gameofcode-bikerappbikerapp.view.Profile
		 */
		onInit: function() {
			var oRootPath = jQuery.sap.getModulePath("com.sap.healtybiker.HealtyBiker");
			var oImageModel = new sap.ui.model.json.JSONModel({
				path: oRootPath
			});

			this.setModel(oImageModel, "imageModel");
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com-gameofcode-bikerappbikerapp.view.Profile
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com-gameofcode-bikerappbikerapp.view.Profile
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com-gameofcode-bikerappbikerapp.view.Profile
		 */
		//	onExit: function() {
		//
		//	}

		onNavigateActivities: function(oEvent) {
			this.getRouter().navTo("activities");
		},
		onNavigateProfile: function(oEvent) {
			this.getRouter().navTo("profile");
		},
		onNavigateTripOverview: function(oEvent) {
			this.getRouter().navTo("tripoverview");
		},
		onNavigateWelcome: function(oEvent) {
			this.getRouter().navTo("welcomescreen");
		},

		onNavBack: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("overview", true);
			}
		}

	});

});