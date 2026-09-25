sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/base/Log",
	"sap/ui/model/json/JSONModel"
], function(Controller, Log, JSONModel){
	"use strict";

    return Controller.extend("modconfcontroller.Menu", {
        onInit: function(){
			Log.info(this.getView().getControllerName(), "onInit");

		    this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
			this.getOwnerComponent().getRouter().attachBypassed(this._onBypassed, this);

			var oTitlesModel = new JSONModel();
			this.getView().setModel(oTitlesModel, "titleModel");
			this.getOwnerComponent().getRouter().attachTitleChanged(function (oEvent) {
				oTitlesModel.setData(oEvent.getParameters());
			});
		},
        onCollapseExpandPress() {
			const oSideNavigation = this.byId("sideNavigation"),
				bExpanded = oSideNavigation.getExpanded();

			oSideNavigation.setExpanded(!bExpanded);
		},
        _onRouteMatched: function(oEvent) {
			Log.info(this.getView().getControllerName(), "_onRouteMatched");
			var oConfig = oEvent.getParameter("config");

			// select the corresponding item in the left menu
			this.setSelectedMenuItem(oConfig.name);
		},
        setSelectedMenuItem: function(sKey) {
			debugger;
			this.byId("navigationList").setSelectedKey(sKey);
		},
		onHideShowWalkedPress() {
			const oNavListItem = this.byId("walked");
			oNavListItem.setVisible(!oNavListItem.getVisible());
		},
        onItemSelect: function(oEvent) {
			debugger;
			var sKey = oEvent.getParameter("item").getKey();
			Log.info(this.getView().getControllerName(), "onItemSelect Key=" + sKey);

			this.getOwnerComponent().getRouter().navTo(sKey);
		}
    });
});