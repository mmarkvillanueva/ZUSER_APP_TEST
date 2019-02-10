sap.ui.define([
     "sap/ui/core/routing/History",
     "sap/ui/core/ValueState",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
	] , function (History, ValueState, Filter, FilterOperator) {
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

    		},
    		
    		checkUserName: function(oInput, oController) {

				var sValue = oInput.getValue();
				
				// Check Mandatory
				if(sValue) {
					oController._oChecks.userNameMandatory = true;
					oInput.setValueState(ValueState.None).setValueStateText();
				} else {
					oInput.setValueState(ValueState.Error).setValueStateText(oController.getResourceBundle().getText("mandatoryErrorMessage"));
					oController._oChecks.userNameMandatory = false;
					return;
				}
	
				oController.getModel().read("/UserSet/$count", {
					filters: [new Filter("UserName", FilterOperator.EQ, sValue)],
					success: function(oData) {
						if(oData == 0) {
							oController._oChecks.userNameValid = true;
							oInput.setValueState(ValueState.None).setValueStateText();
						} else {
							oInput.setValueState(ValueState.Error).setValueStateText(oController.getResourceBundle().getText("duplicateUserNameErrorMessage"));
							oController._oChecks.userNameValid = false;
						}
					}
				});
    			
    		}

		};

	}
);