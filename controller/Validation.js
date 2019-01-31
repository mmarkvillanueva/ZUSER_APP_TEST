sap.ui.define([
     "sap/ui/core/routing/History"
	] , function (History) {
		"use strict";

		return {

    		cancelView: function(oController) {
                
                // Discard new product model
                oController.getModel().deleteCreatedEntry(oController._oContext);
                    		    
/*                // Reset all valuestate of input fields
                oController._sInputFields.forEach(function(sInputId) {
                    oController._removeMandatoryError(sInputId);
                });    		    */

                var oHistory = History.getInstance();
                	    
                if(oHistory.getPreviousHash() !== undefined)
                    history.go(-1);
                else
                    oController.getRouter().navTo("worklist", {}, true);

    		}

		};

	}
);