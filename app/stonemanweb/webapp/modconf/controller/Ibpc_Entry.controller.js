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
    let _IbpcModel="";

    return genericentryform.extend("modconfcontroller.Ibpc_Entry", {
        onInit() {
            genericentryform.prototype.onInit.apply(this, arguments);

        },

        onBeforeShow: async function (oEvent) {
            debugger;
          let loginInfo = this.getLoginInfo();
            let ID=  loginInfo.RowId;
            const formMode = loginInfo.FormMode;

             let Desc= loginInfo.Username;
            let _AppModel=this.getView().getModel('sysModel');
            _AppModel.setProperty("/userDetails/UserDsc",Desc);
            _AppModel.refresh(true);
            if (formMode != undefined) {

                debugger;
               
                this.setEntryFormDataSourceURLToUpdateData("/odata/v4/ibpsservices/IBPC_Head('" + ID + "')");
                this.setEntryFormDataSourceURLToAddData("/odata/v4/ibpsservices/IBPC_Head");

              
                let oPathSaveReq = jQuery.sap.getModulePath(
                    "stonemanweb",
                    "/modconf/model/IBPCSaveRequest.json", //Save Request Model
                );

                let oModelSaveRequest = new sap.ui.model.json.JSONModel(oPathSaveReq);
                this.getView().setModel(oModelSaveRequest, "SaveRequest");

debugger;

                this.setEntryFormDataSourceURLForEditMode("/odata/v4/ibpsservices/IBPC_Head('" + ID + "')?$expand=IBPC_LineNo($orderby=LineNum asc)");
                let oPath = jQuery.sap.getModulePath(
                    "stonemanweb",
                    "/modconf/model/IBPCEntryForm.json", // Edit Response Model
                );
                let oModel = new sap.ui.model.json.JSONModel(oPath);
                this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());

                await this.showEntryForm(formMode);

                 if(formMode ==2)
                {
                            debugger;
                            this.handleUIOperation();
                                       
                }
                if(formMode ==3)
                {
                    this.byId("Copyfrom").setEnabled(true);
                }

            }

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
                   globalVarForUserId= userName;
				   globalVarForUserName=userName;
                }
            },
        	
          onEditPress: function (oEvent) {
                debugger;
           
					var oButton = oEvent.getSource();
					var oBindingContext = oButton.getBindingContext("EntryFormDataSourceModel");
					let oRowObject = oBindingContext.getProperty("ID");
                    let Item = oBindingContext.getProperty("ID");

                      let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    const ParentID = viewModel.getProperty("/ID");
                    let oModel = this.getView().getModel('sysModel');
                    
                    oModel.setProperty('/route/routeData/uniqueId',ParentID );
                     oModel.setProperty('/route/routeData/lastUniqueId',oRowObject );
                    this.getView().setModel(oModel, 'sysModel');



                      console.log("Path:", oContext.getPath());
                        console.log("Row:", oContext.getObject());


					this.setRouteData("2",oRowObject);
					var router = sap.ui.core.UIComponent.getRouterFor(this);
                     router.navTo("ProcessLinking");
                     
				
           
		},
      
         handleFormInEditMode: function () {
            let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            oModel.setProperty("/disableUsername", false);
        },
onCopyFrom: function () {

    if (!this._oCopyFromDialog) {

        var oTable = new sap.m.Table({
            mode: "SingleSelectLeft",
            selectionChange: this.onSalesOrderSelect.bind(this),

            columns: [
                new sap.m.Column({
                    header: new sap.m.Label({
                        text: "ID"
                    })
                }),
                  new sap.m.Column({
                    header: new sap.m.Label({
                        text: "SO No."
                    })
                }),

                new sap.m.Column({
                    header: new sap.m.Label({
                        text: "Customer"
                    })
                }),

                new sap.m.Column({
                    header: new sap.m.Label({
                        text: "Product"
                    })
                }),

                new sap.m.Column({
                    header: new sap.m.Label({
                        text: "Date"
                    })
                })
            ]
        });

        this._oCopyFromDialog = new sap.m.Dialog({
            title: "Select Sales Order",

            contentWidth: "50%",
            contentHeight: "40%",

            content: [
                oTable
            ],

            beginButton: new sap.m.Button({
                text: "OK",
                type: "Emphasized",
                press: this.onCopyFromOK.bind(this)
            }),

            endButton: new sap.m.Button({
                text: "Cancel",
                press: function () {
                    this._oCopyFromDialog.close();
                }.bind(this)
            })
        });

        this.getView().addDependent(this._oCopyFromDialog);
    }

    this.loadSalesOrders();

    this._oCopyFromDialog.open();
},
     
