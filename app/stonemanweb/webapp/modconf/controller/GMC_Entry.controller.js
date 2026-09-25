//const { debug } = require("@sap/cds");

//const { addRefToWhereIfNecessary } = require("@sap/cds/libx/odata/utils");

sap.ui.define([
    "core/generic/genericentryform",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator"
], function (genericentryform, MessageToast, MessageBox, Controller,BusyIndicator) {
    "use strict";

    //  Shared global variable (same across all instances)
    let globalVarForUserId = "";
    let globalVarForUserName="";
    let globalVarForL2UserId = "";

    return genericentryform.extend("modconfcontroller.GMC_Entry", {
        onInit() {
            genericentryform.prototype.onInit.apply(this, arguments);

        },

        onBeforeShow: async function (oEvent) {
            debugger;
             let loginInfo = this.getLoginInfo();
            let ID=  loginInfo.RowId;
            const formMode = loginInfo.FormMode;

            let userid = loginInfo.Usercode;
            let userName = loginInfo.Username;

            globalVarForUserId= userid;
            globalVarForUserName=userid;

             let Desc= loginInfo.Username;
            let _AppModel=this.getView().getModel('sysModel');
            _AppModel.setProperty("/userDetails/UserDsc",Desc);
            _AppModel.refresh(true);
         
            if (formMode != undefined) {

                debugger;
                
                this.setEntryFormDataSourceURLToUpdateData("/odata/v4/gmcheader-services/GMCHeader('" + ID + "')");
                this.setEntryFormDataSourceURLToAddData("/odata/v4/gmcheader-services/GMCHeader");

                let pathFieldEnable=jQuery.sap.getModulePath
                (
                    "stonemanweb",
                     "/modconf/model/GMCEnableDisable.json", //Field enableDisable Model
                )
                let oPathSaveReq = jQuery.sap.getModulePath(
                    "stonemanweb",
                    "/modconf/model/GMCEntrySaveRequest.json", //Save Request Model
                );
                let omodelEnableDis=new sap.ui.model.json.JSONModel(pathFieldEnable);
                this.getView().setModel(omodelEnableDis,'EnbDisModal')

                let oModelSaveRequest = new sap.ui.model.json.JSONModel(oPathSaveReq);
                this.getView().setModel(oModelSaveRequest, "SaveRequest");



                this.setEntryFormDataSourceURLForEditMode("/odata/v4/gmcheader-services/GMCHeader('" + ID + "')");
                let oPath = jQuery.sap.getModulePath(
                    "stonemanweb",
                    "/modconf/model/GMCEntryForm.json", // Edit Response Model
                );
                let oModel = new sap.ui.model.json.JSONModel(oPath);
                this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());

                await this.showEntryForm(formMode);
               

            }

                if(formMode ==2)
                {
                            debugger;
                       await     this.handleUIOperation();
                        await     this.fillInspectionType();
                            this.fieldEnalbe()             
                }
                if(formMode ==3)
                {
                    await this.getmaxKey();
                     this.fillInspectionType();
                }


        },
       getmaxKey :async function()
        {
             let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            debugger;
            await this.createNewModelUsingAPI(
                'GET',
                  `/odata/v4/maxkey/GMCHeaderMax`,
                '',
                'Maxkey'
            );
            const data = this.getView().getModel('Maxkey').getData();//Uncomment when API run


            const { value = [] } = data || {};

            viewModel.setProperty("/GMCNo", []); // clear array
            viewModel.setProperty("/GMCNo", value[0].MaxGMCNo);
            viewModel.refresh(true);
        },
         handleFormInEditMode: function () {
            let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            oModel.setProperty("/disableUsername", false);
        },

        cflForPurchaseorder: async function () {
            try {
                debugger;
                 let loginInfo = this.getLoginInfo();
            const formMode = loginInfo.FormMode;
                if(formMode ==3)
                {
                    await this.getmaxKey();
                }


               // //Already saved value get api
             //    await this.createNewModelUsingAPI(
             //   'GET',
             //   `odata/v4/gmcheader-services/GMCHeader`,
              //  '',
              //  'SavedInfo'
         //   );
          //  debugger
           // let odata = this.getView().getModel('SavedInfo');//Uncomment when API run
          //  let fullArray = odata.getProperty("/value");
          //  let jobworkPoArray = fullArray.map(item => item.JobworkPo);


               debugger;
             //   var filterString = jobworkPoArray.map(id => `PurchaseOrder ne '${id}'`).join(' and ');
            var   filterString=`Quantity gt 0 and UOM eq 'PC' and YY1_Supervisor_PDI  eq '${globalVarForUserName }'`;
           //  var   filterString=`Quantity gt 0 and UOM eq 'PC' and PurchaseOrder eq '2500000633' `;
                await this.createNewModelUsingAPI(
                    'GET',
                    //`/sap/opu/odata4/sap/zune_sb_porreport_api/srvd_a2x/sap/zune_sd_zune_dd_po_prodord/0001/ZUne_DD_PO_ProdOrd?$format=json`,
                    `/sap/opu/odata4/sap/zune_sb_porreport_api/srvd_a2x/sap/zune_sd_zune_dd_po_prodord/0001/ZUne_DD_PO_ProdOrd?$filter=${filterString}&$top=10000&$format=json`,
                    '',
                    this.getCflListViewDataSourceModelName()
                );
                this.setCflDisplayColumns(["PurchaseOrder"]);
                this.setCflDataColumns(["PurchaseOrder"]);
                this.setCflValueAndDisplay("Purchase Order", "PurchaseOrder", "", "");

                MessageToast.show("Data loading please wait...");

                this.showCfl(
                    "PurchaseOrder",
                    this.getCflListViewDataSourceModelName(),
                    "value",
                    this.onConfirmInspectionLot.bind(this)
                );
            }
            catch (error) {
                MessageBox.show("cflForPurchaseOrder -: " + error.message);
            }
        },
        ChangeJobWork: function () {
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            let InspectionLot = viewModel.getProperty(`/value`);
            viewModel.setProperty(`/JobworkPo`, x.PurchaseOrder);
            viewModel.setProperty(`/SKU`, x.POMaterial);
            
            viewModel.setProperty(`/SONO`, x.SalesOrder);
            viewModel.setProperty(`/ContractNM`, x.SupplierName);
            viewModel.setProperty(`/SuperwiserNM`, x.YY1_SupervisorName_PDI);
            viewModel.setProperty(`/SFGDsc`, x.PODescription);
            viewModel.setProperty(`/POQty`, x.OrderQuantity);
            viewModel.setProperty(`/PlantNM`, x.Plant);
           // viewModel.setProperty(`/VendorCode`, x.SupplierID); commented input provide by uday

            viewModel.refresh(true);

            this.FillStoragelocation();

        },

        onConfirmInspectionLot:async function () {
            debugger;
            let x = this.getCflObject();
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            viewModel.setProperty(`/JobworkPo`, x.PurchaseOrder);
            viewModel.setProperty(`/PlantNM`, x.Plant);
            viewModel.setProperty(`/FloorNM`, x.StorageLocation);
            viewModel.setProperty(`/SKU`, x.FGItem);
            viewModel.setProperty(`/SONO`, x.SalesOrder);
             viewModel.setProperty(`/VendorCode`, x.SupplierID);
              viewModel.setProperty(`/PODescription`, x.PODescription);
            //
            viewModel.setProperty(`/ManualSalesOrderItemCode`, x.ManualSalesOrderItemCode);
            viewModel.setProperty(`/ContractNM`, x.SupplierName);
            viewModel.setProperty(`/SuperwiserNM`, x.YY1_SupervisorNameCust_PDI);
            viewModel.setProperty(`/SFGDsc`, x.ProductionOrd_Product);
            viewModel.setProperty(`/POQty`, x.OrderQuantity);

            viewModel.refresh(true);

          await  this.FillStoragelocation();
          await  this.FillFromprocess();
        //  await this.FillFromSuperWiser();
            this.FillToprocess();
             this.Plant();
              this.FillProductionAccount();
                 // 
          
          
        },
        ShiftChanges:function(oEvent)
        {
            debugger;
              let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
             var oCombo = oEvent.getSource();
            var sSelectedKey = oCombo.getSelectedKey();
           // console.log("Selected Key:", sSelectedKey);

            // Update the model property explicitly (optional, it's already bound)
          //  this.getView().getModel("EntryFormDataSourceModel").setProperty("/ShiftTime", sSelectedKey);
             this.FillQAL1Approval();
        },
         ToShiftChanges:async function()
        {
              let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            viewModel.setProperty("/NPlantName", ""); // clear current plant name
               await this.ToPlant();
               // await this.FillToStorageLocation();
               
        },
        ToPlantSelection:async function()
        { 
            debugger
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
             viewModel.setProperty("/NFloorName", "");
            this.FillToStorageLocation();
        },
        ToStorageSelection:async function()
        {
            debugger;
             let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
              viewModel.setProperty("/NContractCode", "");
              viewModel.setProperty("/NQAName", "");
              viewModel.setProperty("/NSuperwiserName", "");
             await this.ContractorName();
               await  this.FillQAL2Approval();
               await this.FillToSuperWiser();
        },

        onToContractorSelect:async function () {
              let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            viewModel.setProperty("/NSuperwiserName", "");
                await  this.FillToSuperWiser();
             
        },

      isValidUser: function () {
				debugger;
             let   _LoginInfo = this.getLoginInfo()
                 let userid = _LoginInfo.UserID;
                  let userName = _LoginInfo.Username;
                    debugger;
               
                if (!_LoginInfo || _LoginInfo === 'undefined') {
                    var router = sap.ui.core.UIComponent.getRouterFor(this);
                    router.navTo("RouteIndex");
                    MessageToast.show("Not a valid user.");
                }
                else
                {
                   globalVarForUserId= userid;
				   globalVarForUserName=userid;
                }
            },
        onCancel:function()
        {
            var router = sap.ui.core.UIComponent.getRouterFor(this);
                //MessageToast.show("Redirecting to GMC.....")
                router.navTo("GoodsMChallan");
        },
        handleUIOperation: async function () {
            debugger;
            let oModel = this.getView().getModel('EnbDisModal');
           oModel.setProperty('/BtnRejectEnable', false)
            oModel.setProperty('/BtnApproveEnable', false)
            oModel.setProperty('/BtnPostEnable',false);
            oModel.setProperty('/BtnSubmitEnable',false);
            oModel.setProperty('/BtnPrintEnable',false);

            this.FillStoragelocation();
            this.FillFromprocess();
            this.FillToprocess();
            this.FillQAL1Approval();
              this.FillProductionAccount();

           this.ToPlant();
            this.FillToStorageLocation();
      await   this.ContractorName();
      await this.FillQAL2Approval();
    await  this.FillToSuperWiser();

         
           


        },
        fieldEnalbe: async function () {
            debugger;
           	 let   _LoginInfo = this.getLoginInfo()
                 let usertype = _LoginInfo.UserType;
            if (usertype == "CR") {
                 let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                let Creater=    viewModel.getProperty('/Creater')
                let SuperWiser=    viewModel.getProperty('/NSuperwiserName')
                if(Creater==globalVarForUserId)
                {

                let oModel = this.getView().getModel('EnbDisModal');
                oModel.setProperty('/GMCNo', false)
                oModel.setProperty('/JobworkPo', true)
                oModel.setProperty('/SKU', false)
                oModel.setProperty('/SONO', false)
                oModel.setProperty('/ContractNM', false)
                oModel.setProperty('/SuperwiserNM', false)
                oModel.setProperty('/FromProcess', false)
                oModel.setProperty('/ToProcess', false)
                oModel.setProperty('/ProductionAccountant', false)
                oModel.setProperty('/SFGDsc', false)
                oModel.setProperty('/POQty', false)
                oModel.setProperty('/PlantNM', false)
                oModel.setProperty('/FloorNM', false)
                oModel.setProperty('/QANM', false)
                oModel.setProperty('/CycleTime', false)
                oModel.setProperty('/ShiftTime', false)
                oModel.setProperty('/PalletNumber', false)
                oModel.setProperty('/GMCQty', true)
                oModel.setProperty('/PlecesWeight', true)
                oModel.setProperty('/QADocumentNum', false)
                 oModel.setProperty('/InspectionType', false)
                oModel.setProperty('/TotalWeight', false)
                oModel.setProperty('/Remarks', false)
                oModel.setProperty('/StatusRemarks', false)
                oModel.setProperty('/NSuperwiserName', false)
                oModel.setProperty('/NQAName', false)
                oModel.setProperty('/NContractName', false)
                oModel.setProperty('/NPlantName', false)
                oModel.setProperty('/NFloorName', false)
                oModel.setProperty('/BtnRejectEnable', false)
                oModel.setProperty('/BtnApproveEnable', false)
                oModel.setProperty('/BtnPostEnable',false);
                 oModel.setProperty('/BtnSubmitEnable',true);
                 oModel.setProperty('/BtnPrintEnable',true);

                  //Submit button still Enable if document not approve yet
                              
                                let oModel1 = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    
                                var Status=oModel1.getProperty('/FirstLevelStatus');
                                if(Status!="Approve")
                                {
                                    oModel.setProperty('/BtnSubmitEnable', true);
                                      oModel.setProperty('/GMCQty', true)
                                        oModel.setProperty('/PlecesWeight', true)
                                        oModel.setProperty('/JobworkPo', true)
                                }
                                else
                                {
                                    oModel.setProperty('/BtnSubmitEnable', false)
                                      oModel.setProperty('/GMCQty', false)
                                        oModel.setProperty('/PlecesWeight', false)
                                        oModel.setProperty('/JobworkPo', false)
                                }
                                 this.getView().setModel(oModel,'EnbDisModal');
                     }
                    else  if(SuperWiser==globalVarForUserId)
                   {
                     let oModel = this.getView().getModel('EnbDisModal');
                oModel.setProperty('/GMCNo', false)
                oModel.setProperty('/JobworkPo', false)
                oModel.setProperty('/SKU', false)
                oModel.setProperty('/SONO', false)
                oModel.setProperty('/ContractNM', false)
                oModel.setProperty('/SuperwiserNM', false)
                 oModel.setProperty('/CycleTime', false)
                oModel.setProperty('/PalletNumber', false)
                 oModel.setProperty('/CycleTime', false)
                oModel.setProperty('/PalletNumber', false)
                oModel.setProperty('/FromProcess', false)
                oModel.setProperty('/ToProcess', false)
                oModel.setProperty('/ProductionAccountant', false)
                oModel.setProperty('/SFGDsc', false)
                oModel.setProperty('/POQty', false)
                oModel.setProperty('/PlantNM', false)
                oModel.setProperty('/FloorNM', false)
                oModel.setProperty('/QANM', false)
                oModel.setProperty('/GMCQty', false)
                oModel.setProperty('/PlecesWeight', false)
                oModel.setProperty('/QADocumentNum', true)
                 oModel.setProperty('/InspectionType', true)
                oModel.setProperty('/TotalWeight', false)
                oModel.setProperty('/Remarks', false)
                oModel.setProperty('/NSuperwiserName', false)
                oModel.setProperty('/NQAName', false)
                oModel.setProperty('/NContractName', false)
                oModel.setProperty('/NPlantName', false)
                oModel.setProperty('/NFloorName', false)
                 oModel.setProperty('/CycleTime', false)
                oModel.setProperty('/ShiftTime', false)
                oModel.setProperty('/PalletNumber', false)
                oModel.setProperty('/BtnRejectEnable', true)
                oModel.setProperty('/BtnApproveEnable', true)
                oModel.setProperty('/BtnPostEnable',false);
                oModel.setProperty('/BtnSubmitEnable',false);
                 oModel.setProperty('/BtnPrintEnable',true);
                this.getView().setModel(oModel,'EnbDisModal');
                }
            }
            if (usertype == "S") {
                let oModel = this.getView().getModel('EnbDisModal');
                oModel.setProperty('/GMCNo', false)
                oModel.setProperty('/JobworkPo', false)
                oModel.setProperty('/SKU', false)
                oModel.setProperty('/SONO', false)
                oModel.setProperty('/ContractNM', false)
                oModel.setProperty('/SuperwiserNM', false)
                 oModel.setProperty('/CycleTime', false)
                oModel.setProperty('/PalletNumber', false)
                 oModel.setProperty('/CycleTime', false)
                oModel.setProperty('/PalletNumber', false)
                oModel.setProperty('/FromProcess', false)
                oModel.setProperty('/ToProcess', false)
                oModel.setProperty('/ProductionAccountant', false)
                oModel.setProperty('/SFGDsc', false)
                oModel.setProperty('/POQty', false)
                oModel.setProperty('/PlantNM', false)
                oModel.setProperty('/FloorNM', false)
                oModel.setProperty('/QANM', false)
                oModel.setProperty('/GMCQty', false)
                oModel.setProperty('/PlecesWeight', false)
                oModel.setProperty('/QADocumentNum', true)
                 oModel.setProperty('/InspectionType', true)
                oModel.setProperty('/TotalWeight', false)
                oModel.setProperty('/Remarks', false)
                oModel.setProperty('/NSuperwiserName', false)
                oModel.setProperty('/NQAName', false)
                oModel.setProperty('/NContractName', false)
                oModel.setProperty('/NPlantName', false)
                oModel.setProperty('/NFloorName', false)
                 oModel.setProperty('/CycleTime', false)
                oModel.setProperty('/ShiftTime', false)
                oModel.setProperty('/PalletNumber', false)
                oModel.setProperty('/BtnRejectEnable', true)
                oModel.setProperty('/BtnApproveEnable', true)
                oModel.setProperty('/BtnPostEnable',false);
                oModel.setProperty('/BtnSubmitEnable',false);
                 oModel.setProperty('/BtnPrintEnable',true);
                this.getView().setModel(oModel,'EnbDisModal');
            }

            if (usertype == "L1") {
                debugger;
                 let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
               let oModel = this.getView().getModel('EnbDisModal');
                let IsQA1=    viewModel.getProperty('/QANM')
                let IsQA2=    viewModel.getProperty('/NQAName')
                let L1Approver=    viewModel.getProperty('/FirstLevelStatus')
                if(IsQA1==globalVarForUserId)
                {

                oModel.setProperty('/GMCNo', false)
                oModel.setProperty('/JobworkPo', false)
                oModel.setProperty('/SKU', false)
                oModel.setProperty('/SONO', false)
                oModel.setProperty('/ContractNM', false)
                oModel.setProperty('/SuperwiserNM', false)
                oModel.setProperty('/FromProcess', false)
                 oModel.setProperty('/CycleTime', false)
                  oModel.setProperty('/CycleTime', false)
                oModel.setProperty('/ShiftTime', false)
                oModel.setProperty('/PalletNumber', false)
                oModel.setProperty('/PalletNumber', false)
                oModel.setProperty('/ToProcess', false)
                oModel.setProperty('/ProductionAccountant', false)
                oModel.setProperty('/SFGDsc', false)
                oModel.setProperty('/POQty', false)
                oModel.setProperty('/PlantNM', false)
                oModel.setProperty('/FloorNM', false)
                oModel.setProperty('/StatusRemarks', true)
                oModel.setProperty('/QANM', false)
                oModel.setProperty('/GMCQty', false)
                oModel.setProperty('/PlecesWeight', false)
                oModel.setProperty('/QADocumentNum', true)
                 oModel.setProperty('/InspectionType', true)
                oModel.setProperty('/TotalWeight', false)
                oModel.setProperty('/Remarks', false)
                oModel.setProperty('/NSuperwiserName', false)
                oModel.setProperty('/NQAName', false)
                oModel.setProperty('/NContractName', false)
                oModel.setProperty('/NPlantName', false)
                oModel.setProperty('/NFloorName', false)
                oModel.setProperty('/BtnRejectEnable', true)
                oModel.setProperty('/BtnApproveEnable', true)
                oModel.setProperty('/BtnPostEnable',false);
                oModel.setProperty('/BtnSubmitEnable',false);
                this.getView().setModel(oModel,'EnbDisModal');
                    if(L1Approver=="Approve")
                    {
                        oModel.setProperty('/BtnPrintEnable',true);
                    }
                    else
                    {
                       oModel.setProperty('/BtnPrintEnable',false); 
                    }
                }
                else  if(IsQA2==globalVarForUserId)
                {
                    let oModel = this.getView().getModel('EnbDisModal');
                let oModel1 = this.getView().getModel(this.getEntryFormDataSourceModelName());
                 let oModel11 = this.getView().getModel(this.getEntryFormDataSourceModelName()).getData();
                var Isposted=oModel1.getProperty('/IsDocumentreadyForPosting');
                oModel.setProperty('/GMCNo', false)
                oModel.setProperty('/JobworkPo', false)
                oModel.setProperty('/SKU', false)
                oModel.setProperty('/SONO', false)
                oModel.setProperty('/ContractNM', false)
                oModel.setProperty('/SuperwiserNM', false)
                oModel.setProperty('/FromProcess', false)
                oModel.setProperty('/ToProcess', false)
                oModel.setProperty('/ProductionAccountant', false)
                oModel.setProperty('/SFGDsc', false)
                oModel.setProperty('/POQty', false)
                oModel.setProperty('/PlantNM', false)
                 oModel.setProperty('/CycleTime', false)
                oModel.setProperty('/ShiftTime', false)
                oModel.setProperty('/PalletNumber', false)
                 oModel.setProperty('/CycleTime', false)
                oModel.setProperty('/PalletNumber', false)
                oModel.setProperty('/FloorNM', false)
                oModel.setProperty('/QANM', false)
                oModel.setProperty('/GMCQty', false)
                oModel.setProperty('/StatusRemarks', true)
                oModel.setProperty('/PlecesWeight', false)
                oModel.setProperty('/QADocumentNum', false)
                 oModel.setProperty('/InspectionType', false)
                oModel.setProperty('/TotalWeight', false)
                oModel.setProperty('/Remarks', false)
                oModel.setProperty('/NSuperwiserName', false)
                oModel.setProperty('/NQAName', false)
                oModel.setProperty('/NContractName', false)
                oModel.setProperty('/NPlantName', false)
                oModel.setProperty('/NFloorName', false)
                oModel.setProperty('/BtnSubmitEnable',false);
                oModel.setProperty('/BtnPrintEnable',true);
               
                if(Isposted==true)
                {
                    oModel.setProperty('/BtnPostEnable',false);
                    oModel.setProperty('/BtnRejectEnable', false)
                    oModel.setProperty('/BtnApproveEnable', false)
                }
                else
                {
                        oModel.setProperty('/BtnPostEnable',false);
                        oModel.setProperty('/BtnRejectEnable', true)
                        oModel.setProperty('/BtnApproveEnable', true)
                }
                this.getView().setModel(oModel,'EnbDisModal');
                }
            }
            if (usertype == "L2") {
                let oModel = this.getView().getModel('EnbDisModal');
                let oModel1 = this.getView().getModel(this.getEntryFormDataSourceModelName());
                 let oModel11 = this.getView().getModel(this.getEntryFormDataSourceModelName()).getData();
                var Isposted=oModel1.getProperty('/IsDocumentreadyForPosting');
                oModel.setProperty('/GMCNo', false)
                oModel.setProperty('/JobworkPo', false)
                oModel.setProperty('/SKU', false)
                oModel.setProperty('/SONO', false)
                oModel.setProperty('/ContractNM', false)
                oModel.setProperty('/SuperwiserNM', false)
                oModel.setProperty('/FromProcess', false)
                oModel.setProperty('/ToProcess', false)
                oModel.setProperty('/ProductionAccountant', false)
                oModel.setProperty('/SFGDsc', false)
                oModel.setProperty('/POQty', false)
                oModel.setProperty('/PlantNM', false)
                 oModel.setProperty('/CycleTime', false)
                oModel.setProperty('/ShiftTime', false)
                oModel.setProperty('/PalletNumber', false)
                 oModel.setProperty('/CycleTime', false)
                oModel.setProperty('/PalletNumber', false)
                oModel.setProperty('/FloorNM', false)
                oModel.setProperty('/QANM', false)
                oModel.setProperty('/GMCQty', false)
                oModel.setProperty('/PlecesWeight', false)
                oModel.setProperty('/QADocumentNum', false)
                 oModel.setProperty('/InspectionType', false)
                oModel.setProperty('/TotalWeight', false)
                oModel.setProperty('/Remarks', false)
                oModel.setProperty('/NSuperwiserName', false)
                oModel.setProperty('/NQAName', false)
                oModel.setProperty('/NContractName', false)
                oModel.setProperty('/NPlantName', false)
                oModel.setProperty('/NFloorName', false)
                oModel.setProperty('/BtnSubmitEnable',false);
                  oModel.setProperty('/BtnPrintEnable',true);
               
                if(Isposted==true)
                {
                    oModel.setProperty('/BtnPostEnable',false);
                    oModel.setProperty('/BtnRejectEnable', false)
                    oModel.setProperty('/BtnApproveEnable', false)
                }
                else
                {
                        oModel.setProperty('/BtnPostEnable',false);
                        oModel.setProperty('/BtnRejectEnable', true)
                        oModel.setProperty('/BtnApproveEnable', true)
                }
                this.getView().setModel(oModel,'EnbDisModal');
            }
            if (usertype == "P") {
                let oModel = this.getView().getModel('EnbDisModal');
                let oModel1 = this.getView().getModel(this.getEntryFormDataSourceModelName());
                 let oModel11 = this.getView().getModel(this.getEntryFormDataSourceModelName()).getData();
                var IsReadyforPost=oModel1.getProperty('/SecondLevelStatus');
                oModel.setProperty('/GMCNo', false)
                oModel.setProperty('/JobworkPo', false)
                oModel.setProperty('/SKU', false)
                oModel.setProperty('/SONO', false)
                oModel.setProperty('/ContractNM', false)
                oModel.setProperty('/SuperwiserNM', false)
                oModel.setProperty('/FromProcess', false)
                oModel.setProperty('/ToProcess', false)
                oModel.setProperty('/ProductionAccountant', false)
                oModel.setProperty('/SFGDsc', false)
                oModel.setProperty('/POQty', false)
                oModel.setProperty('/PlantNM', false)
                 oModel.setProperty('/CycleTime', false)
                oModel.setProperty('/ShiftTime', false)
                oModel.setProperty('/PalletNumber', false)
                 oModel.setProperty('/CycleTime', false)
                oModel.setProperty('/PalletNumber', false)
                oModel.setProperty('/FloorNM', false)
                oModel.setProperty('/QANM', false)
                oModel.setProperty('/GMCQty', false)
                oModel.setProperty('/PlecesWeight', false)
                oModel.setProperty('/QADocumentNum', false)
                 oModel.setProperty('/InspectionType', false)
                oModel.setProperty('/TotalWeight', false)
                oModel.setProperty('/Remarks', false)
                oModel.setProperty('/NSuperwiserName', false)
                oModel.setProperty('/NQAName', false)
                oModel.setProperty('/NContractName', false)
                oModel.setProperty('/NPlantName', false)
                oModel.setProperty('/NFloorName', false)
                oModel.setProperty('/BtnSubmitEnable',false);
                oModel.setProperty('/BtnPrintEnable',true);
               
                if(IsReadyforPost=='Approve')
                {
                    oModel.setProperty('/BtnPostEnable',true);
                    oModel.setProperty('/BtnRejectEnable', false)
                    oModel.setProperty('/BtnApproveEnable', false)
                }
                else
                {
                        oModel.setProperty('/BtnPostEnable',false);
                        oModel.setProperty('/BtnRejectEnable', false)
                        oModel.setProperty('/BtnApproveEnable', false)
                }
                this.getView().setModel(oModel,'EnbDisModal');
            }
        },
        fillInspectionType:function()
        {
            debugger; 
  const viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
               var Model = [{ Code: "0", Name: "FPA"},{ Code: "1", Name: "Pilot Run"},{ Code: "2", Name: "End Line "},{ Code: "3", Name: "InLine "},{ Code: "4", Name: "MidLine "}];
                viewModel.setProperty("/InspectionTypeList", Model);

        },
        FillStoragelocation: async function () {
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            let viewModel1 = this.getView().getModel(this.getEntryFormDataSourceModelName()).getData();
            let _plant = viewModel.getProperty("/PlantNM")
            let StorageLocation= viewModel.getProperty("/FloorNM");
            debugger;
            await this.createNewModelUsingAPI(
                'GET',
                `/sap/opu/odata4/sap/zune_sb_storagelocation_api/srvd_a2x/sap/zune_sd_storagelocation_api/0001/ZUNE_CDS_StorageLoactionAPI?$filter=Plant eq '${_plant}'`,
                '',
                'Storagelocation'
            );
            const data = this.getView().getModel('Storagelocation').getData();//Uncomment when API run


            const { value = [] } = data || {};

            viewModel.setProperty("/StoragelocationList", []); // clear array
            viewModel.setProperty("/StoragelocationList", value);
            viewModel.setProperty("/FloorNM", StorageLocation);
            viewModel.refresh(true);
        },
         FillFromprocess: async function () {
            debugger;
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            let viewModel1 = this.getView().getModel(this.getEntryFormDataSourceModelName()).getData();
            let _plant = viewModel.getProperty("/PlantNM")
             let Storage=viewModel.getProperty("/FloorNM");

             //get process mapped with Plant
              await this.createNewModelUsingAPI(
                'GET',
                //`/odata/v4/user-master-services/UserMasterTT?filter=ID eq '${globalVarForL2UserId}'`,
                 `/odata/v4/user-mapping-services/UserMapping?$filter=Plant eq '${_plant}' and Storage eq '${Storage}'`,
                '',
                'Superwiser'
            );
            debugger;
            const Sdata = this.getView().getModel('Superwiser').getData();//Uncomment when API run

            const { Svalue = [] } = Sdata || {};
              let _Process = Sdata?.value?.[0]?.ToProcess ?? null;
            //let Storage=Sdata.value[0].ToProcess;
              //get process mapped with Plant
            debugger;
            await this.createNewModelUsingAPI(
                'GET',
                 `/sap/opu/odata4/sap/zune_sb_fromprocess/srvd_a2x/sap/zune_sd_fromprocess/0001/Zune_CDS_FromProcess?$filter=Code eq '${_Process}' `,
                '',
                'Storagelocation'
            );
            const data = this.getView().getModel('Storagelocation').getData();//Uncomment when API run


            const { value = [] } = data || {};

            viewModel.setProperty("/FromProcessCombo", []); // clear array
            viewModel.setProperty("/FromProcessCombo", value);
              viewModel.setProperty("/FromProcess", "");
               viewModel.setProperty("/FromProcess", _Process);
            viewModel.refresh(true);
        },

        FillToprocess: async function () {
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            let viewModel1 = this.getView().getModel(this.getEntryFormDataSourceModelName()).getData();
            let _plant = viewModel.getProperty("/PlantNM")
             let Storage=viewModel.getProperty("/FromProcess");
            debugger;
            await this.createNewModelUsingAPI(
                'GET',
                 `/sap/opu/odata4/sap/zune_sb_fromprocess/srvd_a2x/sap/zune_sd_fromprocess/0001/Zune_CDS_FromProcess`,
                '',
                'Storagelocation'
            );
            const data = this.getView().getModel('Storagelocation').getData();//Uncomment when API run


            const { value = [] } = data || {};

            viewModel.setProperty("/ToProcessList", []); // clear array
            viewModel.setProperty("/ToProcessList", value);
            viewModel.refresh(true);
        },
        FillProductionAccount: async function () {
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            let plant=viewModel.getProperty("/PlantNM");
            let FromProcess=viewModel.getProperty("/FromProcess");

            debugger;
            await this.createNewModelUsingAPI(
                'GET',
                `/odata/v4/prodteam/Prodteam?$filter=Plant eq '${plant}' and ToProcess eq '${FromProcess}'`,
                '',
                'ProdAccountant'
            );
            debugger;
            const data = this.getView().getModel('ProdAccountant').getData();//Uncomment when API run

            const { value = [] } = data || {};
             let Prodteam = data?.value?.[0]?.Prodteam ?? null;
             
           

const uniqueList = value.filter(
    (item, index, self) =>
        index === self.findIndex(x => x.Prodteam === item.Prodteam)
);


            viewModel.setProperty("/ProdAccountantList", []); // clear array
            viewModel.setProperty("/ProdAccountantList", uniqueList);
           // viewModel.setProperty("/ProductionAccountant", Prodteam);
            viewModel.refresh(true);
        },
        FillQAL1Approval: async function () {
            debugger;
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
             let plant=viewModel.getProperty("/PlantNM");
            let FromProcess=viewModel.getProperty("/FromProcess");
            let Shift=viewModel.getProperty("/ShiftTime");
            ///sap/opu/odata4/sap/zune_sb_storagelocation_api/srvd_a2x/sap/zune_sd_storagelocation_api/0001/ZUNE_CDS_StorageLoactionAPI?$filter=Plant eq '${plantCode}'
            await this.createNewModelUsingAPI(
                'GET',
                 `/odata/v4/qa1/QA1?$apply=filter(Plant eq '${plant}' and ToProcess eq '${FromProcess}' and Shift eq '${Shift}')/groupby((QA1,QA1_Username))`,
                //`/odata/v4/qa1/QA1?$filter=Plant eq '${plant}' and ToProcess eq '${FromProcess}' and Shift eq '${Shift}'`,
                '',
                'QAUser'
            );
            debugger;
            const data = this.getView().getModel('QAUser').getData();//Uncomment when API run

            const { value = [] } = data || {};
            // let QA1 = data?.value?.[0]?.QA1 ?? null;

            viewModel.setProperty("/QAListL1", []); // clear array
            viewModel.setProperty("/QAListL1", value);
            //viewModel.setProperty("/QANM", QA1);
            viewModel.refresh(true);
        },
        FillQAL2Approval: async function () {
           debugger
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
             let plant=viewModel.getProperty("/NPlantName");
            let ToStorage=viewModel.getProperty("/ToProcess");
             let Shift=viewModel.getProperty("/ToShiftTime");
            await this.createNewModelUsingAPI(
                'GET',
                //`/odata/v4/user-master-services/UserMasterTT?filter=ID eq '${globalVarForL2UserId}'`,
                `/odata/v4/qa1/QA1?$apply=filter(Plant eq '${plant}' and ToProcess eq '${ToStorage}' and Shift eq '${Shift}')/groupby((QA1,QA1_Username))`,
                '',
                'QAUser2'
            );
            const data = this.getView().getModel('QAUser2').getData();//Uncomment when API run

            const { value = [] } = data || {};
            debugger;
            viewModel.setProperty("/QAListL2", []); // clear array
            viewModel.setProperty("/QAListL2", value);
             //viewModel.setProperty("/NQAName", "");
            // viewModel.setProperty("/NQAName", value[0].QA1);
            viewModel.refresh(true);
        },

        FillToSuperWiser: async function () {
            debugger;
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
             let plant=viewModel.getProperty("/NPlantName");
            let ToStorage=viewModel.getProperty("/ToProcess");
            let Contractor=viewModel.getProperty("/NContractCode");
             let Shift=viewModel.getProperty("/ToShiftTime");
            await this.createNewModelUsingAPI(
                'GET',
               `/odata/v4/superwiser-mapping/SuperwiserMapping?$apply=filter(Plant eq '${plant}' and ToProcess eq '${ToStorage}' and Shift eq '${Shift}')/groupby((Superviser,Superviser_Username))`,
                // `/odata/v4/superwiser-mapping/SuperwiserMapping?$filter=ToProcess eq '${ToStorage}' and Contractor eq '${Contractor}'`,
                '',
                'Superwiser'
            );
            const data = this.getView().getModel('Superwiser').getData();//Uncomment when API run

            const { value = [] } = data || {};

            viewModel.setProperty("/NSuperwiserNameList", []); // clear array
            viewModel.setProperty("/NSuperwiserNameList", value);
            // viewModel.setProperty("/NSuperwiserName", "");
           // viewModel.setProperty("/NSuperwiserName", value[0].Superviser);
            viewModel.refresh(true);
        },
          FillFromSuperWiser: async function () {
            debugger;
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
             let plant=viewModel.getProperty("/PlantNM");
            let ToStorage=viewModel.getProperty("/FloorNM");
           // let Shift=viewModel.getProperty("/ShiftTime");
              
            await this.createNewModelUsingAPI(
                'GET',
                `/odata/v4/superwiser-mapping/SuperwiserMapping?$filter=Plant eq '${plant}' and ToProcess eq '${ToStorage}'`,
                // `/odata/v4/superwiser-mapping/SuperwiserMapping?$filter=ToProcess eq '${ToStorage}' and Contractor eq '${Contractor}'`,
                '',
                'Superwiser'
            );
            const data = this.getView().getModel('Superwiser').getData();//Uncomment when API run

            const { value = [] } = data || {};

            viewModel.setProperty("/NSuperwiserNameList", []); // clear array
            viewModel.setProperty("/NSuperwiserNameList", value);
             viewModel.setProperty("/NSuperwiserName", "");
            viewModel.setProperty("/NSuperwiserName", value[0].Superviser);
            viewModel.refresh(true);
        },
        FillToStorageLocationpldNotInUsed: async function () {
            debugger;
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
           let plant=viewModel.getProperty("/NPlantName");
            let ToProcess=viewModel.getProperty("/ToProcess");
             let Shift=viewModel.getProperty("/ToShiftTime");

         await this.createNewModelUsingAPI(
                'GET',
                //`/odata/v4/user-master-services/UserMasterTT?filter=ID eq '${globalVarForL2UserId}'`,
                 `/odata/v4/user-mapping-services/UserMapping?$filter=Plant eq '${plant}' and ToProcess eq '${ToProcess}' and Shift eq '${Shift}'`,
                '',
                'Superwiser'
            );
            const _data = this.getView().getModel('Superwiser').getData();//Uncomment when API run

            const { _value = [] } = _data || {};
                let Storage = _data?.value?.[0]?.Storage ?? null;
                //let Process=_data.value[0].Code;
            debugger;
            await this.createNewModelUsingAPI(
                'GET',
                `/sap/opu/odata4/sap/zune_sb_storagelocation_api/srvd_a2x/sap/zune_sd_storagelocation_api/0001/ZUNE_CDS_StorageLoactionAPI?$filter=StorageLocation eq '${Storage}'`,
                '',
                'Storagelocation'
            );
            const data = this.getView().getModel('Storagelocation').getData();//Uncomment when API run


            const { value = [] } = data || {};

            viewModel.setProperty("/floorList", []); // clear array
            viewModel.setProperty("/floorList", value);
              viewModel.setProperty("/NFloorName","");
             viewModel.setProperty("/NFloorName", value[0].StorageLocation);
            viewModel.refresh(true);
        },
       FillToStorageLocation: async function () {

    debugger;

    let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());

    let plant = viewModel.getProperty("/NPlantName");
    let ToProcess = viewModel.getProperty("/ToProcess");
    let Shift = viewModel.getProperty("/ToShiftTime");

    // First API
    await this.createNewModelUsingAPI(
        'GET',
        `/odata/v4/user-mapping-services/UserMapping?$filter=Plant eq '${plant}' and ToProcess eq '${ToProcess}' and Shift eq '${Shift}'`,
        '',
        'Superwiser'
    );

    const _data = this.getView().getModel('Superwiser').getData();

    // Get all Storage values
    let storageList = (_data?.value || [])
        .map(item => item.Storage)
        .filter(Boolean);

    // Remove duplicates (optional)
    storageList = [...new Set(storageList)];

    // Build OData filter
    let storageFilter = storageList
        .map(storage => `StorageLocation eq '${storage}'`)
        .join(' or ');

    // Example:
    // StorageLocation eq '0001' or StorageLocation eq '0002'

    debugger;
if(storageFilter!="")
{
    // Second API
    await this.createNewModelUsingAPI(
        'GET',
        `/sap/opu/odata4/sap/zune_sb_storagelocation_api/srvd_a2x/sap/zune_sd_storagelocation_api/0001/ZUNE_CDS_StorageLoactionAPI?$filter=${storageFilter}`,
        '',
        'Storagelocation'
    );

    const data = this.getView().getModel('Storagelocation').getData();

    const { value = [] } = data || {};

    viewModel.setProperty("/floorList", []);
    viewModel.setProperty("/floorList", value);
}
else
{
    viewModel.setProperty("/floorList", []); // clear array 
}
   

    // Set first storage location if available
   // if (value.length > 0) {
     //   viewModel.setProperty("/NFloorName", value[0].StorageLocation);
   // }

    viewModel.refresh(true);
},
        Plant: async function () {
            
              let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
             let __plant=viewModel.getProperty("/PlantNM");
           
            debugger;
            await this.createNewModelUsingAPI(
                'GET',
                `/sap/opu/odata4/sap/zune_sb_plant_api/srvd_a2x/sap/zune_sd_plant_api/0001/ZUNE_CDS_Plant?$filter=Plant eq '${__plant}'`,
                '',
                'Plant'
            );
            const data = this.getView().getModel('Plant').getData();//Uncomment when API run


            const { value = [] } = data || {};
            let Fplant = data?.value?.[0]?.Plant ?? null;

            viewModel.setProperty("/PlantList", []); // clear array
            viewModel.setProperty("/PlantList", value);
            viewModel.setProperty("/Plant",Fplant);
            viewModel.refresh(true);
        },
        ContractorName: async function () {
            debugger
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
             let plant=viewModel.getProperty("/NPlantName");
            let ToStorage=viewModel.getProperty("/ToProcess");
             let Shift=viewModel.getProperty("/ToShiftTime");
            //getPlant ToProcessWise
             await this.createNewModelUsingAPI(
                'GET',
                //`/odata/v4/user-master-services/UserMasterTT?filter=ID eq '${globalVarForL2UserId}'`,
                 `/odata/v4/user-mapping-services/UserMapping?$filter= ToProcess eq '${ToStorage}' and Plant eq '${plant}' and Shift eq '${Shift}'`,
                '',
                'Contmapp'
            );
            const _data = this.getView().getModel('Contmapp').getData();//Uncomment when API run

            const { _value = [] } = _data || {};
           debugger
            let contractors = [
    ...new Set(
        (_data?.value || [])
            .map(item => item.Contractor)
            .filter(Boolean)
    )
];

            let filter = '';

            if (contractors.length > 0) {
                filter = contractors
                    .map(c => `Supplier eq '${c}'`)
                    .join(' or ');
            }
            

            debugger;
            await this.createNewModelUsingAPI(
                'GET',
               `/sap/opu/odata/sap/API_BUSINESS_PARTNER/A_Supplier?$filter=${filter}&$format=json`,
                '',
                'Contractor'
            );
            debugger
            let odata = this.getView().getModel('Contractor');//Uncomment when API run
            let ContractorList = odata.getProperty("/d/results");

            //const { value = [] } = ContractorList || {};

            viewModel.setProperty("/ContractorList", []); // clear array
            viewModel.setProperty("/ContractorList", ContractorList);
            // viewModel.setProperty("/NContractCode", Contractor);
            viewModel.refresh(true);
        },
         ToPlantoldnotinUsed: async function () {
            
              let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
             let plant=viewModel.getProperty("/PlantNM");
            let ToProcess=viewModel.getProperty("/ToProcess");
             let Shift=viewModel.getProperty("/ToShiftTime");
            //getPlant ToProcessWise
             await this.createNewModelUsingAPI(
                'GET',
                //`/odata/v4/user-master-services/UserMasterTT?filter=ID eq '${globalVarForL2UserId}'`,
                 `/odata/v4/user-mapping-services/UserMapping?$filter= ToProcess eq '${ToProcess}' and Shift eq '${Shift}'`,
                '',
                'Superwiser'
            );
            const _data = this.getView().getModel('Superwiser').getData();//Uncomment when API run

            const { _value = [] } = _data || {};
           // let __plant= data.value[0].Plant;
             let __plant = _data?.value?.[0]?.Plant ?? null;
            
             //getPlant ToProcessWise
            debugger;
            await this.createNewModelUsingAPI(
                'GET',
                `/sap/opu/odata4/sap/zune_sb_plant_api/srvd_a2x/sap/zune_sd_plant_api/0001/ZUNE_CDS_Plant?$filter=Plant eq '${__plant}'`,
                '',
                'Plant'
            );
            const data = this.getView().getModel('Plant').getData();//Uncomment when API run


            const { value = [] } = data || {};
             let ___plant = data?.value?.[0]?.Plant ?? null;

            viewModel.setProperty("/NPlantList", []); // clear array
            viewModel.setProperty("/NPlantList", value);
             viewModel.setProperty("/NPlantName", "");
            viewModel.setProperty("/NPlantName", ___plant);
            viewModel.refresh(true);
        },
        ToPlant: async function () {

    let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());

    let ToProcess = viewModel.getProperty("/ToProcess");
    let Shift = viewModel.getProperty("/ToShiftTime");

    // First API
    await this.createNewModelUsingAPI(
        'GET',
        `/odata/v4/user-mapping-services/UserMapping?$filter= ToProcess eq '${ToProcess}' and Shift eq '${Shift}'`,
        '',
        'Superwiser'
    );

    const _data = this.getView().getModel('Superwiser').getData();

    // Get all plants
    let plantList = (_data?.value || [])
        .map(item => item.Plant)
        .filter(Boolean);

    // Remove duplicates (optional)
    plantList = [...new Set(plantList)];

    // Build OData filter
    let plantFilter = plantList
        .map(plant => `Plant eq '${plant}'`)
        .join(' or ');

    // Example:
    // Plant eq '1000' or Plant eq '2000' or Plant eq '3000'

    debugger;
if(plantFilter!="")
{
    // Second API
    await this.createNewModelUsingAPI(
        'GET',
        `/sap/opu/odata4/sap/zune_sb_plant_api/srvd_a2x/sap/zune_sd_plant_api/0001/ZUNE_CDS_Plant?$filter=${plantFilter}`,
        '',
        'Plant'
    );
     const data = this.getView().getModel('Plant').getData();

    const { value = [] } = data || {};
//viewModel.setProperty("/NPlantName", ""); // clear current plant name
    viewModel.setProperty("/NPlantList", []);
    viewModel.setProperty("/NPlantList", value);

    viewModel.refresh(true);
}
else{
    //viewModel.setProperty("/NPlantName", ""); // clear current plant name
        viewModel.setProperty("/NPlantList", []); // clear array
}
   
},
        FillStoragelocationForToProcess: async function () {
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
               let Shift=viewModel.getProperty("/ToShiftTime");
            let ToStorage=viewModel.getProperty("/ToProcess");
            //getPlant ToProcessWise
             await this.createNewModelUsingAPI(
                'GET',
                //`/odata/v4/user-master-services/UserMasterTT?filter=ID eq '${globalVarForL2UserId}'`,
                 `/odata/v4/user-mapping-services/UserMapping?$filter= ToProcess eq '${ToStorage}' and Shift eq '${Shift}'`,
                '',
                'Storage'
            );
            const _data = this.getView().getModel('Superwiser').getData();//Uncomment when API run
debugger
            const { _value = [] } = data || {};
            let Storage = data?.value?.[0]?.Storage ?? null;
            //let Storage= _value[0].Storage;
            
            debugger;
            if(Storage!=null)
            {
            await this.createNewModelUsingAPI(
                'GET',
                `/sap/opu/odata4/sap/zune_sb_storagelocation_api/srvd_a2x/sap/zune_sd_storagelocation_api/0001/ZUNE_CDS_StorageLoactionAPI?$filter=StorageLocation eq '${Storage}'`,
                '',
                'Storagelocation'
            );
            const data = this.getView().getModel('Storagelocation').getData();//Uncomment when API run


            const { value = [] } = data || {};

            viewModel.setProperty("/floorList", []); // clear array
            viewModel.setProperty("/floorList", value);
             viewModel.setProperty("/NFloorName", "");
            viewModel.setProperty("/NFloorName", Storage);
            viewModel.refresh(true);
        }
        else
        {
               viewModel.setProperty("/NFloorName", "");
        }
        },

      

       


        navBack: function () {
            history.go(-1);
            //var router = sap.ui.core.UIComponent.getRouterFor(this);
            // router.navTo("RouteIndex");
        },

        TotalQuantity: function () {
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            const Quantity = viewModel.getProperty(`/GMCQty`);
            const Weight = viewModel.getProperty(`/PlecesWeight`);

            const FinalWeight = this.ToDecimal(Quantity) * this.ToDecimal(Weight)

            viewModel.setProperty(`/TotalWeight`, FinalWeight);

            viewModel.refresh(true);
        },

        ToDecimal: function (value) {
            // handle null/empty safely
            if (value === null || value === undefined || value === "") {
                return 0;
            }

            // convert to decimal (float)
            let num = parseFloat(value);

            // handle NaN
            if (isNaN(num)) {
                return 0;
            }

            return num;
        },


        SetConstantValuesInEditMode: function () {
            debugger;
            const viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName())
            const viewModel1 = this.getView().getModel(this.getEntryFormDataSourceModelName()).getData();

            const FromProcessCombo = [
                {
                    "Code": "Plant",
                    "Name": "Plant"
                },
                {
                    "Code": "Store",
                    "Name": "Store"
                }
            ]
            viewModel.setProperty("/FromProcessCombo", FromProcessCombo);
            viewModel.setProperty("/ToProcessCombo", FromProcessCombo);
            viewModel.refresh(true);
        },

       async OnPrint()
        {
            debugger;
            const viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName())
            let _GMCID=viewModel.getProperty("/ID");
           await this.createNewModelUsingAPI(
                'GET',
                 `/odata/v4/report-data/GMCHeaderReport('${_GMCID}')`,
                '',
                'reportdata'
            );
             
          const reportData=this.getView().getModel('reportdata').getData();
          debugger;
            // Use jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Page border (full page)
        doc.setLineWidth(0.25); // border thickness
        doc.rect(5, 5, doc.internal.pageSize.getWidth() - 10, doc.internal.pageSize.getHeight() - 10); 
        // rect(x, y, width, height)
            // Sample data
  
    let y = 10;
    doc.setFont("Arial", "bold");
    // ===== Header =====
    doc.setFontSize(14);
    


    doc.text("Stonemen Crafts India Pvt. Ltd.", 105, y, { align: "center" });
    y+=5;
    doc.setFontSize(9);
    //#region address
