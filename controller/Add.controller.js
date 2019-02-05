sap.ui.define([
	"com/dxc/test/controller/BaseController",
	"com/dxc/test/controller/Validation",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function(BaseController, Validation, JSONModel, MessageToast) {
	"use strict";

	return BaseController.extend("com.dxc.test.controller.Add", {

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
			debugger;
			var oJSONModel = new JSONModel();
			this.getView().byId("tableContacts").setModel(oJSONModel);
			
			// Register to add route matched
			//this.getRouter().getRoute("add").attachPatternMatched(this._onRouteMatched, this);

			//this._iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "addView");

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
		_onRouteMatched: function() {

			// Register for metadata loaded events
			var oModel = this.getModel();
			oModel.metadataLoaded().then(this._onMetadataLoaded.bind(this));

		},

		_onMetadataLoaded: function() {

/*			var oProperties = {
				UserName: "",
				FirstName: "",
				LastName: "",
				Nickname: "",
				EMail: "",
				ContactSet: []
			};*/
			
			// Create new entry in the model
/*			this._oContext = this.getModel().createEntry("/UserSet", {
				properties: oProperties,
				parameters: {
					expand: "ContactSet"	
				},
				success: this._onCreateSuccess.bind(this),
				error: this._onCreateError.bind(this)
			});*/
			
			this._oContext = this.getModel().createEntry("/UserSet", {
				success: this._onCreateSuccess.bind(this),
				error: this._onCreateError.bind(this)
			});

			// Bind the view to the new entry
			this.getView().setBindingContext(this._oContext);

			/*
						// Populate VH used for validation
						this._populateVHArrays();

						// Hide Close Dialog
						if (this.oBusyDialogFlag.addView) {
							this.oBusyDialog.close();
							this.oBusyDialogFlag.addView = false;
						}

						this.getModel("addView").setProperty("/delay", this._iOriginalBusyDelay);*/

		},

		_onCreateSuccess: function(oUser) {
			sap.m.MessageToast.show("Success");

			this.getModel("addView").setProperty("/busy", false);

			// Navigate to the new product's object view
			this.getRouter().navTo("object", {
				objectId: oUser.UserName
			}, true);

			// Unbind the view to not show this object again
			this.getView().unbindObject();

			// Show success message
			var sMessage = this.getResourceBundle().getText("newUserCreated", [oUser.Nickname]);
			MessageToast.show(sMessage, {
				closeOnBrowserNavigation: false
			});

		},

		_onCreateError: function(oData) {
			sap.m.MessageToast.show("Fail");
			/*			this.getModel("addView").setProperty("/busy", false);
						MessageBox.error(this.getResourceBundle().getText("createErrorMessage"));*/
		},

		/**
		 * Event handler for navigating back.
		 * It checks if there is a history entry. If yes, history.go(-1) will happen.
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
		onNavBack: function() {
			Validation.cancelView(this);
		},

		/**
		 *@memberOf com.dxc.test.controller.Object
		 */
		//onSavePress: function(oEvent) {
		onSavePress: function() {
			debugger;
			//var bError = this._validateOnSave();
			//if (!bError) {
			this.getModel("addView").setProperty("/busy", true);
			//this.getModel().submitChanges();
			//} else {
			//	MessageBox.error(this.getResourceBundle().getText("createErrorMessage"));
			//}
			
			var oData = {
				UserName: this.getView().byId("inputUserName").getValue()	
			};
			debugger;
		},
		/**
		 *@memberOf com.dxc.test.controller.Object
		 */
		onCancelPress: function(oEvent) {
			this.onNavBack();
		},

		onAddPress: function(oEvent) {
			if(!this.addDialog) {
				this.addDialog = sap.ui.xmlfragment("com.dxc.test.view.AddDialog", this);
				this.getView().addDependent(this.addDialog);
			}
			
			this.addDialog.open();
			/*
			
			if (!this._oValueHelp[sInputId].valueHelpDialog) {
				this._oValueHelp[sInputId].valueHelpDialog = sap.ui.xmlfragment(this._oValueHelp[sInputId].fragmentXMLView, this);
				this.getView().addDependent(this._oValueHelp[sInputId].valueHelpDialog);
			}

			this._oValueHelp[sInputId].valueHelpDialog.getBinding("items").filter([
				new Filter(this._oValueHelp[sInputId].filterKey, sap.ui.model.FilterOperator.Contains, sInputValue)
			]);

			this._oValueHelp[sInputId].active = true;
			this._oValueHelp[sInputId].valueHelpDialog.open(sInputValue);
*/
		},

		onDeletePress: function(oEvent) {
			alert("Delete Press");
		},
		
		onOKDialog: function(oEvent) {
			debugger;
			var sType = sap.ui.getCore().byId("inputType").getValue(),
				sPhone = sap.ui.getCore().byId("inputPhone").getValue(),
				sUser = this.byId("inputUserName").getValue();
			
			var contactRow = {
				Phone: sPhone,
				Type: sType
			};

			var oModel = this.getView().byId("tableContacts").getModel();
			var oItemData = oModel.getProperty("/data");
			
			if(typeof oItemData === "undefined" || oItemData === null) {
				oItemData = [];
			}
			
			oItemData.push(contactRow);
			oModel.setData({data: oItemData});
			
			this.addDialog.close();
			
		}

	});

});