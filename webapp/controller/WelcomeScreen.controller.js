sap.ui.define([
	"com/sap/healtybiker/HealtyBiker/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"com/sap/healtybiker/HealtyBiker/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, History, formatter, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.sap.healtybiker.HealtyBiker.controller.WelcomeScreen", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			this.trigger = "start";
			this.iTripID = 1;

			jQuery(window).bind('beforeunload', function(e) {
				if (this.trigger === "stop") {
					var iTripID = this.iTripID;
					var triggerValue = this.trigger;
					var settings = {
						"async": true,
						"crossDomain": true,
						"url": "/iotgameofcode/v1/api/http/push/fb6e9682-d60b-492a-8a09-aadbea847117",
						"method": "POST",
						"headers": {
							"Content-Type": "text/plain"
						},
						"data": "{\r  \"method\":\"http\", \r  \"sender\":\"IoT App\", \r  \"messageType\":\"7b062f460509846af9ab\",\r  \"messages\": [{tripid: " +
							iTripID + ", trigger: " + triggerValue + "}]\r}\r"
					};
				}
			});
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */

		onTripPress: function(oEvent) {
			var triggerValue;
			var iTripID;
			if (oEvent.getSource().getProperty("text") === "Start Trip") {
				triggerValue = "start";
				this.getView().byId("tripButton").setText("Stop Trip");
			} else if (oEvent.getSource().getProperty("text") === "Stop Trip") {
				triggerValue = "stop";
				this.getView().byId("tripButton").setText("Reset");
			} else if (oEvent.getSource().getProperty("text") === "Reset") {
				this.getView().byId("tripButton").setText("Start Trip");
				return;
			}
			iTripID = this.iTripID;
			var settings = {
				"async": true,
				"crossDomain": true,
				"url": "/iotgameofcode/v1/api/http/push/fb6e9682-d60b-492a-8a09-aadbea847117",
				"method": "POST",
				"headers": {
					"Content-Type": "text/plain"
				},
				"data": "{\r  \"method\":\"http\", \r  \"sender\":\"IoT App\", \r  \"messageType\":\"7b062f460509846af9ab\",\r  \"messages\": [{tripid: " +
					iTripID + ", trigger: " + triggerValue + "}]\r}\r"
			};

			$.ajax(settings).done(function(response) {
				console.log(response);
			});
		},

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

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com-gameofcode-bikerappbikerapp.view.TripOverview
		 */
		onBeforeRendering: function() {
			var oModel;
			oModel = this.getView().getModel();

			oModel.read("/ACME.T_IOT_D225176AE8FB5D12880E", {
				success: function(oData) {
					var oReviewCycleModel = new sap.ui.model.json.JSONModel(oData.results[0]);
					this.getView().setModel(oReviewCycleModel, "iotDataModel");
				}.bind(this),
				error: function(oError) {
					var sResponseText = JSON.parse(oError.responseText);
					jQuery.sap.log.error(sResponseText);
				}.bind(this)
			});
		}

	});
});