/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"com/sap/healtybiker/HealtyBiker/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"com/sap/healtybiker/HealtyBiker/test/integration/pages/Worklist",
	"com/sap/healtybiker/HealtyBiker/test/integration/pages/Object",
	"com/sap/healtybiker/HealtyBiker/test/integration/pages/NotFound",
	"com/sap/healtybiker/HealtyBiker/test/integration/pages/Browser",
	"com/sap/healtybiker/HealtyBiker/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "com.sap.healtybiker.HealtyBiker.view."
	});

	sap.ui.require([
		"com/sap/healtybiker/HealtyBiker/test/integration/WorklistJourney",
		"com/sap/healtybiker/HealtyBiker/test/integration/ObjectJourney",
		"com/sap/healtybiker/HealtyBiker/test/integration/NavigationJourney",
		"com/sap/healtybiker/HealtyBiker/test/integration/NotFoundJourney",
		"com/sap/healtybiker/HealtyBiker/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});