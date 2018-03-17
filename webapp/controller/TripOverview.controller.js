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

	return BaseController.extend("com.sap.healtybiker.HealtyBiker.controller.TripOverview", {

		formatter: formatter,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com-gameofcode-bikerappbikerapp.view.TripOverview
		 */
		onInit: function() {
			//	var x = "x";
			this.oMap = this.byId("googleMaps");
			var oRootPath = jQuery.sap.getModulePath("com.sap.healtybiker.HealtyBiker");
			var oImageModel = new sap.ui.model.json.JSONModel({
				path: oRootPath
			});

			this.setModel(oImageModel, "imageModel");
			this.showPolyline = true;
		},

		onBeforeRendering: function() {
			var oModel = this.getView().getModel();
			var aFilter = [new Filter("C_TRIPID", FilterOperator.EQ, 1)];

			oModel.read("/ACME.T_IOT_D225176AE8FB5D12880E", {
				filters: aFilter,
				success: function(oData) {
					var oReviewCycleModel = new sap.ui.model.json.JSONModel(oData.results);
					this.getView().setModel(oReviewCycleModel, "iotDataModel");
					this.setupPolylines();
				}.bind(this),
				error: function(oError) {
					var sResponseText = JSON.parse(oError.responseText);
					jQuery.sap.log.error(sResponseText);
				}.bind(this)
			});
		},

		setupPolylines: function() {
			if (this.oMap.getPolylines().length > 0) {
				//return;
				this.oPolyline.destroy();
			}

			var lineSymbol = {
				path: 'M 0,-1 0,1',
				strokeOpacity: 0.5,
				scale: 4
			};
			this.oPolyline = new openui5.googlemaps.Polyline({
				path: this.getPaths(),
				strokeColor: "#0000FF",
				strokeOpacity: 0.5,
				strokeWeight: 0.2,
				visible: this.showPolyline,
				icons: [{
					icon: lineSymbol,
					offset: '0',
					repeat: '10px'
				}]
			});
			this.oMap.addPolyline(this.oPolyline);

		},
		getPaths: function() {
			var aPaths = [];
			this.getView().getModel("iotDataModel").getData().forEach(function(obj) {
				aPaths.push({
					lat: obj.C_LAT,
					lng: obj.C_LONG
				});
			});

			return aPaths;
		},

		onTripChanged: function(oEvent) {

			this.oMap.setZoom(6);
			var oModel = this.getView().getModel();
			var sSelection = oEvent.getSource().getSelectedKey();
			var aFilter = [new Filter("C_TRIPID", FilterOperator.EQ, sSelection)];
			oModel.read("/ACME.T_IOT_D225176AE8FB5D12880E", {
				filters: aFilter,
				success: function(oData) {
					var oReviewCycleModel = new sap.ui.model.json.JSONModel(oData.results);
					this.getView().setModel(oReviewCycleModel, "iotDataModel");
					this.setupPolylines();
				}.bind(this),
				error: function(oError) {
					var sResponseText = JSON.parse(oError.responseText);
					jQuery.sap.log.error(sResponseText);
				}.bind(this)
			});

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com-gameofcode-bikerappbikerapp.view.TripOverview
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com-gameofcode-bikerappbikerapp.view.TripOverview
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com-gameofcode-bikerappbikerapp.view.TripOverview
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