if(reportData.PlantNM=="1100")
{
 doc.text("EPIP UNIT 1, A 24-25 EPIP,UPSIDC,Industrial  Agra-282007 UP", 105, y, { align: "center" });
}
else if(reportData.PlantNM=="1200")
{
    doc.text("EPIP UNIT 2, A 21-22 EPIP,UPSIDC,Industrial Agra-282007 UP", 105, y, { align: "center" });
}
else if(reportData.PlantNM=="1300")
{
    doc.text("EPIP UNIT 3, C 128-129 EPIP,UPSIDC,Industrial Agra-282007 UP", 105, y, { align: "center" });
} else if(reportData.PlantNM=="1800")
{
    doc.text("MANGURA UNIT 8, Khasra No. 413-415 Mangura, Kirawali Agra-283101 UP", 105, y, { align: "center" });
}
else if(reportData.PlantNM=="1500")
{
    doc.text("EPIP UNIT 5, C 83-89 EPIP,UPSIDC,Industrial Agra-282007 UP", 105, y, { align: "center" });
}
else if(reportData.PlantNM=="1900") 
    {
    doc.text("AMROHA UNIT 9, Khasra No. 331-332 Neelikheri Amroha-244222 UP", 105, y, { align: "center" });
    }
    
//#endregionendregion

    y+=7;
    doc.setFontSize(9);
    doc.text("Goods Movement Challan", 105, y, { align: "center" });
     y+=1;
     doc.line(80, y, 135, y); // horizontal line
     y+=2;
      doc.line(5, y, doc.internal.pageSize.getWidth() - 5, y); // horizontal line
       // ===== Header =====
        // =====Sub Header1 =====
        y+=4;
        doc.text(`GMC No:`, 10, y);
        doc.setFont("Arial", "normal");
        doc.text(`${reportData.GMCNo}`, 40, y);
        doc.setFont("Arial", "bold");
        doc.text(`PO No:`, 115, y);
         doc.setFont("Arial", "normal");
         doc.text(`${reportData.JobworkPo}`, 155, y);
        y += 5;
         doc.setFont("Arial", "bold");
        doc.text(`GMC Date:`, 10, y);
         doc.setFont("Arial", "normal");
        doc.text(this.Todate(`${reportData.createdAt}`), 40, y);
         doc.setFont("Arial", "bold");
        doc.text(`Sales Order:`, 115, y);
         doc.setFont("Arial", "normal");
         doc.text(`${reportData.SONO}`, 155, y);
          y += 5;
           doc.setFont("Arial", "bold");
         doc.text(`Style No.:`, 115, y);
         doc.setFont("Arial", "normal");
         debugger
         doc.text(`${reportData.ManualSalesOrderItemCode}`, 155, y);
        y += 5;
        doc.setFont("Arial", "bold");
        doc.text(`QC Report: `, 10, y);
        doc.setFont("Arial", "normal");
         doc.text(`${reportData.QADocumentNum}`, 40, y);
         doc.setFont("Arial", "bold");
        y += 5
        doc.text(`Shift: `, 10, y);
        doc.setFont("Arial", "normal");
        if(reportData.ShiftTime=="0")
        {
            doc.text("General", 40, y);
        }
        else if(reportData.ShiftTime=="1")
        {
            doc.text("First", 40, y);
        }
        else{
                doc.text("Second", 40, y);
        }
        //doc.text(`${reportData.ShiftTime}`, 40, y);
        doc.setFont("Arial", "bold");
        doc.text(`Cycle Time: `, 115, y);
        doc.setFont("Arial", "normal");
        doc.text(`${reportData.CycleTime.replace(/\u202F/g, ' ')}`, 155, y);
        y += 5;
        doc.setFont("Arial", "bold");
        doc.text(`Pallet No: `, 10, y);
        doc.setFont("Arial", "normal");
        doc.text(`${reportData.PalletNumber}`, 40, y);
         y += 3;
        doc.line(5, y, doc.internal.pageSize.getWidth() - 5, y); // horizontal line
       

        // =====Sub Header1 =====
         // =====Sub Header2 =====
             y+=3;
        doc.setFont("Arial", "bold");
        doc.text(`From Process:`, 10, y);
         doc.setFont("Arial", "normal");
          doc.text(`${reportData.FromProcessNM}`, 40, y);
          doc.setFont("Arial", "bold");
        doc.text(`Next Process: `, 115, y);
        doc.setFont("Arial", "normal");
        doc.text(`${reportData.ToProcessNM}`, 155, y);
        y += 5;
        doc.setFont("Arial", "bold");
        doc.text(`Vendor Code:`, 10, y);
        doc.setFont("Arial", "normal");
        doc.text(
  reportData.VendorCode == null || reportData.VendorCode === ""? "" : `${reportData.VendorCode}`, 40, y);
        doc.setFont("Arial", "bold");
        doc.text(`Next Process Vendor Code:`, 115, y);
        doc.setFont("Arial", "normal");
        doc.text(`${reportData.NContractCode}`, 155, y);
          y += 5;
          doc.setFont("Arial", "bold");
         doc.text(`Vendor Name.: `, 10, y);
         doc.setFont("Arial", "normal");
         doc.text(`${reportData.ContractNM}`, 40, y);
         doc.setFont("Arial", "bold");
          doc.text(`Next Process Vendor Name: `, 115, y);
          doc.setFont("Arial", "normal");
          if (reportData.NContractName != null && reportData.NContractName !== "") {

        const text = reportData.NContractName;
        const maxLength = 30;
        const lineHeight = 5;

        // Split text dynamically into chunks of 60 chars
        const lines = [];

        for (let i = 0; i < text.length; i += maxLength) {
            lines.push(text.substring(i, i + maxLength));
        }

        // Print each line dynamically
        lines.forEach((line, index) => {
            doc.text(line, 155, y + (index * lineHeight));
        });
         // 🔥 MOVE Y DOWN AFTER WRITING ALL LINES
    y += (lines.length * lineHeight);
        }
         
          doc.setFont("Arial", "bold");
       // y += 5;
        doc.text(`Supervisor Name:`, 10, y);
         doc.setFont("Arial", "normal");
        doc.text(` ${reportData.Superviser1}`, 40, y);
         doc.setFont("Arial", "bold");
        doc.text(`Next Process Supervisor : `, 115, y);
         doc.setFont("Arial", "normal");
         doc.text(`${reportData.Superviser2}`, 155, y);
        y += 5;
        doc.setFont("Arial", "bold");
        doc.text(`QA Name: `, 10, y);
         doc.setFont("Arial", "normal");
        doc.text(`${reportData.QA1Name}`, 40, y);
         doc.setFont("Arial", "bold");
        doc.text(`Next Process QA Name: `, 115, y);
        doc.setFont("Arial", "normal");
         doc.text(`${reportData.QA2}`, 155, y);
         y += 10;
         doc.setFont("Arial", "bold");
          // =====Sub Header2 =====

    // ===== Line Items =====
