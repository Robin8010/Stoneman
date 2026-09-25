sap.ui.define([
	  "core/generic/genericentryform",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], 
 function (genericentryform, MessageToast, MessageBox, Controller) {
	"use strict";
    let globalVarForUserId="";
    let globalVarForUserName="";

        return genericentryform.extend("modconfcontroller.ProcessMapping", {

            onInit: function () {
                genericentryform.prototype.onInit.apply(this, arguments);
                debugger;
            },
            onBeforeShow: async function (oEvent) {
            debugger;
            this.isValidUser();
            this.identifyFormMode(oEvent);
          
             //check FormMode
            const formMode = this.getFormMode();
            const _RoutData = this.getRouteData();
            var abc = _RoutData.uniqueId
            if (formMode != undefined) {

                debugger;
                let ID = _RoutData.uniqueId
                this.setEntryFormDataSourceURLToUpdateData("odata/v4/IBPSServices/IBPC_Line('" + ID + "')");
               
                let oPathSaveReq = jQuery.sap.getModulePath(
                    "stonemanweb",
                    "/modconf/model/IBPCProcessPerameterSaveRequest.json", //Save Request Model
                );

                let oModelSaveRequest = new sap.ui.model.json.JSONModel(oPathSaveReq);
                this.getView().setModel(oModelSaveRequest, "SaveRequest");

debugger;

                this.setEntryFormDataSourceURLForEditMode("/odata/v4/IBPSServices/IBPC_Line('" + ID + "')?$expand=ProcessDetail($expand=ProcessperameterLines)");
                let oPath = jQuery.sap.getModulePath(
                    "stonemanweb",
                    "/modconf/model/IBPCProcessPerameter.json", // Edit Response Model
                );
                let oModel = new sap.ui.model.json.JSONModel(oPath);
                this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
debugger;
                  await this.showEntryForm(formMode);
                  
                //#region  check Entry already exist for this ID
                let oModel1 = this.getView().getModel(this.getEntryFormDataSourceModelName());
                let aProcessDetail = oModel1.getProperty("/ProcessDetail") || [];
                if(aProcessDetail.length>0)
                {

                }
                else
                {
                    await  this.fillHeaderData();
                }

                //#endregion
            }
            else
            {
                var router = sap.ui.core.UIComponent.getRouterFor(this);
                     router.navTo("IBPCEntry");
            }

        },
        fillHeaderData:async function()
        {
            debugger;
            let oModel = this.getView().getModel('sysModel');
                let Row_ID=    oModel.getProperty('/route/routeData/uniqueId');
                let Parent_ID=    oModel.getProperty('/route/routeData/lastUniqueId');
                let Parent_Item=    oModel.getProperty('/route/routeData/ParentItemCode');
                let Child_Item=    oModel.getProperty('/route/routeData/ChildItemCode');


            let oModel1 = this.getView().getModel(this.getEntryFormDataSourceModelName());
                let aProcessDetail = oModel1.getProperty("/ProcessDetail") || [];

                if (aProcessDetail.length === 0) {
                    aProcessDetail.push({});
                }

                aProcessDetail[0].ChildItemCode = Child_Item;
                aProcessDetail[0].ItemCode = Parent_Item;
                aProcessDetail[0].Parent_ID = Parent_ID;
                aProcessDetail[0].Row_ID = Row_ID;

                oModel1.setProperty("/ProcessDetail", aProcessDetail);



                let _model=this.getView().getModel(this.getEntryFormDataSourceModelName())
                 oModel.setProperty("/ProcessDetail/0/ChildItemCode",Child_Item);
                 oModel.setProperty("/ProcessDetail/0/ItemCode",Parent_Item);
                 oModel.setProperty("/ParentID",Parent_ID);
                 oModel.setProperty("/Row_ID",Row_ID);
                 this.IsExistData(Row_ID,Parent_Item,Child_Item);
              
        },
        IsExistData:async function(_ID,Parent_Item,Child_Item)
        {
                   
                // fill Process list
                    await this.createNewModelUsingAPI(
                "GET",`sap/opu/odata4/sap/zorn_sb_prdalc_api/srvd_a2x/sap/zorn_sd_prdalc_api/0001/ZORN_CDS_PrdAlloc_API?$filter=ProductNo eq '${Parent_Item}' and ProductCode eq '${Child_Item}'`,"","Process" 
					);
					// Get Process model
                const oProcessModel = this.getView().getModel("Process");

                // Get response data
                const oData = oProcessModel.getData();
                const aProcessLines = oData.value || [];

                // Entry form model
                const oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());

                // Set property
                oModel.setProperty("/ProcessDetail/0/ProcessperameterLines", aProcessLines);

                    
        },

         isValidUser: function () {
				debugger;
             let   _LoginInfo = this.getLoginInfo()
                 let userid = _LoginInfo.UserID;
                  let userName = _LoginInfo.Username;

                   let Desc= _LoginInfo.Username;
            let _AppModel=this.getView().getModel('sysModel');
            _AppModel.setProperty("/userDetails/UserDsc",Desc);
            _AppModel.refresh(true);
                    debugger;
               
                if (!_LoginInfo || _LoginInfo === 'undefined') {
                    var router = sap.ui.core.UIComponent.getRouterFor(this);
                    router.navTo("RouteIndex");
                    MessageToast.show("Not a valid user.");
                }
                else
                {
                   globalVarForUserId= userName;
				   globalVarForUserName=userName;
                }
            },
            initialize: async function () {
                debugger;
            },
           
            FillListView: async function (sQuery) {
                debugger;
                           

                           let oModel = this.getView().getModel('sysModel');
                            let _ParentItemCode=    oModel.getProperty('/route/routeData/_ParentItemCode');
                            let childItemCode=    oModel.getProperty('/route/routeData/childItemCode');

                            
                            // 3️⃣ Fetch fresh data from backend
                            await this.createNewModelUsingAPI(
                                "GET",
                                `/sap/opu/odata4/sap/zorn_sb_prdalc_api/srvd_a2x/sap/zorn_sd_prdalc_api/0001/ZORN_CDS_PrdAlloc_API?$filter=ProductNo eq 'FSTT-000001' and ProductCode eq 'ZMIR-000009' `,
                                
                                "",
                                "Process" // keep model name same as your table binding
                            );

                            // 4️⃣ Get model reference and refresh the UI
                            const oGMCModel = this.getView().getModel("Process");
                            oGMCModel.refresh(true);

			},
            onSearchWithName: function (oEvent) {
                    debugger;
			var sQuery = oEvent.getParameter("newValue"); // Get search input
			var filters=[];
			if(sQuery)
			{
				var filter1 = new sap.ui.model.Filter({path:"SupplierInvoice",operator:sap.ui.model.FilterOperator.Contains,value1:sQuery});
                var filter2 = new sap.ui.model.Filter({path:"SupplierID",operator:sap.ui.model.FilterOperator.Contains,value1:sQuery});
				filters=[filter1, filter2];
				var finalFilter = new sap.ui.model.Filter({filters:filters, and:false});
		}
		var otable = this.byId("_DebitTbl");
		otable.getBinding("items").filter(finalFilter);
    },

           
	
        navBack: function() {
            debugger;
		 let oModel = this.getView().getModel('sysModel');
                let _ID=    oModel.getProperty('/route/routeData/lastUniqueId');
                
            var router = sap.ui.core.UIComponent.getRouterFor(this);
              this.setRouteData("2", _ID);
                //MessageToast.show("Redirecting to GMC.....")
                router.navTo("IBPCEntry");
		},
         onCancel:function()
        {
              let oModel = this.getView().getModel('sysModel');
                let _ID=    oModel.getProperty('/route/routeData/lastUniqueId');
                
            var router = sap.ui.core.UIComponent.getRouterFor(this);
              this.setRouteData("2", _ID);
                //MessageToast.show("Redirecting to GMC.....")
                router.navTo("IBPCEntry");
        },

          onSave: async function () {
            try {
                debugger;
                    const oModelData = this.getView().getModel(this.getEntryFormDataSourceModelName());
               

                                const modelData = this.getView().getModel(this.getEntryFormDataSourceModelName()).getData();
                                let trgObject = this.getView().getModel("SaveRequest").getData();
                                console.log("Target Object:", trgObject);

                                this.transferObjectValues(modelData, trgObject);
                                await this.onPressOfEntryFormSaveButton(trgObject);
                                let response = this.getApiResponseObject();;
                                if (response.success) {
                                    console.log("No duplicate found. Proceeding with save..okok.");
                                    this.router.navTo(this.getBackwardRoute());
                                    MessageToast.show("Record added successfully");
                                }
            }
            catch (error) {
                MessageBox.show(error.message);
            }
        },
		
           
            onClosecflForStage: function () {
                let x = this.getCflObject();
            },
       
   

        
       


               
      
      

               





        });
    });
