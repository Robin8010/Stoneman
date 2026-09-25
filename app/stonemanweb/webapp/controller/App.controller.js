sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/base/Log",
"sap/ui/model/json/JSONModel",
"sap/ui/core/Fragment"
], function (Controller,Log, JSONModel, Fragment) {
	"use strict";

  return Controller.extend("stonemanweb.controller.App", {
      onInit() {
      this._loadSysModel();

      //App Controll disable
      var App_Model = { UserBtnEnable: false };

      //enabled="{oAppModel>/UserBtnEnable}"
      //let oModel = new sap.ui.model.json.JSONModel(App_Model)
      //this.getView().setModel(oModel, 'oAppModel');
      //oModel.setProperty("UserBtnEnable", true);
      //oModel.refresh(true);




			this.oMyAvatar = this.oView.byId("myAvatar")

      this._oPopover = Fragment.load({
				id: this.oView.getId(),
				name: "stonemanweb.view.Popover",
				controller: this
			}).then(function(oPopover) {
				this.oView.addDependent(oPopover);
				this._oPopover = oPopover;
			}.bind(this));
      //Fregment



        Log.info(this.getView().getControllerName(), "onInit");

		    this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
			this.getOwnerComponent().getRouter().attachBypassed(this._onBypassed, this);

			var oTitlesModel = new JSONModel();
			this.getView().setModel(oTitlesModel, "titleModel");
			this.getOwnerComponent().getRouter().attachTitleChanged(function (oEvent) {
				oTitlesModel.setData(oEvent.getParameters());
			});
      },
       onAlertPress: function () {
                debugger;
                const oModel = this.getOwnerComponent().getModel("AlertModel");
                           // const oModel = this.getView().getModel("AlertModel");
                            const aMessages = oModel.getProperty("/messages");

                            const oList = new sap.m.List({
                                items: aMessages.map(msg => new sap.m.StandardListItem({
                                    title: msg.title,
                                    info: msg.type
                                }))
                            });

                        new sap.m.Dialog({
                            title: "Notifications",
                            content: [oList],
                            endButton: new sap.m.Button({
                                text: "Close",
                                press: function (oEvent) {
                                    oEvent.getSource().getParent().close();
                                }
                            })
                        }).open();
                    },



      onAvatarPressed: function(oEvent) {
        var oEventSource = oEvent.getSource(),
          bActive = this.oMyAvatar.getActive();
  
        this.oMyAvatar.setActive(!bActive);
  
        if (bActive) {
          this._oPopover.close();
        } else {
          this._oPopover.openBy(oEventSource);
        }
      },
      
      onCollapseExpandPress() {
        const oSideNavigation = this.byId("sideNavigation"),
          bExpanded = oSideNavigation.getExpanded();
  
        oSideNavigation.setExpanded(!bExpanded);
      },
      onListItemPress:function()
      {
        debugger;
          // Clear sessionStorage
            sessionStorage.clear();

            // Clear localStorage (only keys related to app)
            localStorage.removeItem("sap.ushell.UserTileData");

            // Optional: Clear all localStorage (careful!)
            localStorage.clear();
         
              var router = sap.ui.core.UIComponent.getRouterFor(this);
              router.navTo("LoginPage");

 //Reload the page to ensure all data is cleared
              sap.ui.getCore().getConfiguration().setLanguage(
                    sap.ui.getCore().getConfiguration().getLanguage()
                );
                window.location.reload(true);
              

                
               //Blank UserName
                    let _AppModel=this.getView().getModel('sysModel');
                    _AppModel.setProperty("/userDetails/UserDsc",'');
                    _AppModel.refresh(true);
      },
          _onRouteMatched: function(oEvent) {
        Log.info(this.getView().getControllerName(), "_onRouteMatched");
        var oConfig = oEvent.getParameter("config");
  
        // select the corresponding item in the left menu
        this.setSelectedMenuItem(oConfig.name);
      },
          setSelectedMenuItem: function(sKey) {
        this.byId("navigationList").setSelectedKey(sKey);
      },
      onHideShowWalkedPress() {
        const oNavListItem = this.byId("walked");
        oNavListItem.setVisible(!oNavListItem.getVisible());
      },
       _loadSysModel: function () {
      let oModel = new sap.ui.model.json.JSONModel();
      oModel.loadData('model/sysModel.json');
      this.getView().setModel(oModel, 'sysModel');
    },
          onItemSelect: function(oEvent) {
        var sKey = oEvent.getParameter("item").getKey();
        Log.info(this.getView().getControllerName(), "onItemSelect Key=" + sKey);
  
        this.getOwnerComponent().getRouter().navTo(sKey);
      }
     
  });
});