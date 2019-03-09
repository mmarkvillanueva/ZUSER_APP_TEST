sap.ui.define([
	"com/dxc/test/controller/BaseController",
	"com/dxc/test/controller/Validation",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/MessagePopover",
	"sap/m/MessagePopoverItem"
], function(BaseController, Validation, JSONModel, MessageToast, MessageBox, MessagePopover, MessagePopoverItem) {
	"use strict";

	return BaseController.extend("com.dxc.test.controller.Add", {

/*		_oChecks: {
			userNameMandatory: false,
			userNameValid: false
		},*/

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.dxc.test.view.Add
		 */
		onInit: function() {

			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});

			// Required to be able to setData in sap.m.Table
			this.getView().byId("tableContacts").setModel(new JSONModel());

			//this._iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "addView");

			////////// Test Message
/*			var oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor();
			var oMessageManager = sap.ui.getCore().getMessageManager();

			oMessageManager.registerMessageProcessor(oMessageProcessor);

			oMessageManager.addMessages(
				new sap.ui.core.message.Message({
					message: "Something wrong happened",
					type: sap.ui.core.MessageType.Error,
					processor: oMessageProcessor
				})
			);*/

			////////// Test MEssage

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.dxc.test.view.Add
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.dxc.test.view.Add
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.dxc.test.view.Add
		 */
		//	onExit: function() {
		//
		//	}

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */
		/**
		 * Event handler for navigating back.
		 * It checks if there is a history entry. If yes, history.go(-1) will happen.
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
		onNavBack: function() {
			var bTest = Validation.hasInputData(this);
			Validation.cancelView(this);
		},

		/**
		 *@memberOf com.dxc.test.controller.Object
		 */
		onSavePress: function() {

			var that = this;

			// Check if there are validation errors
			if (Validation._messages.length !== 0) {
				//MessageBox.error(that.getResourceBundle().getText("submitErrorMessage"));
				this._toggleMessagePopover(this.getView().byId("messageButton"));
				return;
			}

			//var bError = this._validateOnSave();
			//if (!bError) {
			this.getModel("addView").setProperty("/busy", true);
			//this.getModel().submitChanges();
			//} else {
			//	MessageBox.error(this.getResourceBundle().getText("createErrorMessage"));
			//}
			
			var oData = Validation.getInputData(this);
			
/*			var oData = {
				UserName: this.getView().byId("inputUserName").getValue(),
				FirstName: this.getView().byId("inputFirstName").getValue(),
				LastName: this.getView().byId("inputLastName").getValue(),
				Nickname: this.getView().byId("inputNickname").getValue(),
				EMail: this.getView().byId("inputEmail").getValue(),
				ContactSet: this.getView().byId("tableContacts").getModel().getProperty("/data")
			};*/

			this.getModel().setHeaders({
				"X-Requested-With": "X"
			});

			this.getModel().create("/UserSet", oData, {
				success: function(oData, response) {
					that._onCreateSuccess(oData, response);
				},
				error: function(error) {
					that._onCreateError(error);
				}
			});

		},

		_onCreateSuccess: function(oData, response) {

			this.getModel("addView").setProperty("/busy", false);

			// Navigate to the new product's object view
			this.getRouter().navTo("object", {
				objectId: oData.UserName
			}, true);

			// Unbind the view to not show this object again
			//this.getView().unbindObject();

			// Show success message
			var sMessage = this.getResourceBundle().getText("newUserCreated", [oData.Nickname]);
			MessageToast.show(sMessage, {
				closeOnBrowserNavigation: false
			});
			
			Validation.clearInputData(this);
			
/*			this.getView().byId("inputUserName").setValue();
			this.getView().byId("inputFirstName").setValue();
			this.getView().byId("inputLastName").setValue();
			this.getView().byId("inputNickname").setValue();
			this.getView().byId("inputEmail").setValue();
			this.getView().byId("tableContacts").unbindItems();
*/
		},

		_onCreateError: function(error) {
			this.getModel("addView").setProperty("/busy", false);
			MessageBox.error(JSON.parse(error.responseText).error.message.value);
		},

		/**
		 *@memberOf com.dxc.test.controller.Object
		 */
		onCancelPress: function(oEvent) {
			this.onNavBack();
		},

		onAddPress: function(oEvent) {

			if (!this.addDialog) {
				this.addDialog = sap.ui.xmlfragment("com.dxc.test.view.AddDialog", this);
				this.getView().addDependent(this.addDialog);
			}

			this.addDialog.open();

		},

		onDeletePress: function(oEvent) {
			alert("Delete Press");
		},

		onOKDialog: function(oEvent) {

			var contactRow = {
				Phone: sap.ui.getCore().byId("inputPhone").getValue(),
				Type: sap.ui.getCore().byId("inputType").getSelectedKey()
			};

			var oTable = this.getView().byId("tableContacts");
			var oModel = oTable.getModel();
			var oItemData = oModel.getProperty("/data");

			if (typeof oItemData === "undefined" || oItemData === null) {
				oItemData = [];
			}

			oItemData.push(contactRow);
			oModel.setData({
				data: oItemData
			});

			sap.ui.getCore().byId("inputPhone").setValue();
			this.addDialog.close();

		},

		validateUserName: function(oEvent) {
			Validation.checkUserName(oEvent.getSource(), this);
		},

		onMessagesButtonPress: function(oEvent) {

			this._toggleMessagePopover(oEvent.getSource());

		},
		
		_toggleMessagePopover: function(oMessagesButton) {
			
			if (!this._messagePopover) {
				this._messagePopover = new MessagePopover({
					items: {
						path: "message>/",
						template: new MessagePopoverItem({
							description: "{message>description}",
							type: "{message>type}",
							title: "{message>message}"
						})
					}
				});
				
				oMessagesButton.addDependent(this._messagePopover);

			}
			
			this._messagePopover.toggle(oMessagesButton);
			
		}
		
	});

});