doc.line(5, y, doc.internal.pageSize.getWidth() - 5, y); // horizontal line
y+=4;
    doc.text("Sr No.", 8, y);
    doc.text("Item Code", 18, y);
    doc.text("Item Description", 60, y);
     doc.text("Full Item Description/Product Material Desc", 89, y);
     doc.text("GMC Quantity", 180, y);
y+=4;
doc.line(5, y, doc.internal.pageSize.getWidth() - 5, y); // horizontal line
y+=5;

// Draw vertical lines between columns
//doc.line(17, y - 13, 17, y-5 + reportData.length * 7); // Vertical line between "Material" and "Quantity"
//doc.line(52, y - 13, 52, y-5 + reportData.length * 7 ); // Vertical line between "Quantity" and "UOM"
//doc.line(135, y - 13, 135, y-5 + reportData.length * 7); // Vertical line between "Material" and "Quantity"
//doc.line(178, y - 13, 178, y-5 + reportData.length * 7); // Vertical line between "Quantity" and "UOM"

doc.line(17, y - 13, 17, y-5 +  7); // Vertical line between "Material" and "Quantity"
doc.line(52, y - 13, 52, y-5 +  7 ); // Vertical line between "Quantity" and "UOM"
doc.line(85, y - 13, 85, y-5 + 7); // Vertical line between "Material" and "Quantity"
doc.line(178, y - 13, 178, y-5 +  7); // Vertical line between "Quantity" and "UOM"
//    reportData.lines.forEach(line => {
     doc.setFont("Arial", "normal");
        doc.text("1", 12, y);
        doc.text(reportData.SKU.toString(), 22, y);
         doc.text(reportData.SFGDsc.toString(), 53, y);
         doc.text(reportData.PODescription||"", 88, y);
        doc.text(reportData.GMCQty.toString(), 180, y);
       
         doc.line(5, y + 2, doc.internal.pageSize.getWidth() - 5, y + 2);
        y += 7;
    //});
     doc.setFont("Arial", "bold");
    doc.text("Remarks  :", 10, y);
    y+=5;
    doc.line(5, y, doc.internal.pageSize.getWidth() - 5, y); // horizontal line
    y+=5;
    doc.text("Created By :", 10, y);
     doc.text("Approved By :", 105, y);
     y+=5;
    doc.text("Created Time :", 20, y);
    const createdAt = reportData.createdAt.substring(0, 16);
    doc.text((`${createdAt}`), 50, y);
    doc.text("Quality-01  :", 135, y);
     doc.text(` ${reportData.QA1Name}`, 169, y);
     y+=5;
    doc.text("Approved Time :", 20, y);
    const modifiedAt = reportData.modifiedAt.substring(0, 16);
     doc.text((`${modifiedAt}`), 50, y);
      doc.text("Supervisor-02 :", 135, y);
    doc.text(` ${reportData.Superviser2}`, 169, y);
     y+=5;
   // doc.line(5, y, doc.internal.pageSize.getWidth() - 5, y); // horizontal line
    doc.text("Quality-02 :", 135, y);
      doc.text(` ${reportData.QA2}`, 169, y);
         doc.setFont("Arial", "bold");
