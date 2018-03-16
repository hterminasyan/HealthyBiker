sap.ui.define([
		"com/sap/healtybiker/HealtyBiker/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("com.sap.healtybiker.HealtyBiker.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);