loadSalesOrders:async function () {
    let omodel =this.getView().getModel(this.getEntryFormDataSourceModelName());
    let SalesOrder=omodel.getProperty("/SalesOrderNo");
    let ItemCode=omodel.getProperty("/ItemCode");

    await this.createNewModelUsingAPI(
						"GET",`/odata/v4/ibpsservices/IBPC_Head?$expand=IBPC_LineNo&$filter=SalesOrderNo eq '${SalesOrder}' and ItemCode eq '${ItemCode}'`,"","_IbpcModel" 
					
					    );
						

						 _IbpcModel = this.getView().getModel("_IbpcModel");
		
  

    this._oCopyFromDialog.setModel(_IbpcModel);

    var oTable = this._oCopyFromDialog.getContent()[0];

    oTable.bindItems({
        path: "/value",

        template: new sap.m.ColumnListItem({
            cells: [
                new sap.m.Text({
                    text: "{ID}"
                }),
                 new sap.m.Text({
                    text: "{SalesOrderNo}"
                }),

                new sap.m.Text({
                    text: "{Buyer}"
                }),

                new sap.m.Text({
                    text: "{ItemCode}"
                }),

                new sap.m.Text({
                    text: "{createdAt}"
                })
            ]
        })
    });
},
onCopyFromOK: function () {
debugger
    if (!this._oSelectedSalesOrder) {
        sap.m.MessageToast.show("Please select a Sales Order");
        return;
    }

    var oSO = this._oSelectedSalesOrder;
debugger
    var oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());

    oModel.setProperty("/ItemName", oSO.ItemName);
    oModel.setProperty("/Buyer", oSO.Buyer);
    oModel.setProperty("/CadNo", oSO.CadNo);
    oModel.setProperty("/PkgUnit", oSO.PkgUnit);
    oModel.setProperty("/Date", oSO.Date);
    oModel.setProperty("/IBPC_LineNo",oSO.IBPC_LineNo);

    this._oCopyFromDialog.close();
},
onSalesOrderSelect: function (oEvent) {
debugger
    this._oSelectedSalesOrder =
        oEvent.getParameter("listItem").getBindingContext().getObject();

    console.log(this._oSelectedSalesOrder);
},
        onCancel:function()
        {
            var router = sap.ui.core.UIComponent.getRouterFor(this);
                //MessageToast.show("Redirecting to GMC.....")
                router.navTo("IBPCList");
        },
        handleUIOperation: async function () {
            debugger;
        this.byId("Copyfrom").setEnabled(false);
            //this.FillStoragelocation();
          
        },
      
        AddblankRow:function()
        {
           var oModel = this.getView().getModel("EntryFormDataSourceModel");
var aRows = oModel.getProperty("/IBPC_LineNo") || [];

aRows.push({
   
    INTComponentCode: "",
    INTDescription: "",
    INTQuantity: null,
    INTUom: "",
    INTRemarks: "",

    SAMComponentCode: "",
    SAMDescription: "",
    SAMQuantity: null,
    SAMUom: "",
    ADMRemarks: "",

    ALLComponentCode: "",
    ALLDescription: "",
    ALLQuantity: null,
    ALLUom: "",
    ALLRemarks: "",

    EDIComponentCode: "",
    EDIDescription: "",
    EDIQuantity: null,
    EDIUom: "",
    EDIRemarks: ""

});

oModel.setProperty("/IBPC_LineNo", aRows);
oModel.refresh(true);
        },

         cflForSalesOrder: async function (oEvent) {
            try {

                debugger;
                await this.createNewModelUsingAPI(
                    'GET',
                    //`/sap/opu/odata4/sap/zsb_so_all/srvd_a2x/sap/zsd_so_all/0001/ZDD_SALESORDER_ALL?filter=OverallSDProcessStatus eq 'C'&format=json`,
                     //`/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder?$filter=OverallSDProcessStatus eq 'C'&format=json`,
                     `/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder?$format=json`,
                '',
                this.getCflListViewDataSourceModelName()
                );
                this.setCflDisplayColumns(["SalesOrder", "SalesOrder"]);
                this.setCflDataColumns(["SalesOrder", "SalesOrder"]);
                this.setCflValueAndDisplay("SalesOrder", "SalesOrder", "", "");

                MessageToast.show("Data loading please wait...");

                this.showCfl(
                    "CflSalesOrder",
                    this.getCflListViewDataSourceModelName(),
                    "d/results",
                    this.onConfirmCflSalesOrder.bind(this)
                );
            }
            catch (error) {
                MessageBox.show("cflForSalesOrder -: " + error.message);
            }
        },

         onConfirmCflSalesOrder: async function () {
            debugger;
             let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
         
            let x = this.getCflObject();
            oModel.setProperty("/SalesOrderNo", x.SalesOrder);
             oModel.setProperty("/Buyer", x.SoldToParty);
             //this.AddblankRow();  
           

        },
          cflForItemCode: async function (oEvent) {
            try {
            let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            let SalesOrder=oModel.getProperty("/SalesOrderNo");
                debugger;
                await this.createNewModelUsingAPI(
                    'GET',
                    //`/sap/opu/odata4/sap/zune_sb_porreport_api/srvd_a2x/sap/zune_sd_zune_dd_po_prodord/0001/ZUne_DD_PO_ProdOrd?$filter=Quantity gt 0 and UOM eq 'PC' &format=json`,
                     `/sap/opu/odata4/sap/zune_sb_so_head_item/srvd_a2x/sap/zune_sd_so_head_item/0001/Zune_CDS_So_HeadItem?$filter=SalesDocument eq '${SalesOrder}'&$top=5000`,
                     //`/sap/opu/odata4/sap/zsb_solines_all/srvd_a2x/sap/zsd_soline_all/0001/ZDD_SALESORDERLINE_ALL?$filter=SalesOrder eq '${SalesOrder}'`,
                '',
                this.getCflListViewDataSourceModelName()
                );
                this.setCflDisplayColumns(["SapSKUNo", "SapSKUNo"]);
                this.setCflDataColumns(["SapSKUNo", "SapSKUNo"]);
                this.setCflValueAndDisplay("SapSKUNo", "SapSKUNo", "", "");

                MessageToast.show("Data loading please wait...");

                this.showCfl(
                    "CflItemCode",
                    this.getCflListViewDataSourceModelName(),
                    "value",
                    this.onConfirmCflItemCode.bind(this)
                );
            }
            catch (error) {
                MessageBox.show("CflItemCode -: " + error.message);
            }
        },

         onConfirmCflItemCode: async function () {
            debugger;
             let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
         debugger;
            let x = this.getCflObject();
            oModel.setProperty("/ItemCode", x.SapSKUNo);
             oModel.setProperty("/ItemName", x.SalesDocumentItemText);
             this.compareBOM(x.SapSKUNo)
           

        },

         cflForComponentType: async function (oEvent) {
            try {

                debugger;
                  var oInput = oEvent.getSource();
                var oContext = oInput.getBindingContext("EntryFormDataSourceModel");  // Get the context of the current row
                // Get the Plant from the current row context
                this._cflContext = oContext;
                await this.createNewModelUsingAPI(
                    'GET',
                    //`/sap/opu/odata4/sap/zsb_so_all/srvd_a2x/sap/zsd_so_all/0001/ZDD_SALESORDER_ALL?filter=OverallSDProcessStatus eq 'C'&format=json`,
                     //`/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder?$filter=OverallSDProcessStatus eq 'C'&format=json`,
                     `/sap/opu/odata4/sap/zune_sb_mat_ext_api/srvd_a2x/sap/zune_sd_mat_ext_api/0001/ZC_MAT_EXT_DT_API?$apply=groupby((Producttype))`,
                '',
                this.getCflListViewDataSourceModelName()
                );
                this.setCflDisplayColumns(["ProductType", "ProductType"]);
                this.setCflDataColumns(["Producttype", "Producttype"]);
                this.setCflValueAndDisplay("Producttype", "Producttype", "", "");

                MessageToast.show("Data loading please wait...");

                this.showCfl(
                    "CflType",
                    this.getCflListViewDataSourceModelName(),
                    "value",
                    this.onConfirmCflItemMasterType.bind(this)
                );
            }
            catch (error) {
                MessageBox.show("cflForSalesOrder -: " + error.message);
            }
        },

         onConfirmCflItemMasterType: async function () {
            debugger;
             let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
         
           // let x = this.getCflObject();
             let x = this.getCflObject();   
            this._cflContext.setProperty("EDIType", x.Producttype);

           
             //this.AddblankRow();  
           

        },

         cflForComponent: async function (oEvent) {
            try {

                debugger;
                 var oInput = oEvent.getSource();
                var oContext = oInput.getBindingContext("EntryFormDataSourceModel");  // Get the context of the current row
                // Get the Plant from the current row context
                this._cflContext = oContext;
                var selectedEDIType = oContext.getProperty("EDIType");
                
                //  var oInput = oEvent.getSource();
              //  var oContext = oInput.getBindingContext("EntryFormDataSourceModel");  // Get the context of the current row
                // Get the Plant from the current row context
                //this._cflContext = oContext;
                await this.createNewModelUsingAPI(
                    'GET',
                    //`/sap/opu/odata4/sap/zsb_so_all/srvd_a2x/sap/zsd_so_all/0001/ZDD_SALESORDER_ALL?filter=OverallSDProcessStatus eq 'C'&format=json`,
                     //`/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder?$filter=OverallSDProcessStatus eq 'C'&format=json`,
                     `/sap/opu/odata4/sap/zune_sb_mat_ext_api/srvd_a2x/sap/zune_sd_mat_ext_api/0001/ZC_MAT_EXT_DT_API?$filter=Producttype eq '${selectedEDIType}'&$select=ProductId,ProductDesc,Baseunitofmeasure&$top=100000`,
                '',
                this.getCflListViewDataSourceModelName()
                );
                this.setCflDisplayColumns(["ProductId", "ProductDesc","Baseunitofmeasure"]);
                this.setCflDataColumns(["ProductId", "ProductDesc","Baseunitofmeasure"]);
                this.setCflValueAndDisplay("ProductId", "ProductDesc", "Baseunitofmeasure", "");

                MessageToast.show("Data loading please wait...");

                this.showCfl(
                    "CflComponent",
                    this.getCflListViewDataSourceModelName(),
                    "value",
                    this.onConfirmCflItemMaster.bind(this)
                );
            }
            catch (error) {
                MessageBox.show("cflForSalesOrder -: " + error.message);
            }
        },

         onConfirmCflItemMaster: async function () {
            debugger;
             let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
         
           // let x = this.getCflObject();
             let x = this.getCflObject();
            this._cflContext.setProperty("EDIComponentCode", x.ProductId);
              this._cflContext.setProperty("EDIDescription", x.ProductDesc);
                this._cflContext.setProperty("EDIUom", x.Baseunitofmeasure);

           
             //this.AddblankRow();  
           

        },

        navBack: function () {
            //history.go(-1);
            var router = sap.ui.core.UIComponent.getRouterFor(this);
             router.navTo("IBPCList");
        },


     async compareBOM(SapSKUNo) {
    try {
debugger;
 
        // Load BOM1
        await this.createNewModelUsingAPI(
            'GET',
            `/sap/opu/odata4/sap/zorn_sb_intbom/srvd_a2x/sap/zorn_sd_intbom/0001/ZORN_CDS_INTBOM_API?$filter=ParentItem eq '${SapSKUNo}'`,
            '',
            "BOM1"
        );

        // Load BOM2
        await this.createNewModelUsingAPI(
            'GET',
            `/sap/opu/odata4/sap/zorn_sb_extbom_ibpc/srvd_a2x/sap/zorn_sd_extbom_ibpc/0001/ZORN_CDS_EXTBOM_IBPC(ItemNo='${SapSKUNo}',PlantC='1100')/Set`,
            '',
            "BOM2"
        );
debugger;
        // Get API Data
        const bom1 = this.getView().getModel("BOM1").getData().value || [];
        const bom2 = this.getView().getModel("BOM2").getData().value || [];

        // Create lookup map for BOM2
        const bom2Map = new Map();

        bom2.forEach(item => {
            bom2Map.set(item.ChildItem, item);
        });

        const compareData = [];

        // Compare BOM1 with BOM2
        bom1.forEach(item1 => {

            const item2 = bom2Map.get(item1.ChildItem);

            if (item2) {

                // Case 1 - Present in both
                compareData.push({
                    Serial:"",
                    Status: "Case1",

                    INTComponentCode: item1.ChildItem,

                    INTDescription: item1.ChildDesc,
                    INTQuantity: item1.Quantity,
                    INTUom: item1.ChildUOM,
                    INTRemarks:"",
                    
                    SAMComponentCode:item2.ChildItem,
                    SAMDescription: item2.ChildDesc,
                    SAMQuantity: item2.ChildQuantity,
                    SAMUom: item2.ChildUOM,

                    ALLComponentCode:item1.ChildItem,
                    ALLDescription:item1.ChildDesc,
                    ALLQuantity:item1.Quantity,
                    ALLUom:item1.ChildUOM,

                    EDIComponentCode:"",
                    EDIDescription:"",
                    EDIQuantity:"0",
                    EDIUom:"",
                    EDIRemarks:""
                });

                // Remove matched record
                bom2Map.delete(item1.ChildItem);

            } else {

                // Case 2 - Exists only in BOM1
                compareData.push({
                    Serial:"",
                    Status: "Case2",

                    INTComponentCode: item1.ChildItem,

                    INTDescription: item1.ChildDesc,
                    INTQuantity: item1.Quantity,
                    INTUom: item1.ChildUOM,
                    INTRemarks:"",

                    SAMComponentCode:"",
                    SAMDescription:"" ,
                    SAMQuantity:"0" ,
                    SAMUom: "",

                    ALLComponentCode:item1.ChildItem,
                    ALLDescription:item1.ChildDesc,
                    ALLQuantity:item1.Quantity,
                    ALLUom:item1.ChildUOM,

                    EDIComponentCode:"",
                    EDIDescription:"",
                    EDIQuantity:"0",
                    EDIUom:"",
                    EDIRemarks:""
                });
            }

        });

        // Remaining records => Case3
        bom2Map.forEach(item2 => {

            compareData.push({
                Serial:"",
                Status: "Case3",

                 INTComponentCode: "",

                    INTDescription: "",
                    INTQuantity: "0",
                    INTUom: "",
                    INTRemarks:"",

                    SAMComponentCode:item2.ChildItem,
                    SAMDescription: item2.ChildDesc,
                    SAMQuantity: item2.ChildQuantity,
                    SAMUom: item2.ChildUOM,

                    ALLComponentCode:"",
                    ALLDescription:"",
                    ALLQuantity:"0",
                    ALLUom:"",

                    EDIComponentCode:"",
                    EDIDescription:"",
                    EDIQuantity:"0",
                    EDIUom:"",
                    EDIRemarks:""
            });

        });

        // Create Compare Model
        const oCompareModel = new sap.ui.model.json.JSONModel(compareData);

       // this.getView().setModel(oCompareModel, "IBPC_LineNo");

      
        console.log(compareData);

         let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
       
                compareData.sort(function (a, b) {
                    return a.Status.localeCompare(b.Status);
                });

                compareData.forEach(function (item, index) {
                item.LineNum = index + 1;
                });
            oModel.setProperty("/IBPC_LineNo", compareData);

    } catch (error) {

        console.error(error);

        sap.m.MessageBox.error(error.message || "Error while comparing BOMs");

    }
},