debugger
          doc.text("Production Accountant :", 135, y+5);
      doc.text(` ${reportData.ProductionAccountant}`, 169, y+5);
         doc.setFont("Arial", "normal");

    
     
     
     
    y += 10;
    doc.setFontSize(10);
    //doc.text(`Generated on: ${new Date().toLocaleString()}`, 150, doc.internal.pageSize.height-20);

    // Save/download PDF
    doc.save("SimpleReport.pdf");
        },
        onSave: async function () {
            try {
                debugger;
                  await this.getmaxKey();
                
               // if(this.Validation())
                //{
                    debugger;
                    //check GMC quantity
                    const oModelData = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    
                    const oComboFromP = this.byId("_FromProces");
                    const Fromtext = oComboFromP.getSelectedItem().getText();
                    oModelData.setProperty("/FromProcessNM",Fromtext);

                    const oComboTo = this.byId("_toProces");
                    const Totext = oComboTo.getSelectedItem().getText();
                    oModelData.setProperty("/ToProcessNM",Totext);

                    const oComboNCont = this.byId("__NContName");
                    const NConttext = oComboNCont.getSelectedItem().getText();
                    oModelData.setProperty("/NContractName",NConttext);

                    var JobworkPo = oModelData.getProperty("/JobworkPo");
                        
                     var GMCQty = oModelData.getProperty("/GMCQty");
                        var POQty = oModelData.getProperty("/POQty");
                        if(this.ToDecimal(GMCQty)>0 || GMCQty!="")
                        {
                            if(this.ToDecimal(POQty)>=this.ToDecimal(GMCQty))
                            {
                                debugger;
                                if(await this._Validation())
                                {
                                        if (this.Validation()) {
                                                let isRecordAdded = false;
                                                let loginInfo = this.getLoginInfo();
                                               
                                                const formMode = loginInfo.FormMode;
                                                if (formMode === "3") {
                                                    const oModelData = this.getView().getModel(this.getEntryFormDataSourceModelName());
                                                    var JobworkPo = oModelData.getProperty("/JobworkPo");

                                                    await this.createNewModelUsingAPI(
                                                        'GET',
                                                        `/odata/v4/gmcheader-services/GMCHeader?$filter=(JobworkPo eq '${JobworkPo}')`,
                                                        '',
                                                        'JobworkPo'
                                                    );
                                                    const JobworkPoData = this.getView().getModel('JobworkPo').getData();


                                                    if (JobworkPoData && JobworkPoData.value && JobworkPoData.value.length > 0) {
                                                    //  MessageToast.show("Job work already added.");
                                                    //  isRecordAdded = true;
                                                    }
                                                }
                                                if (!isRecordAdded) {
                                                    debugger;

                                                    let usertypemodel = this.getUserType();
                                                    let usertype = usertypemodel.Usertype;
                                                    // const loginModel = this.getOwnerComponent().getModel('UserModel');
                                                    //   globalVarForUserId= loginModel.value[0].ID;
                                                    if (usertype == "CR") {
                                                        let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                                                        oModel.setProperty('/Creater', globalVarForUserId)
                                                        oModel.setProperty('/SecondLevelStatus', '');
                                                        oModel.setProperty('/SuperwiserStatus', '');
                                                        this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
                                                    }
                                //check Blank data
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
                                            }
                            }
                            }
                            else
                            {
                                MessageBox.show("GMC Quantity can not grater then Po Quantity...");
                            }
                        }
                        else
                        {
                            MessageBox.show("GMC Quantity can not 0...");
                        }
                   // }
                }
            catch (error) {
                MessageBox.show(error.message);
            }
        },
        onApprove: async function () {
            try {
              debugger;
                    let usertypemodel = this.getUserType();
                    let usertype = usertypemodel.Usertype;

                    if (usertype == "L1") {
                        let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                          let QADocumentNum=    oModel.getProperty('/QADocumentNum')
                        let InspectionType=    oModel.getProperty('/InspectionType')
                        if(QADocumentNum==null || QADocumentNum=="")
                        {
                            MessageBox.show("QA Document Number is mandatory for Internal Inspection Type.");
                            return; // Stop further execution
                        }
                        if(InspectionType==null || InspectionType=="")
                        {
                            MessageBox.show("Inspection Type is mandatory.");
                            return; // Stop further execution
                        }
                        let IsQA1=    oModel.getProperty('/QANM')
                        let IsQA2=    oModel.getProperty('/NQAName')
                        if(IsQA1==globalVarForUserId)
                        {
                            oModel.setProperty('/FirstLevelStatus', 'Approve')
                            this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
                        }
                        else if(IsQA2==globalVarForUserId)
                        {
                             let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                            oModel.setProperty('/SecondLevelUser', globalVarForUserId)
                            oModel.setProperty('/SecondLevelStatus', 'Approve')
                            oModel.setProperty('/IsDocumentreadyForPosting',true);
                            this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
                        }
                    }
                     else if (usertype == "CR") {
                         let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                        
                        let SuperW=    oModel.getProperty('/NSuperwiserName')
                        
                        if(SuperW==globalVarForUserId)
                        {
                        let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                        oModel.setProperty('/SecondLevelUser', globalVarForUserId)
                        oModel.setProperty('/SuperwiserStatus', 'Approve')
                        oModel.setProperty('/IsDocumentreadyForPosting',false);
                        this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
                        }
                    }
                     else if (usertype == "S") {//Not in used
                        let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                        oModel.setProperty('/SecondLevelUser', globalVarForUserId)
                        oModel.setProperty('/SuperwiserStatus', 'Approve')
                        oModel.setProperty('/IsDocumentreadyForPosting',false);
                        this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
                    }
                    else if (usertype == "L2") {
                        let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                        oModel.setProperty('/SecondLevelUser', globalVarForUserId)
                        oModel.setProperty('/SecondLevelStatus', 'Approve')
                        oModel.setProperty('/IsDocumentreadyForPosting',true);
                        this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
                    }





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

        onReject: async function () {
            try {
              
                debugger;
                    let usertypemodel = this.getUserType();
                    let usertype = usertypemodel.Usertype;
                    if (usertype == "L1") {
                        let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                        
                        
                        let IsQA1=    oModel.getProperty('/QANM')
                        let IsQA2=    oModel.getProperty('/NQAName')
                        if(IsQA1==globalVarForUserId)
                        {
                            oModel.setProperty('/FirstLevelStatus', 'Reject');
                            oModel.setProperty('/SuperwiserStatus', '');
                            oModel.setProperty('/SecondLevelStatus', '');
                            this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
                        }
                        else if(IsQA2==globalVarForUserId)
                        {
                              oModel.setProperty('/SecondLevelStatus', 'Reject');
                         oModel.setProperty('/SuperwiserStatus', '');
                        oModel.setProperty('/FirstLevelStatus', '');
                        oModel.setProperty('/IsDocumentreadyForPosting',false);
                        this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
                        }
                        

                       
                    }
                     else if (usertype == "CR") {
                        let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                        // oModel.setProperty('/SecondLevelUser',this.globalVarForUserId)
                         let SuperW=    oModel.getProperty('/NSuperwiserName')
                        
                        if(SuperW==globalVarForUserId)
                        {
                        oModel.setProperty('/SuperwiserStatus', 'Reject');
                        oModel.setProperty('/FirstLevelStatus', '');
                         oModel.setProperty('/SecondLevelStatus', '');
                        oModel.setProperty('/IsDocumentreadyForPosting',false);
                        this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
                        }
                    }
                    else if (usertype == "L2") {
                        let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                        // oModel.setProperty('/SecondLevelUser',this.globalVarForUserId)
                        oModel.setProperty('/SecondLevelStatus', 'Reject');
                         oModel.setProperty('/SuperwiserStatus', '');
                        oModel.setProperty('/FirstLevelStatus', '');
                        oModel.setProperty('/IsDocumentreadyForPosting',false);
                        this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
                    }

                    const modelData = this.getView().getModel(this.getEntryFormDataSourceModelName()).getData();
                    let trgObject = this.getView().getModel("SaveRequest").getData();
                    console.log("Target Object:", trgObject);

                    this.transferObjectValues(modelData, trgObject);
                    await this.onPressOfEntryFormSaveButton(trgObject);
                    let response = this.getApiResponseObject();;
                    if (response.success) {
                        console.log("No duplicate found. Proceeding with save..okok.");
                        this.router.navTo(-1);
                        MessageToast.show("Record added successfully");
                    }
                
            }
            catch (error) {
                MessageBox.show(error.message);
            }
        },
        generateDocumentCode: function (prefix, plant) {

            let today = new Date();
            let yyyy = today.getFullYear();
            let mm = String(today.getMonth() + 1).padStart(2, "0");
            let dd = String(today.getDate()).padStart(2, "0");
            let datePart = `${yyyy}${mm}${dd}`;

            //  Generate a random 4-digit number or sequential number
            let randomNum = Math.floor(1000 + Math.random() * 9000);

            //  Combine parts into a code
            let docCode = `${prefix || "DOC"}_${plant || "0000"}_${datePart}_${randomNum}`;

            return docCode;
        },
        FetchCSRToken: async function (value) {
                var myHeaders = new Headers();
                myHeaders.append("x-csrf-token", "fetch");
                await this.createNewModelUsingAPIFetchMethod(
                    'GET',
                    `/sap/opu/odata4/sap/zune_sb_plant_api/srvd_a2x/sap/zune_sd_plant_api/0001/ZUNE_CDS_Plant?$format=json`,
                    myHeaders,
                    '',
                    'InspectionData',
                    'json'
                );

            },
       onGrpoTransfer: async function () {
    try {
        debugger
        let loginInfo = this.getLoginInfo();
            
            const formMode = loginInfo.FormMode;
        await this.FetchCSRToken(); // Ensure CSRF Token is fetched before proceeding
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
         let csrfTokenValue = this.getCSRFTokenFromHeaders();

            if (csrfTokenValue) {
                await this.PostStockTransfer(csrfTokenValue, viewModel);
            } else {
                MessageToast.show("CSRF token not found.");
            }
        
    } catch (error) {
        console.error("Error in GRPO Transfer:", error);
        MessageToast.show("An error occurred while processing the GRPO transfer.");
    }
},
     

            PostStockTransfer: async function ( csrfTokenValue) {
                debugger;
                 var textData="";
               
              let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                let DocumentPosted  =  viewModel.getProperty("/DocumentPosted");
                if(DocumentPosted==false)
                    {
                        var currentDate = new Date();
                            // Convert to ISO 8601 format
                            var isoDate = currentDate.toISOString();
                        const GrpoTransferRequestData = {
                                            "PostingDate": this.getdate(),
                                            "GoodsMovementCode": "01",
                                            "to_MaterialDocumentItem": [
                                                {
                                                    "Material": viewModel.getProperty("/SKU"),
                                                    "Plant": viewModel.getProperty("/NPlantName"),
                                                    "StorageLocation": viewModel.getProperty("/NFloorName"),
                                                    "GoodsMovementType": "501",
                                                    "QuantityInEntryUnit": viewModel.getProperty("/GMCQty")
                                                }
                                            ]
                                        };
                            console.log(GrpoTransferRequestData);
                            const requestData = JSON.stringify(GrpoTransferRequestData);
                            console.log(requestData);
                            debugger;
                            try {
                                const CSRFToken = viewModel.getProperty("/CSRFToken");
                                var myHeaders = new Headers();
                                myHeaders.append("x-csrf-token", csrfTokenValue);
                                myHeaders.append("Content-Type", "application/json");
                                myHeaders.append("Accept", "application/json");
                                myHeaders.append("Cookie", "sap-XSRF_C9J_100=VdRtLhtyy8vkUz5kSr2ZSg%3d%3d20251118063051WNy46IF7uav-QJuAQLhgUDZHKQWy2GE-UoBD8tac6sk%3d; path=/; secure; HttpOnly");
                                const requestOptions = {
                                    method: "POST",
                                    headers: myHeaders,
                                    body: requestData,
                                    redirect: "follow"
                                };
                                debugger;
                                let isPostedSuccessfully = false;
                                await fetch(`/sap/opu/odata/sap/API_MATERIAL_DOCUMENT_SRV/A_MaterialDocumentHeader`, requestOptions)
                                    .then(async (response) => {
                                        debugger;
                                        textData = await response.json()

                                        console.log("textData -" + textData);
                                        if (response.ok) {
                                            isPostedSuccessfully = true;
                                            MessageToast.show("Transfer Posted.");
                                        } else {
                                            debugger;
                                            let oModel = new sap.ui.model.json.JSONModel(textData);
                                            this.getView().setModel(oModel, "ErrorJson");

                                            let ErrorModel = this.getView().getModel('ErrorJson');
                                            const FinalError = ErrorModel.getProperty('/error/message/value');
                                            

                                            MessageToast.show(FinalError);
                                        
                                        }
                                    })
                                    .then((result) => console.log(result))
                                    .catch((error) => {
                                        console.error(error);
                                        isPostedSuccessfully = false;
                                        MessageToast.show("Error in posting transfer.. Check log.");
                                    });
                                debugger;
                                if (isPostedSuccessfully) {
                                    const modelData = this.getView().getModel(this.getEntryFormDataSourceModelName()).getData();
                                    modelData.setProperty('/DocumentPosted', true); 
                                        this.getView().setModel(modelData, this.getEntryFormDataSourceModelName());   

                                    let trgObject = this.getView().getModel("SaveRequest").getData();
                                                console.log("Target Object:", trgObject);

                                                this.transferObjectValues(modelData, trgObject);
                                                await this.onPressOfEntryFormSaveButton(trgObject);
                                                let response = this.getApiResponseObject();;
                                                if (response.success) {
                                                    MessageToast.show("Stock transfer successfully...");
                                                }
                                }
                                else {
                                   // MessageToast.show("Error posting stock transfer. Check SAP logs");
                                }
                            } catch (error) {
                                MessageToast.show(error);
                            }
                            viewModel.refresh(true);
                }
                else
                {
                   MessageToast.show("Document Already Posted...");
                }
            },

            Validation:function()
            {
                const oModelData = this.getView().getModel(this.getEntryFormDataSourceModelName());
                  var ContractNM = oModelData.getProperty("/ContractNM");
                    var SuperwiserNM = oModelData.getProperty("/SuperwiserNM");
                    var FromProcess = oModelData.getProperty("/FromProcess");
                    var ToProcess = oModelData.getProperty("/ToProcess");
                    var ProductionAccountant = oModelData.getProperty("/ProductionAccountant");
                    var PlantNM = oModelData.getProperty("/PlantNM");
                    var FloorNM = oModelData.getProperty("/FloorNM");
                    var QANM = oModelData.getProperty("/QANM");
                    var CycleTime = oModelData.getProperty("/CycleTime");
                    var ShiftTime = oModelData.getProperty("/ShiftTime");
                    var NSuperwiserName = oModelData.getProperty("/NSuperwiserName");
                    var PalletNumber = oModelData.getProperty("/PalletNumber");
                    var NQAName = oModelData.getProperty("/NQAName");
                    var NContractName = oModelData.getProperty("/NContractCode");
                    var NPlantName = oModelData.getProperty("/NPlantName");
                    var NFloorName = oModelData.getProperty("/NFloorName");
                    if(ContractNM!="")
                    {
                        
                            if(SuperwiserNM!="")
                            {
                                if(FromProcess!="")
                                {
                                    if(ToProcess!="")
                                    {
                                        if(ProductionAccountant!="")
                                        {
                                                if(PlantNM!="")
                                                {
                                                        if(FloorNM!="")
                                                        {
                                                            if(QANM!="")
                                                            {
                                                                if(CycleTime!="")
                                                                {
                                                                   
                                                                        if(ShiftTime!="")
                                                                        {
                                                                            if(NSuperwiserName!="")
                                                                            {
                                                                                if(PalletNumber!="")
                                                                                {
                                                                                    if(NQAName!="")
                                                                                    {
                                                                                        if(NContractName!="")
                                                                                        {
                                                                                                if(NPlantName!="")
                                                                                                {
                                                                                                    if(NFloorName!="")
                                                                                                    {
                                                                                                        return true;
                                                                                                    }
                                                                                                    else
                                                                                                    {
                                                                                                        MessageBox.show("FloorName can name blank...");
                                                                                                         return false;
                                                                                                    }   
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                   MessageBox.show("PlantName can name blank..."); 
                                                                                                    return false; 
                                                                                                } 
                                                                                        }
                                                                                        else
                                                                                        {
                                                                                            MessageBox.show("ContractorName can name blank...");  
                                                                                             return false;
                                                                                        } 
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                       MessageBox.show("QA2 can name blank...");   
                                                                                        return false;
                                                                                    }  
                                                                                }
                                                                                else
                                                                                {
                                                                                   MessageBox.show("PalletName can name blank...");
                                                                                    return false;   
                                                                                }  
                                                                            }
                                                                            else
                                                                            {
                                                                                MessageBox.show("SuperwiserName can name blank..."); 
                                                                                 return false; 
                                                                            }  
                                                                        }
                                                                        else
                                                                        {
                                                                            MessageBox.show("ShiftTime can name blank...");  
                                                                             return false;
                                                                        }  
                                                                            
                                                                }
                                                                else
                                                                {
                                                                   MessageBox.show("CycleTime can name blank...");   
                                                                    return false;
                                                                }  
                                                            }
                                                            else
                                                            {
                                                                MessageBox.show("QA1 can name blank...");  
                                                                 return false;
                                                            }   
                                                        }
                                                        else
                                                        {
                                                            MessageBox.show("FloorName can name blank...");  
                                                             return false;
                                                        }    
                                                }
                                                else
                                                {
                                                    MessageBox.show("PlantName can name blank...");  
                                                     return false;
                                                }
                                        }
                                        else
                                        {
                                            MessageBox.show("ProductionAccountant can name blank...");  
                                             return false;
                                        }
                                    }
                                    else
                                    {
                                        MessageBox.show("ToProcess can name blank...");  
                                         return false;
                                    } 
                                }
                                else
                                {
                                    MessageBox.show("FromProcess can name blank..."); 
                                     return false;
                                }
                            }
                            else
                            {
                                MessageBox.show("Superwiser can name blank...");  
                                 return false;
                            }
                       
                    }
                    else
                    {
                        MessageBox.show("Contract can name blank..."); 
                         return false; 
                    }
            },
           


getCSRFTokenFromHeaders: function () {
    let csrfTokenValue = "";
    this.getResponseHeaderDataList().forEach(oHeaderDataObj => {
        if (oHeaderDataObj.pHeaderKey === "x-csrf-token") {
            csrfTokenValue = oHeaderDataObj.pHeaderValue;
        }
    });
    return csrfTokenValue;
},




        DataValidationsForSave: function () {
            let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            var inspectionLot = oModel.getProperty("/InspectionLot");
            if (!inspectionLot || inspectionLot == "undefined" || inspectionLot == "") {
                MessageToast.show("Select inspection lot");
                return false;
            }
            var postDate = oModel.getProperty("/PostDate");
            if (!postDate || postDate == "undefined" || postDate == "") {
                MessageToast.show("Select Post date");
                return false;
            }
            const quantity = oModel.getProperty(`/Quantity`);
            const acceptedQuantity = oModel.getProperty(`/AcceptedQuantity`);
            const rejectedQuantity = oModel.getProperty(`/RejectedQuantity`);
            const inputQuantity = this.ToDecimal(acceptedQuantity) + this.ToDecimal(rejectedQuantity);
            if (this.ToDecimal(inputQuantity) != this.ToDecimal(quantity)) {
                MessageToast.show("Accepted quantity and rejected quantity should be equal to quantity.");
                return false;
            }
            return true;
        },
       
         onFromProcess: function (oEvent) {
                debugger;
                 const key  = oModel.getProperty("/username");      // BusinessPartner Key
                 const text = oModel.getProperty("/Description");
                let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                
                
                oModel.setProperty("/Description", text);
                oModel.refresh();
        },



       _Validation: async function () {

    var oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
    var oData = oModel.getData();

    var sJobworkPo = oData.JobworkPo;

    // Current GMC Qty
    var currentGMCQty = parseFloat(oData.GMCQty || 0);

    // Total PO Qty Limit
    var poQty = parseFloat(oData.POQty || 0);

    // Fetch existing records
    var aExistingData = await this._getExistingRecords(sJobworkPo);

    // Existing GMC Total
    var existingTotal = 0;

    aExistingData.forEach(function (item) {

        // Ignore current editing record
        if (item.ID !== oData.ID) {

            existingTotal += parseFloat(item.GMCQty || 0);

        }

    });

    // Final Total
    var finalQty = existingTotal + currentGMCQty;

    // Validation
    if (finalQty > poQty) {

        sap.m.MessageBox.error(
            "Total GMC Qty cannot be greater than PO Qty.\n\n" +
            "Saved GMC Qty : " + existingTotal +
            "\nCurrent GMC Qty : " + currentGMCQty +
            "\nPO Qty : " + poQty
        );

        return false;
    }

    return true;
},
_getExistingRecords: async function (sJobworkPo) {
    await this.createNewModelUsingAPI(
						"GET",`/odata/v4/gmcheader-services/GMCHeader?$filter=JobworkPo eq '${sJobworkPo}' `,"","_GMC" 
						//"GET",`/odata/v4/gmcheader-services/GMCHeader`,"","GMC" 
					    );
						

						const oGMC1Model = this.getView().getModel("_GMC");
                        return oGMC1Model.getData().value || [];
},
        Todate:function(sDate)
        {
                // Convert string to JS Date
                var oDate = new Date(sDate);

                // Create formatter
                var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "dd/MM/yyyy"
                });

                // Format it
                var sFormattedDate = oFormat.format(oDate);

                return sFormattedDate;
        }


    });
});