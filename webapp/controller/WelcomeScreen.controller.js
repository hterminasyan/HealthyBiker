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
			// Stop the current Trip if Window closes
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
			if (oEvent.getSource().getProperty("text") === "Start Trip") {

				this.getView().byId("tripButton").removeStyleClass("buttonAlign");
				triggerValue = "start";
				this.getView().byId("tripButton").setText("Stop Trip");
				this.getView().byId("PMText").setVisible(true);
				this.getView().byId("HealthLevel").setVisible(true);
				this.getView().byId("measurementPM10").setVisible(true);
				this.getView().byId("measurementPM25").setVisible(true);
				this.getView().byId("HealthLevelChart").setVisible(true);
			} else if (oEvent.getSource().getProperty("text") === "Stop Trip") {
				triggerValue = "stop";
				this.getView().byId("tripButton").setText("Reset");
				this.getView().byId("PMText").setVisible(false);
				this.getView().byId("PMTextRecap").setVisible(true);
				this.getView().byId("measurementPM10").setVisible(false);
				this.getView().byId("measurementPM25").setVisible(false);
				this.getView().byId("HealthLevelChart").setVisible(false);
				this.getView().byId("HealthLevelChartAverage").setVisible(true);
				this.getView().byId("averagePM10").setVisible(true);
				this.getView().byId("averagePM25").setVisible(true);
				this._calculateAveragePerTrip();
			} else if (oEvent.getSource().getProperty("text") === "Reset") {

				this.getView().byId("tripButton").addStyleClass("buttonAlign");
				this.getView().byId("PMText").setVisible(false);
				this.getView().byId("averagePM10").setVisible(false);
				this.getView().byId("PMTextRecap").setVisible(false);
				this.getView().byId("averagePM25").setVisible(false);
				this.getView().byId("HealthLevel").setVisible(false);
				this.getView().byId("HealthLevelChartAverage").setVisible(false);
				this.getView().byId("tripButton").setText("Start Trip");
				this.getView().byId("PM10Measurement").setText("");
				this.getView().byId("PM25Measurement").setText("");
				this.getView().byId("averagePM10Measurement").setText("");
				this.getView().byId("averagePM25Measurement").setText("");
				this.iTripID = this.iTripID + 1;
				return;
			}

			var settings = {
				"async": true,
				"crossDomain": true,
				"url": "/iotgameofcode/v1/api/http/push/fb6e9682-d60b-492a-8a09-aadbea847117",
				"method": "POST",
				"headers": {
					"Content-Type": "text/plain"
				},
				"data": "{\r  \"method\":\"http\", \r  \"sender\":\"IoT App\", \r  \"messageType\":\"7b062f460509846af9ab\",\r  \"messages\": [{tripid: " +
					this.iTripID + ", trigger: " + triggerValue + "}]\r}\r"
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
			var oSorter = [new Sorter("C_TRIPID", true)];
			//var oFilter = [new Filter("C_TRIPID", FilterOperator.GE, 1)];

			oModel.read("/ACME.T_IOT_D225176AE8FB5D12880E", {
				sorters: oSorter,
				//filters: oFilter,
				success: function(oData) {
					var oIoTDataModel = new sap.ui.model.json.JSONModel(oData.results[0]);
					this.getView().setModel(oIoTDataModel, "iotDataModelTrip");
					this.iTripID = this.getView().getModel("iotDataModelTrip").getData().C_TRIPID;
					this._getSensorDataForChart();
				}.bind(this),
				error: function(oError) {
					var sResponseText = JSON.parse(oError.responseText);
					jQuery.sap.log.error(sResponseText);
					this.iTripID = 0;
				}.bind(this)
			});
			this.trigger = "start";

		},

		onAfterRendering: function() {
			var that = this;
			window.setInterval(function() {
				that._updateSensorDataForDashboard();
			}, 5000);
		},

		_getSensorDataForChart: function() {
			var oModel;
			var that = this;
			oModel = this.getView().getModel();
			var oSorter = [new Sorter("G_CREATED", true)];
			var oFilter = [new Filter("C_TRIPID", FilterOperator.EQ, that.iTripID)];

			oModel.read("/ACME.T_IOT_D225176AE8FB5D12880E", {
				sorters: oSorter,
				filters: oFilter,
				success: function(oData) {
					var oIoTDataModel = new sap.ui.model.json.JSONModel(oData.results);
					this.getView().setModel(oIoTDataModel, "iotDataModelChart");
				}.bind(this),
				error: function(oError) {
					var sResponseText = JSON.parse(oError.responseText);
					jQuery.sap.log.error(sResponseText);
				}.bind(this)
			});
		},

		_updateSensorDataForDashboard: function() {
			var oModel;
			oModel = this.getView().getModel();
			var oSorter = [new Sorter("G_CREATED", true)];
			var oFilter = [new Filter("C_TRIPID", FilterOperator.GE, 1)];

			oModel.read("/ACME.T_IOT_D225176AE8FB5D12880E", {
				sorters: oSorter,
				filters: oFilter,
				success: function(oData) {
					var oIoTDataModel = new sap.ui.model.json.JSONModel(oData.results[0]);
					this.getView().setModel(oIoTDataModel, "iotDataModel");
					this.getView().byId("PM10Measurement").setText(this.getView().getModel("iotDataModel").getData().C_PM10 + " μg/m³");
					this.getView().byId("PM25Measurement").setText(this.getView().getModel("iotDataModel").getData().C_PM2 + " μg/m³");
					var iHealfLevel = 100 - parseInt(this.getView().getModel("iotDataModel").getData().C_PM2);
					this.getView().byId("HealthLevelChart").setPercentage(iHealfLevel);
					if (iHealfLevel <= 50) {
						this.getView().byId("HealthLevelChart").setValueColor("Error");
					} else if (iHealfLevel > 50) {
						this.getView().byId("HealthLevelChart").setValueColor("Good");
					}
					//this.getView().byId("averagePM10Measurement").setText(this.getView().getModel("iotDataModel").getData().C_PM10 + " μg/m³");
					//this.getView().byId("averagePM25Measurement").setText(this.getView().getModel("iotDataModel").getData().C_PM2 + " μg/m³");
				}.bind(this),
				error: function(oError) {
					var sResponseText = JSON.parse(oError.responseText);
					jQuery.sap.log.error(sResponseText);
				}.bind(this)
			});
		},

		_calculateAveragePerTrip: function() {
			var oModel;
			oModel = this.getView().getModel("iotDataModelChart");
			var data = oModel.getData();
			var averagePM2 = 0;
			var averagePM10 = 0;
			for (var k = 0, n = data.length; k < n; k++) {
				averagePM2 += parseInt(data[k].C_PM2);
				averagePM10 += parseInt(data[k].C_PM10);
			}
			averagePM2 = averagePM2 / n;
			averagePM10 = averagePM10 / n;
			averagePM2 = (parseFloat(averagePM2).toFixed(2));
			averagePM10 = (parseFloat(averagePM10).toFixed(2));
			this.getView().byId("averagePM10Measurement").setText(averagePM2);
			this.getView().byId("averagePM25Measurement").setText(averagePM10);
			var iHealfLevel = 100 - averagePM2;
			this.getView().byId("HealthLevelChartAverage").setPercentage(iHealfLevel);
			if (iHealfLevel <= 50) {
				this.getView().byId("HealthLevelChartAverage").setValueColor("Error");
			} else if (iHealfLevel > 50) {
				this.getView().byId("HealthLevelChartAverage").setValueColor("Good");
			}
			this.getView().byId("PMTextRecap").setText("Recap of  Trip: " + this.iTripID.toString());
		}
	});
});