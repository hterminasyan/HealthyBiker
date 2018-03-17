sap.ui.define([], function() {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},

		pinIcon: function(sValue) {
			if (sValue > 100) {
				return "../ressource/logo1.png";
			} else if (sValue > 50 && sValue <= 100) {
				return "../ressource/logo2.png";
			} else if (sValue > 35 && sValue <= 50) {
				return "../ressource/logo3.png";
			} else if (sValue > 20 && sValue <= 35) {
				return "../ressource/logo4.png";
			} else if (sValue > 0 && sValue <= 20) {
				return "../ressource/logo5.png";
			}

		}

	};

});