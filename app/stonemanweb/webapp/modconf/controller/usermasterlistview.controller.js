sap.ui.define([
	  "core/generic/genericentryform",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], 
 function (genericentryform, MessageToast, MessageBox, Controller) {
	"use strict";

        return genericentryform.extend("modconfcontroller.usermasterlistview", {

            onInit: function () {
                genericentryform.prototype.onInit.apply(this, arguments);
                debugger;
            },
            onBeforeShow: function (oEvent) {
                //this.validateAccess();
                  this.FillListView();
                debugger;
                this.initialize();

            },
            initialize: async function () {
                debugger;

                let   _LoginInfo = this.getLoginInfo()
                let userid = _LoginInfo.UserID;
                let userName = _LoginInfo.Username;

                let Desc= _LoginInfo.Username;
                let _AppModel=this.getView().getModel('sysModel');
                _AppModel.setProperty("/userDetails/UserDsc",Desc);
                _AppModel.refresh(true);
            },
            FillListView: async function () {
                            // 2️⃣ Clear previous User data before fetching new one
                            if (this.getView().getModel("User")) {
                                this.getView().getModel("User").setData({ value: [] });
                            }

                            // 3️⃣ Fetch fresh data from backend
                            await this.createNewModelUsingAPI(
                                "GET",
                                `/odata/v4/user-master-services/UserMasterT`,
                                "",
                                "User" // keep model name same as your table binding
                            );

                            // 4️⃣ Get model reference and refresh the UI
                            const oGMCModel = this.getView().getModel("User");
                            oGMCModel.refresh(true);

			},
            onSearchWithName: function (oEvent) {
                    debugger;
			var sQuery = oEvent.getParameter("newValue"); // Get search input
			var filters=[];
			if(sQuery)
			{
				var filter1 = new sap.ui.model.Filter({path:"Description",operator:sap.ui.model.FilterOperator.Contains,value1:sQuery});
				filters=[filter1];
				var finalFilter = new sap.ui.model.Filter({filters:filters, and:false});
		}
		var otable = this.byId("_UserTbl");
		otable.getBinding("items").filter(finalFilter);
    },

            onEditPress: function (oEvent) {
                debugger;
           
					var oButton = oEvent.getSource();
					var oBindingContext = oButton.getBindingContext("User");
					let oRowObject = oBindingContext.getProperty("ID");
                     	var ID="";
                    const oLoginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));

					if (oLoginInfo) {
						oLoginInfo.FormMode = "2";
						oLoginInfo.RowId=oRowObject;
						sessionStorage.setItem("loginInfo", JSON.stringify(oLoginInfo));
					}
                    var router = sap.ui.core.UIComponent.getRouterFor(this);
                     router.navTo("RouterNameUserMasterEntryForm");
                     
				
           
		},
		Addnew: function (oEvent) {
debugger;
            var ID="";
                    const oLoginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));

					if (oLoginInfo) {
						oLoginInfo.FormMode = "3";
						oLoginInfo.RowId="";
						sessionStorage.setItem("loginInfo", JSON.stringify(oLoginInfo));
					}
                    var router = sap.ui.core.UIComponent.getRouterFor(this);
                     router.navTo("RouterNameUserMasterEntryForm");

			
		},
        navBack: function() {
            debugger;
		//	var BPText = this.getView().byId('sideNavigation');
		//	BPText.setVisible(true);
		history.go(-1);
			
			//var router = sap.ui.core.UIComponent.getRouterFor(this);
           // router.navTo("RouteIndex");
		},
		onSearch: function (oEvent) {
			var sQuery = oEvent.getParameter("newValue"); // Get search input
			var filters=[];
			if(sQuery)
			{
				var filter1 = new sap.ui.model.Filter({path:"DocNum",operator:sap.ui.model.FilterOperator.Contains,value1:sQuery});
				filters=[filter1];
				var finalFilter = new sap.ui.model.Filter({filters:filters, and:false});
		}
		var otable = this.byId("Tbl");
		otable.getBinding("items").filter(finalFilter);
    },
            cflForUserCode: async function () {
                this.setCflTitle('Stage Code List');
                await this.createNewModelUsingAPI("GET", "/odata/v4/user-master/userMaster", "", this.getCflListViewDataSourceModelName());
                this.setCflDisplayColumns(["User Code"]);
                this.setCflDataColumns(["UserName"]);
                this.setCflValueAndDisplay("", "", "stglvUserCode", "UserName");
                this.showCfl("stglvUserCode", this.getCflListViewDataSourceModelName(), "value", this.onClosecflForStage.bind(this));
            },
            onClosecflForStage: function () {
                let x = this.getCflObject();
            }
        });
    });