onSearch: function (oEvent) {
			var sQuery = oEvent.getParameter("newValue"); // Get search input
			var filters=[];
			if(sQuery)
			{
				var filter1 = new sap.ui.model.Filter({path:"GMCNo",operator:sap.ui.model.FilterOperator.EQ,value1: sQuery});
				var filter2 = new sap.ui.model.Filter({ path: "JobworkPo", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery });
				filters=[filter1, filter2];
				var finalFilter = new sap.ui.model.Filter({filters:filters, and:false});
		}
		var otable = this.byId("Tbl");
		otable.getBinding("items").filter(finalFilter);
			
	},
OnProcessClick:function(oEvent){
    try{
        debugger;
            let loginInfo = this.getLoginInfo();
            let ID=  loginInfo.RowId;
            const formMode = loginInfo.FormMode;

         if(formMode=="2")
         {
        let model= this.getView().getModel(this.getEntryFormDataSourceModelName());
        let _ID=model.getProperty("/ID");
        let _ParentItemCode=model.getProperty("/ItemCode");
       

                    var oButton = oEvent.getSource();
					var oBindingContext = oButton.getBindingContext("EntryFormDataSourceModel");
					let oRowObject = oBindingContext.getProperty("ID");
                    let childItemCode="";
                    let INTComponentCode = oBindingContext.getProperty("INTComponentCode");
                    let SAMComponentCode = oBindingContext.getProperty("SAMComponentCode");
                    let ALLComponentCode = oBindingContext.getProperty("ALLComponentCode");
                    if(INTComponentCode!="")
                    {
                        childItemCode=INTComponentCode;
                    }
                    else if(SAMComponentCode!="")
                    {
                        childItemCode=SAMComponentCode;
                    }
                    else if(ALLComponentCode!="")
                    {
                        childItemCode=ALLComponentCode;
                    }
                    
                    let oModel = this.getView().getModel('sysModel');
                        oModel.setProperty('/route/routeData/lastUniqueId', _ID);
                        oModel.setProperty('/route/routeData/ParentItemCode', _ParentItemCode);
                        oModel.setProperty('/route/routeData/ChildItemCode', childItemCode);

					this.setRouteData("2",oRowObject);
					var router = sap.ui.core.UIComponent.getRouterFor(this);
                     router.navTo("ProcessLinking");
                }
    }
    catch (error) {
                MessageBox.show(error.message);
            }
},
       
        onSave: async function () {
            try {
                debugger
              let  isDataExistsForPosting=false;
                    const oModelData = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    const _line=oModelData.getProperty("/IBPC_LineNo");
                    if (_line?.length) {

                         //    const ProcessperameterLines =oModelData.getProperty("/ProcessperameterLines");
                      const { IBPC_LineNo = [] } = oModelData.getData();
                            IBPC_LineNo.forEach((element, index) =>
                                 {
                                    if (element.EDIQuantity == "") {
                                    MessageToast.show("Quantity can not Empty for line "+index);
                                     isDataExistsForPosting = true;
                                }
                            });
                              if (!isDataExistsForPosting) {
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
                                     var router = sap.ui.core.UIComponent.getRouterFor(this);
                                    router.navTo("IBPCList");
                                }
                            }
                            }
                            else{
                                MessageToast.show("Table can not blank");
                            }
            }
            catch (error) {
                MessageBox.show(error.message);
            }
        },


    });
});