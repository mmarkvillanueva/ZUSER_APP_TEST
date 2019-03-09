sap.ui.define([
	"sap/ui/core/routing/History",
	"sap/ui/core/ValueState",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(History, ValueState, Filter, FilterOperator) {
	"use strict";

	return {

		_messages: [],

		cancelView: function(oController) {

			// Discard new product model
			debugger;
			this.clearInputData(oController);

			/*                // Reset all valuestate of input fields
			                oController._sInputFields.forEach(function(sInputId) {
			                    oController._removeMandatoryError(sInputId);
			                });    		    */

			var oHistory = History.getInstance();

			if (oHistory.getPreviousHash() !== undefined)
				history.go(-1);
			else
				oController.getRouter().navTo("worklist", {}, true);

		},

		checkUserName: function(oInput, oController) {

			var that = this,
				sValue = oInput.getValue();

			this.removeMessage("mandatoryErrorMessage");
			this.removeMessage("duplicateUserNameErrorMessage");
			
			// Check Mandatory
			if (sValue) {
				oInput.setValueState(ValueState.None).setValueStateText();
			} else {
				oInput.setValueState(ValueState.Error).setValueStateText(oController.getResourceBundle().getText("mandatoryErrorMessage"));
				this.appendMessage(oController.getResourceBundle().getText("mandatoryErrorMessage"), sap.ui.core.MessageType.Error, "mandatoryErrorMessage");
				return;
			}

			oController.getModel().read("/UserSet/$count", {
				filters: [new Filter("UserName", FilterOperator.EQ, sValue)],
				success: function(oData) {
					if (oData == 0) {
						oInput.setValueState(ValueState.None).setValueStateText();
					} else {
						oInput.setValueState(ValueState.Error).setValueStateText(oController.getResourceBundle().getText(
							"duplicateUserNameErrorMessage"));
						that.appendMessage(oController.getResourceBundle().getText("duplicateUserNameErrorMessage"), sap.ui.core.MessageType.Error, "duplicateUserNameErrorMessage");
					}
				}
			});

		},
		
		getInputData: function(oController) {
			
			var oData = {
				UserName: oController.getView().byId("inputUserName").getValue(),
				FirstName: oController.getView().byId("inputFirstName").getValue(),
				LastName: oController.getView().byId("inputLastName").getValue(),
				Nickname: oController.getView().byId("inputNickname").getValue(),
				EMail: oController.getView().byId("inputEmail").getValue(),
				ContactSet: oController.getView().byId("tableContacts").getModel().getProperty("/data")
			};
			
			return oData;
			
		},
		
		clearInputData: function(oController) {

			oController.getView().byId("inputUserName").setValue();
			oController.getView().byId("inputFirstName").setValue();
			oController.getView().byId("inputLastName").setValue();
			oController.getView().byId("inputNickname").setValue();
			oController.getView().byId("inputEmail").setValue();
			oController.getView().byId("tableContacts").unbindItems();

		},
		
		hasInputData: function(oController) {
			
			var bHasInputData = false;
			var oData = this.getInputData(oController);
			
			$.each(oData, function(property, value){
				if(value !== "" && value !== undefined) {
					bHasInputData = true;
					return false;
				}
			});
			
			return bHasInputData;
			
		},

		appendMessage: function(sMessage, sType, sError) {

			var oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor(),
				oMessageManager = sap.ui.getCore().getMessageManager();
				
			var oMessage = new sap.ui.core.message.Message({
				message: sMessage,
				type: sType,
				processor: oMessageProcessor
			});
			
			oMessageManager.registerMessageProcessor(oMessageProcessor);
			oMessageManager.addMessages(oMessage);
			this._messages.push({
				name: sError,
				message: oMessage
			});

		},
		
		removeMessage: function(sError) {
			
			var oMessageManager = sap.ui.getCore().getMessageManager();
			
			var	mEntry = this._messages.find(function(entry){
				return entry.name === sError;
			});
			
			if(mEntry !== undefined) {
				oMessageManager.removeMessages(mEntry.message);
			}
			
			this._messages = this._messages.filter(function(entry) {
				return entry.name !== sError ? true : false;
			});
			
		}

	};

});