sap.ui.define([
		"com/dxc/test/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("com.dxc.test.controller.NotFound", {

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