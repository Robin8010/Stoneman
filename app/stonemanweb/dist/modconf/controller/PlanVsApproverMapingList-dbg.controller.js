sap.ui.define([
    "core/generic/genericentryform",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (genericentryform, MessageToast, MessageBox, Controller) {
    "use strict";
    let UserType;
    let globalVarForUserId = "";
    let globalVarForUserName="";
    let _cflContext;
    return genericentryform.extend("modconfcontroller.PlanVsApproverMapingList", {


        onInit: function () {
            genericentryform.prototype.onInit.apply(this, arguments);

        },
        onBeforeShow: async function (oEvent) {
            this.isValidUser();
            this.setRouteData("2", "");
            this.identifyFormMode(oEvent);
            //check FormMode
            const formMode = this.getFormMode();
            const _RoutData = this.getRouteData();
            var abc = _RoutData.uniqueId
            if (formMode != undefined) {

                debugger;
                let ID = _RoutData.uniqueId
                this.setEntryFormDataSourceURLToUpdateData("/odata/v4/user-mapping-services/UserMapping('" + ID + "')");
                this.setEntryFormDataSourceURLToAddData("/odata/v4/user-mapping-services/UserMapping");
                this.setEntryFormDataSourceURLForEditMode("/odata/v4/user-mapping-services/UserMapping");

                let oPathSaveReq = jQuery.sap.getModulePath(
                    "stonemanweb",
                    "/modconf/model/PlantVsAppSaveReq.json", //Save Request Model
                );
                debugger;
                let oModelSaveRequest = new sap.ui.model.json.JSONModel(oPathSaveReq);
                this.getView().setModel(oModelSaveRequest, "SaveRequest");


                let oPath = jQuery.sap.getModulePath(
                    "stonemanweb",
                    "/modconf/model/PlantVsAppEntryForm.json", // Edit Response Model
                );
                let oModel = new sap.ui.model.json.JSONModel(oPath);
                this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
                await this.FillListView();
               // await this.showEntryFormForSpetialForm();
               // oGMCModel.refresh(true);
                // New row to insert


            }
            this.handleUIOperation();
        },
        
        
 FillListView: async function () {
                           
debugger;
                            // 3️⃣ Fetch fresh data from backend
                            await this.createNewModelUsingAPI(
                                "GET",
                                `/odata/v4/user-mapping-services/UserMapping?$top=100000`,
                                "",
                                "EntryFormDataSourceModel" // keep model name same as your table binding
                            );

                            // 4️⃣ Get model reference and refresh the UI
                            const oGMCModel = this.getView().getModel("EntryFormDataSourceModel");
                            oGMCModel.refresh(true);

			},
        
        handleUIOperation: async function () {
            debugger;
           // await this.cflForPlant();
            //await this._populateStorageLocations();
            // await this.FillStoragelocation();
           // await this.FillQAL1Approval();
            //await this.FillQAL2Approval();
            //await this.ContractorName();
           // await this.FillSuperWiser();
            //await this.FillProductionAccount();
            
             await this.FillShift();

        },

        ContractorName: async function () {
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            debugger;
            await this.createNewModelUsingAPI(
                'GET',
                `/sap/opu/odata/sap/API_BUSINESS_PARTNER/A_Supplier?$filter=SupplierAccountGroup eq 'ZJW'&$format=json`,
                '',
                'Contractor'
            );
            debugger
            let odata = this.getView().getModel('Contractor');//Uncomment when API run
            let ContractorList = odata.getProperty("/d/results");

            //const { value = [] } = ContractorList || {};

            viewModel.setProperty("/ContractorList", []); // clear array
            viewModel.setProperty("/ContractorList", ContractorList);
            viewModel.refresh(true);
        },

        onPlantSelect: function (event) {
            debugger;
            const selected = event.getSource().getSelectedItem();
            const key = selected.getKey();     // BusinessPartner

           // this.cflForStorageAfterPlant(key);

        },

      

        FillSuperWiser: async function () {
            debugger;
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            await this.createNewModelUsingAPI(
                'GET',
                //`/odata/v4/user-master-services/UserMasterTT?filter=ID eq '${globalVarForL2UserId}'`,
                `/odata/v4/user-master-services/UserMasterT?$filter=IsSuperwiser eq true`,
                '',
                'Superwiser'
            );


            const data = this.getView().getModel('Superwiser').getData();//Uncomment when API run

            const { value = [] } = data || {};

            viewModel.setProperty("/SuperwiserNameList", []); // clear array
            viewModel.setProperty("/SuperwiserNameList", value);
            viewModel.refresh(true);
        },

     

          FillProductionAccount: async function (oEvent) {
            try {

                debugger;
                var oInput = oEvent.getSource();
                var oContext = oInput.getBindingContext("EntryFormDataSourceModel");  // Get the context of the current row
                // Get the Plant from the current row context
                this._cflContext = oContext;
               
               
                await this.createNewModelUsingAPI(
                    'GET',
                    //`/sap/opu/odata4/sap/zune_sb_porreport_api/srvd_a2x/sap/zune_sd_zune_dd_po_prodord/0001/ZUne_DD_PO_ProdOrd?$filter=Quantity gt 0 and UOM eq 'PC' &format=json`,
                     `/odata/v4/user-master-services/UserMasterT?$filter=IsProductionAccount eq true`,
                '',
                this.getCflListViewDataSourceModelName()
                );
                this.setCflDisplayColumns(["username", "Description"]);
                this.setCflDataColumns(["username", "Description"]);
                this.setCflValueAndDisplay("username", "Description", "", "");

                MessageToast.show("Data loading please wait...");

                this.showCfl(
                    "CflProdteam",
                    this.getCflListViewDataSourceModelName(),
                    "value",
                    this.onConfirmCflProdAccount.bind(this)
                );
            }
            catch (error) {
                MessageBox.show("cflForUserList -: " + error.message);
            }
        },

         onConfirmCflProdAccount: async function () {
            debugger;
            let x = this.getCflObject();
            this._cflContext.setProperty("Prodteam", x.username);
           

        },

        Plant: async function () {
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            debugger;
            await this.createNewModelUsingAPI(
                'GET',
                `/sap/opu/odata4/sap/zune_sb_plant_api/srvd_a2x/sap/zune_sd_plant_api/0001/ZUNE_CDS_Plant`,
                '',
                'Plant'
            );
            const data = this.getView().getModel('Plant').getData();//Uncomment when API run


            const { value = [] } = data || {};

            viewModel.setProperty("/PlantList", []); // clear array
            viewModel.setProperty("/PlantList", value);
            viewModel.refresh(true);
        },
        _populateStorageLocations: function () {
            // Get the data from the model
            var modelData = this.getView().getModel(this.getEntryFormDataSourceModelName()).getData();

            // Check if modelData.value is an array
            if (Array.isArray(modelData.value)) {
                // Loop through each row in the value array
                modelData.value.forEach(function (rowData) {
                    var selectedPlant = rowData.Plant;  // Get the plant for this row
                    debugger;
                    if (selectedPlant) {
                        // Get the filtered storage locations for this plant
                        // var filteredStorageLocations = this.getFilteredStorageLocations(selectedPlant);

                        // Bind the filtered storage location list to the row's StoragelocationList
                        // rowData.StoragelocationList = filteredStorageLocations;
                    }
                }, this);  // 'this' ensures the correct context (controller) is used inside the callback

                // After binding the filtered data, update the model with the modified data
                this.getView().getModel(this.getEntryFormDataSourceModelName()).setData(modelData);
                this.getView().getModel(this.getEntryFormDataSourceModelName()).refresh();
            } else {
                console.error("Model data 'value' is not an array:", modelData.value);
            }
        },
        // Loop through each row in the model data
        FillStoragelocation: async function () {
            debugger
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            // let _data = this.getView().getModel(this.getEntryFormDataSourceModelName()).getData();

            //let _plant = viewModel.getProperty("value/Plant"); 

            debugger;
            await this.createNewModelUsingAPI(
                'GET',
                `/sap/opu/odata4/sap/zune_sb_storagelocation_api/srvd_a2x/sap/zune_sd_storagelocation_api/0001/ZUNE_CDS_StorageLoactionAPI?$top=3000`,
                // `/sap/opu/odata4/sap/zune_sb_storagelocation_api/srvd_a2x/sap/zune_sd_storagelocation_api/0001/ZUNE_CDS_StorageLoactionAPI?$filter=Plant eq '${_plant}'`,
                '',
                'Storagelocation'
            );
            const data = this.getView().getModel('Storagelocation').getData();//Uncomment when API run


            const { value = [] } = data || {};

            viewModel.setProperty("/StoragelocationList", []); // clear array
            viewModel.setProperty("/StoragelocationList", value);
            viewModel.refresh(true);
        },
       

         cflForQA1: async function (oEvent) {
            try {

                debugger;
                var oInput = oEvent.getSource();
                var oContext = oInput.getBindingContext("EntryFormDataSourceModel");  // Get the context of the current row
                // Get the Plant from the current row context
                this._cflContext = oContext;
               
               
                await this.createNewModelUsingAPI(
                    'GET',
                    //`/sap/opu/odata4/sap/zune_sb_porreport_api/srvd_a2x/sap/zune_sd_zune_dd_po_prodord/0001/ZUne_DD_PO_ProdOrd?$filter=Quantity gt 0 and UOM eq 'PC' &format=json`,
                    `/odata/v4/user-master-services/UserMasterT?$filter=L1Approver eq true`,
                '',
                this.getCflListViewDataSourceModelName()
                );
                this.setCflDisplayColumns(["ID", "Description"]);
                this.setCflDataColumns(["ID", "Description"]);
                this.setCflValueAndDisplay("ID", "Description", "", "");

                MessageToast.show("Data loading please wait...");

                this.showCfl(
                    "CflQA1",
                    this.getCflListViewDataSourceModelName(),
                    "value",
                    this.onConfirmCflQA1.bind(this)
                );
            }
            catch (error) {
                MessageBox.show("cflForUserList -: " + error.message);
            }
        },

         onConfirmCflQA1: async function () {
            debugger;
            let x = this.getCflObject();
            this._cflContext.setProperty("QA1", x.username);
           

        },

        FillQAL2Approval: async function () {
            debugger;
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            ///sap/opu/odata4/sap/zune_sb_storagelocation_api/srvd_a2x/sap/zune_sd_storagelocation_api/0001/ZUNE_CDS_StorageLoactionAPI?$filter=Plant eq '${plantCode}'
            await this.createNewModelUsingAPI(
                'GET',
                // `/odata/v4/user-master-services/UserMasterTT?filter=ID eq '${globalVarForL1UserId}'`,
                `/odata/v4/user-master-services/UserMasterT?$filter=L1Approver eq true`,
                '',
                'QAUser'
            );
            debugger;
            const data = this.getView().getModel('QAUser').getData();//Uncomment when API run

            const { value = [] } = data || {};

            viewModel.setProperty("/QAListL2", []); // clear array
            viewModel.setProperty("/QAListL2", value);
            viewModel.refresh(true);
        },

         FillProcess: async function (oEvent) {
            try {

                debugger;
                var oInput = oEvent.getSource();
                var oContext = oInput.getBindingContext("EntryFormDataSourceModel");  // Get the context of the current row
                // Get the Plant from the current row context
                this._cflContext = oContext;
               
               
                await this.createNewModelUsingAPI(
                    'GET',
                    //`/sap/opu/odata4/sap/zune_sb_porreport_api/srvd_a2x/sap/zune_sd_zune_dd_po_prodord/0001/ZUne_DD_PO_ProdOrd?$filter=Quantity gt 0 and UOM eq 'PC' &format=json`,
                   `/sap/opu/odata4/sap/zune_sb_fromprocess/srvd_a2x/sap/zune_sd_fromprocess/0001/Zune_CDS_FromProcess`,
                '',
                this.getCflListViewDataSourceModelName()
                );
                this.setCflDisplayColumns(["Code", "Text"]);
                this.setCflDataColumns(["Code", "text"]);
                this.setCflValueAndDisplay("Code", "text", "", "");

                MessageToast.show("Data loading please wait...");

                this.showCfl(
                    "CflProcess",
                    this.getCflListViewDataSourceModelName(),
                    "value",
                    this.onConfirmProcess.bind(this)
                );
            }
            catch (error) {
                MessageBox.show("cflForUserList -: " + error.message);
            }
        },

        onConfirmProcess: async function () {
            debugger;
            let x = this.getCflObject();
            this._cflContext.setProperty("ToProcess", x.Code);
           

        },

       
        

         FillShift: async function () {
            debugger;
              var Model = [{ ID: "0", Name: "Genral"},{ ID: "1", Name: "First"},{ ID: "2", Name: "Second"}];
             // let modal =new sap.ui.model.json.JSONModel(loginModel);

            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
           

            viewModel.setProperty("/Shift", []); // clear array
            viewModel.setProperty("/Shift", Model);
            viewModel.refresh(true);
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
                   globalVarForUserId= userid;
				   globalVarForUserName=userName;
                }
            },

        onAddRow: function (oEvent) {
            debugger;
            //Check Is blank row exist
            let FormModel = this.getView().getModel("EntryFormDataSourceModel").getData().value;
            let PList = FormModel.filter(r => r.Plant == "");
            let Storage = FormModel.filter(r => r.Storage == "");
            let Contractor = FormModel.filter(r => r.Contractor == "");
            let Superviser = FormModel.filter(r => r.Superviser == "");
            let QA1 = FormModel.filter(r => r.QA1 == "");
            let QA2 = FormModel.filter(r => r.QA2 == "");
            let ToProcess = FormModel.filter(r => r.ToProcess == "");
            let Prodteam = FormModel.filter(r => r.Prodteam == "");
            if (PList.length > 0) {
                MessageToast.show("Plant can not blank...");
                return false;
            }
            else if (Storage.length > 0) {
                MessageToast.show("Storage can not blank...");
                return false;
            }
            else if (Contractor.length > 0) {
                MessageToast.show("Contractor can not blank...");
                return false;
            }
            else if (Superviser.length > 0) {
                MessageToast.show("Superviser can not blank...");
                return false;
            }
            else if (QA1.length > 0) {
                MessageToast.show("QA1 can not blank...");
                return false;
            }
           
            else if (ToProcess.length > 0) {
                MessageToast.show("To Process can not blank...");
                return false;
            }
            else if (Prodteam.length > 0) {
                MessageToast.show("Production Accountant can not blank...");
                return false;
            }
            else {
                let _omodel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                let data = _omodel.getData();

                // New row to insert
                const newMapping = {
                    "Plant": "",
                    "Storage": "",
                    "Contractor": "",
                    "Superviser": "",
                    "QA1": "",
                    "Prodteam": "",
                    "QA2": "",
                    "ToProcess ": "",
                    "ExtraField": "New",
                    "ISActive": true
                };
                data.value.push(newMapping);
                _omodel.setData(data);
                _omodel.refresh();
            }

            //}

        },
        onCancel: function () {
            history.go(-1);
        },
         OnExport: function () {

    // Get main model data
    let oModel = this.getView().getModel("EntryFormDataSourceModel");
    let aData = oModel.getData().value || [];

    // Prepare export data
    let aExportData = aData.map(function (item) {

        return {
            Plant: item.Plant || "",
            Storage: item.Storage || "",
            ToProcess: item.ToProcess || "",
            Contractor: item.Contractor || "",
            Superviser: item.Superviser || "",
            QA1: item.QA1 || "",
            QA2: item.QA2 || "",
              Prodteam: item.Prodteam || "",
                Shift: item.Shift || ""
        };

    });

    // Convert JSON to worksheet
    let worksheet = XLSX.utils.json_to_sheet(aExportData);

    // Create workbook
    let workbook = XLSX.utils.book_new();

    // Append sheet
    XLSX.utils.book_append_sheet(workbook, worksheet, "InspectionLots");

    // Export Excel
    XLSX.writeFile(workbook, "InspectionLotExport.xlsx");
},
        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue"); // Get search input
            var filters = [];
            if (sQuery) {
                var filter1 = new sap.ui.model.Filter({ path: "Plant", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery });
                filters = [filter1];
                var finalFilter = new sap.ui.model.Filter({ filters: filters, and: false });
            }
            var otable = this.byId("Tbl");
            otable.getBinding("items").filter(finalFilter);

        },

        onSave: async function () {
            try {
                debugger;
                let FormModel = this.getView().getModel("EntryFormDataSourceModel").getData().value;
                let PList = FormModel.filter(r => r.Plant == "");
                let Storage = FormModel.filter(r => r.Storage == "");
                let Contractor = FormModel.filter(r => r.Contractor == "");
                let Superviser = FormModel.filter(r => r.Superviser == "");
                let QA1 = FormModel.filter(r => r.QA1 == "");
                let QA2 = FormModel.filter(r => r.QA2 == "");
                let ToProcess = FormModel.filter(r => r.ToProcess == "");
                let Prodteam = FormModel.filter(r => r.Prodteam == "");
                if (PList.length > 0) {
                    MessageToast.show("Plant can not blank...");
                    return false;
                }
                else if (Storage.length > 0) {
                    MessageToast.show("Storage can not blank...");
                    return false;
                }
                else if (Contractor.length > 0) {
                    MessageToast.show("Contractor can not blank...");
                    return false;
                }
                else if (Superviser.length > 0) {
                    MessageToast.show("Superviser can not blank...");
                    return false;
                }
                else if (QA1.length > 0) {
                    MessageToast.show("QA1 can not blank...");
                    return false;
                }
               // else if (QA2.length > 0) {
                   // MessageToast.show("QA2 can not blank...");
                   // return false;
                //}
                else if (ToProcess.length > 0) {
                    MessageToast.show("To Process can not blank...");
                    return false;
                }
                else if (Prodteam.length > 0) {
                    MessageToast.show("Production Accountant can not blank...");
                    return false;
                }
                else {

                    const oModelData = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    let FormModel = this.getView().getModel("EntryFormDataSourceModel").getData().value;
                    let insertList = FormModel.filter(r => r.ExtraField == "New");
                    let updateList = FormModel.filter(r => r.ExtraField !== "New");
                    if (insertList.length > 0) {
                        let trgObjectForSave = this.getView().getModel("SaveRequest").getData();
                        insertList.forEach(item => {

                            delete item.ExtraField;
                            //const sPath = "/YourEntitySetName('" + item.ID + "')";
                            this.setEntryFormDataSourceURLToAddData("/odata/v4/user-mapping-services/UserMapping");
                            this.transferObjectValues(item, trgObjectForSave);
                            this.onPressOfEntryFormInsertButton(trgObjectForSave);

                            let response = this.getApiResponseObject();;
                            if (response.success) {

                                this.router.navTo(-1);
                                MessageToast.show("Record Update successfully");
                            }

                        });
                        //    await this.onPressOfEntryFormInsertButton(trgObject);

                    }
                    if (updateList.length > 0) {
                        let trgObjectForUpdate = this.getView().getModel("SaveRequest").getData();
                        updateList.forEach(item => {

                            delete item.ExtraField;
                            //const sPath = "/YourEntitySetName('" + item.ID + "')";
                            this.setEntryFormDataSourceURLToUpdateData("/odata/v4/user-mapping-services/UserMapping('" + item.ID + "')");
                            this.transferObjectValues(item, trgObjectForUpdate);
                            this.onPressOfEntryFormUpdateButton(trgObjectForUpdate);

                            let response = this.getApiResponseObject();;
                            if (response.success) {

                                this.router.navTo(-1);
                                MessageToast.show("Record Update successfully");
                            }

                        });



                    }
                }
            }
            catch (error) {
                MessageBox.show(error.message);
            }
        }
        ,
        validate: function () {
            debugger;
            let FormModel = this.getView().getModel("EntryFormDataSourceModel").getData().value;
            let PList = FormModel.filter(r => r.Plant == "");
            let Storage = FormModel.filter(r => r.Storage == "");
            let Contractor = FormModel.filter(r => r.Contractor == "");
            let Superviser = FormModel.filter(r => r.Superviser == "");
            let QA1 = FormModel.filter(r => r.QA1 == "");
            let QA2 = FormModel.filter(r => r.QA2 == "");
            let ToProcess = FormModel.filter(r => r.ToProcess == "");
            let Prodteam = FormModel.filter(r => r.Prodteam == "");
            if (PList.length > 0) {
                MessageToast.show("Plant can not blank...");
                return false;
            }
            else if (Storage.length > 0) {
                MessageToast.show("Storage can not blank...");
                return false;
            }
            else if (Contractor.length > 0) {
                MessageToast.show("Contractor can not blank...");
                return false;
            }
            else if (Superviser.length > 0) {
                MessageToast.show("Superviser can not blank...");
                return false;
            }
            else if (QA1.length > 0) {
                MessageToast.show("QA1 can not blank...");
                return false;
            }
            else if (QA2.length > 0) {
                MessageToast.show("QA2 can not blank...");
                return false;
            }
            else if (ToProcess.length > 0) {
                MessageToast.show("To Process can not blank...");
                return false;
            }
            else if (Prodteam.length > 0) {
                MessageToast.show("Production Accountant can not blank...");
                return false;
            }
            else {
                true;
            }
        },
        onDeletePress: function (oEvent) {
            debugger;
            var oButton = oEvent.getSource();
            var oBindingContext = oButton.getBindingContext("EntryFormDataSourceModel");
            let Plant = oBindingContext.getProperty("Plant");
            let Storage = oBindingContext.getProperty("Storage");
            let Contractor = oBindingContext.getProperty("Contractor");
            let QA1 = oBindingContext.getProperty("QA1");
            if (Plant == "") {
                if (Storage == "") {
                    if (Contractor == "") {
                        if (QA1 == "") {
                            this.onDeleteRow(oEvent);
                        }
                    }
                }
            }
        },

        onDeleteRow: function (oEvent) {
            debugger;
            var oModel = this.getView().getModel();

            // Retrieve the data from the model (assuming the data is an array)
            var aProducts = oModel.getProperty("/EntryFormDataSourceModel");

            // Check if there is any data in the model
            if (aProducts && aProducts.length > 0) {
                // Remove the last item from the array
                aProducts.pop();  // Alternatively, you could use aProducts.splice(aProducts.length - 1, 1);

                // Update the model with the new data (after removing the last element)
                oModel.setProperty("/EntryFormDataSourceModel", aProducts);

                // Optionally, refresh the model binding to update the UI
                oModel.refresh(true);
            }
        }
        ,

        cflForStorageAfterPlant: async function (selectedPlant) {
            try {

                debugger;
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName())
                let _data = this.getView().getModel(this.getEntryFormDataSourceModelName()).getData();
                let _plant = selectedPlant;// _data.value[0].Plant; 
                //  let _plant = viewModel.getProperty("value/Plant"); 
                await this.createNewModelUsingAPI(
                    'GET',
                    //`/sap/opu/odata4/sap/zune_sb_porreport_api/srvd_a2x/sap/zune_sd_zune_dd_po_prodord/0001/ZUne_DD_PO_ProdOrd?$filter=Quantity gt 0 and UOM eq 'PC' &format=json`,
                    `/sap/opu/odata4/sap/zune_sb_storagelocation_api/srvd_a2x/sap/zune_sd_storagelocation_api/0001/ZUNE_CDS_StorageLoactionAPI?$filter=Plant eq '${_plant}'`,
                    '',
                    this.getCflListViewDataSourceModelName()
                );
                this.setCflDisplayColumns(["StorageLocation", "StorageLocationName"]);
                this.setCflDataColumns(["StorageLocation", "StorageLocationName"]);
                this.setCflValueAndDisplay("StorageLocation", "StorageLocationName", "", "");

                MessageToast.show("Data loading please wait...");

                this.showCfl(
                    "CflJob",
                    this.getCflListViewDataSourceModelName(),
                    "value",
                    this.onConfirmStorage.bind(this)
                );
            }
            catch (error) {
                MessageBox.show("cflForUserList -: " + error.message);
            }
        },
        cflForStorage: async function (oEvent) {
            try {

                debugger;
                var oInput = oEvent.getSource();
                var oContext = oInput.getBindingContext("EntryFormDataSourceModel");  // Get the context of the current row
                // Get the Plant from the current row context
                this._cflContext = oContext;
                var selectedPlant = oContext.getProperty("Plant");
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName())
                let _data = this.getView().getModel(this.getEntryFormDataSourceModelName()).getData();
                let _plant = selectedPlant;// 
                await this.createNewModelUsingAPI(
                    'GET',
                    //`/sap/opu/odata4/sap/zune_sb_porreport_api/srvd_a2x/sap/zune_sd_zune_dd_po_prodord/0001/ZUne_DD_PO_ProdOrd?$filter=Quantity gt 0 and UOM eq 'PC' &format=json`,
                    `/sap/opu/odata4/sap/zune_sb_storagelocation_api/srvd_a2x/sap/zune_sd_storagelocation_api/0001/ZUNE_CDS_StorageLoactionAPI?$filter=Plant eq '${_plant}'`,
                    '',
                    this.getCflListViewDataSourceModelName()
                );
                this.setCflDisplayColumns(["StorageLocation", "StorageLocationName"]);
                this.setCflDataColumns(["StorageLocation", "StorageLocationName"]);
                this.setCflValueAndDisplay("StorageLocation", "StorageLocationName", "", "");

                MessageToast.show("Data loading please wait...");

                this.showCfl(
                    "CflJobs",
                    this.getCflListViewDataSourceModelName(),
                    "value",
                    this.onConfirmStorage.bind(this)
                );
            }
            catch (error) {
                MessageBox.show("cflForUserList -: " + error.message);
            }
        },

        onConfirmStorage: async function () {
            debugger;
            let x = this.getCflObject();
            this._cflContext.setProperty("Storage", x.StorageLocation);
           

        },


         cflForPlant: async function (oEvent) {
            try {

                debugger;
                var oInput = oEvent.getSource();
                var oContext = oInput.getBindingContext("EntryFormDataSourceModel");  // Get the context of the current row
                // Get the Plant from the current row context
                this._cflContext = oContext;
               
               
                await this.createNewModelUsingAPI(
                    'GET',
                    //`/sap/opu/odata4/sap/zune_sb_porreport_api/srvd_a2x/sap/zune_sd_zune_dd_po_prodord/0001/ZUne_DD_PO_ProdOrd?$filter=Quantity gt 0 and UOM eq 'PC' &format=json`,
                    `/sap/opu/odata4/sap/zune_sb_plant_api/srvd_a2x/sap/zune_sd_plant_api/0001/ZUNE_CDS_Plant`,
                    '',
                    this.getCflListViewDataSourceModelName()
                );
                this.setCflDisplayColumns(["Plant", "PlantName"]);
                this.setCflDataColumns(["Plant", "PlantName"]);
                this.setCflValueAndDisplay("Plant", "PlantName", "", "");

                MessageToast.show("Data loading please wait...");

                this.showCfl(
                    "CflPlant",
                    this.getCflListViewDataSourceModelName(),
                    "value",
                    this.onConfirmPlant.bind(this)
                );
            }
            catch (error) {
                MessageBox.show("cflForUserList -: " + error.message);
            }
        },

        onConfirmPlant: async function () {
            debugger;
            let x = this.getCflObject();
            this._cflContext.setProperty("Plant", x.Plant);
           

        },

          cflForSuperwiser: async function (oEvent) {
            try {
              
               debugger;
             var oInput = oEvent.getSource();
                var oContext = oInput.getBindingContext("EntryFormDataSourceModel");  // Get the context of the current row
                // Get the Plant from the current row context
                this._cflContext = oContext;
                await this.createNewModelUsingAPI(
                    'GET',
                    `/odata/v4/user-master-services/UserMasterT?$filter=ManagGMC  eq true &$format=json`,
                    //`/sap/opu/odata4/sap/zune_sb_employee_master/srvd_a2x/sap/zune_sd_employee_master/0001/Zune_CDS_EMPLOYEE_MASTER?$top=3000&$format=json`,
                    '',
                    this.getCflListViewDataSourceModelName()
                );
                this.setCflDisplayColumns(["username","Description"]);
                this.setCflDataColumns(["username","Description"]);
                this.setCflValueAndDisplay("username", "Description", "", "");

                MessageToast.show("Data loading please wait...");

                this.showCfl(
                    "CflSup",
                    this.getCflListViewDataSourceModelName(),
                    "value",
                    this.onConfirmInspectionLot.bind(this)
                );
            }
            catch (error) {
                MessageBox.show("cflForUserList -: " + error.message);
            }
        },

         onConfirmInspectionLot:async function () {
            debugger;
            let x = this.getCflObject();
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
             this._cflContext.setProperty(`Superviser`, x.username); 
            viewModel.refresh(true);

        },


         cflForContractor: async function (oEvent) {
            try {
              
               debugger;
             var oInput = oEvent.getSource();
                var oContext = oInput.getBindingContext("EntryFormDataSourceModel");  // Get the context of the current row
                // Get the Plant from the current row context
                this._cflContext = oContext;
                await this.createNewModelUsingAPI(
                    'GET',
                    //`/sap/opu/odata/sap/API_BUSINESS_PARTNER/A_Supplier?$filter=SupplierAccountGroup eq 'ZJW'&$format=json`,
                     `/sap/opu/odata/sap/API_BUSINESS_PARTNER/A_Supplier?$format=json`,
                    '',
                    this.getCflListViewDataSourceModelName()
                );
                this.setCflDisplayColumns(["Supplier","SupplierName"]);
                this.setCflDataColumns(["Supplier","SupplierName"]);
                this.setCflValueAndDisplay("Supplier", "SupplierName", "", "");

                MessageToast.show("Data loading please wait...");

                this.showCfl(
                    "CflCont",
                    this.getCflListViewDataSourceModelName(),
                    "d/results",
                    this.onConfirmContractor.bind(this)
                );
            }
            catch (error) {
                MessageBox.show("cflForUserList -: " + error.message);
            }
        },

         onConfirmContractor:async function () {
            debugger;
            let x = this.getCflObject();
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
             this._cflContext.setProperty(`Contractor`, x.Supplier); 
            viewModel.refresh(true);

        },

        navBack: function () {
            history.go(-1);
        },

//////////
UploadExclData() {
    const oFileUploader = this.byId("fileUploader");
  //  const oFile = oFileUploader?.getFocusDomRef()?.files?.[0];
    const oFile = oFileUploader?.getDomRef()?.querySelector("input[type='file']")?.files?.[0];
debugger
    if (!oFile) {
        sap.m.MessageToast.show("Please select an Excel file first.");
        return;
    }

    // ── Load SheetJS ─────────────────────────────────────────────────────────
    const loadXLSX = () => new Promise((resolve, reject) => {
        if (window.XLSX) return resolve(window.XLSX);
        const script = document.createElement("script");
        script.src = "https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js";
        script.onload  = () => resolve(window.XLSX);
        script.onerror = () => reject(new Error("Failed to load SheetJS"));
        document.head.appendChild(script);
    });

    loadXLSX().then(XLSX => {
        debugger
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                // ── Parse Excel ───────────────────────────────────────────────
                const data    = new Uint8Array(e.target.result);
                const wb      = XLSX.read(data, { type: "array" });
                const ws      = wb.Sheets[wb.SheetNames[0]];
                const rawRows = XLSX.utils.sheet_to_json(ws, { raw: false, defval: "" });

                if (!rawRows.length) {
                    sap.m.MessageBox.warning("Excel file has no data rows.");
                    return;
                }

                // ── Build payload ─────────────────────────────────────────────
                const aPayload = rawRows.map(row => ({
                    Plant                : (row["Plant"]                || "").trim(),
                    Storage              : (row["Storage"]              || "").trim(),
                    Contractor           : (row["Contractor"]           || "").trim(),
                    Superviser           : (row["Superviser"]           || "").trim(),
                    QA1                  : (row["QA1"]                  || "").trim(),
                    Prodteam             : (row["Prodteam"]             || "").trim(),
                    QA2                  : (row["QA2"]                  || "").trim(),
                    ToProcess            : (row["ToProcess"]            || "").trim(),
                    Shift                : (row["Shift"]                || "").trim(),
                    ISActive             : (row["ISActive"] || "true").toString().toLowerCase() !== "false"
                }));

                // ── Validate ──────────────────────────────────────────────────
                const errors = [];
                aPayload.forEach((row, i) => {
                    const rowNum = i + 2;
                    if (!row.Plant)     errors.push(`Row ${rowNum}: Plant is required`);
                    if (!row.Storage)   errors.push(`Row ${rowNum}: Storage is required`);
                    if (!row.ToProcess) errors.push(`Row ${rowNum}: ToProcess is required`);
                });

                if (errors.length) {
                    sap.m.MessageBox.error(errors.join("\n"), { title: "Validation Errors" });
                    return;
                }

                // ── POST each row to OData v4 ─────────────────────────────────
                sap.ui.core.BusyIndicator.show(0);

                const SERVICE_URL = "/odata/v4/user-mapping-services/UserMapping";

                let iSuccess = 0;
                let iFailed  = 0;
                const aErrors = [];

                for (const oEntry of aPayload) {
                    try {
                        //this.onPressOfEntryFormInsertButton(trgObjectForSave);
                        const oResponse = await fetch(SERVICE_URL, {
                            method  : "POST",
                            headers : {
                                "Content-Type" : "application/json",
                                "Accept"       : "application/json"
                            },
                            body    : JSON.stringify(oEntry)
                        });

                        if (!oResponse.ok) {
                            const oErr = await oResponse.json().catch(() => ({}));
                            const sMsg = oErr?.error?.message || `HTTP ${oResponse.status}`;
                            aErrors.push(`Row (${oEntry.Plant}/${oEntry.Storage}): ${sMsg}`);
                            iFailed++;
                        } else {
                            iSuccess++;
                        }

                    } catch (err) {
                        aErrors.push(`Row (${oEntry.Plant}/${oEntry.Storage}): ${err.message}`);
                        iFailed++;
                    }
                }

                sap.ui.core.BusyIndicator.hide();

                // ── Result message ────────────────────────────────────────────
                if (iFailed === 0) {
                    sap.m.MessageBox.success(
                        `All ${iSuccess} record(s) uploaded successfully.`,
                        {
                            title   : "Upload Successful",
                            onClose : () => {
                                // Refresh your table binding after upload
                                this.getView()
                                    .getModel("EntryFormDataSourceModel")
                                    .refresh();
                                    history.go(-1);
                            }
                        }
                    );
                    
                } else {
                   sap.m.MessageBox.warning(
                    `✔ ${iSuccess} succeeded\n✘ ${iFailed} failed\n\nDetails:\n${aErrors.join("\n")}`,
                    { 
                        title   : "Upload Completed with Errors",
                        onClose : () => {
                            history.go(-1);  // 👈 or here if you want to nav back even on errors
                        }
                    }
                );
                    //  
                }

            } catch (err) {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageBox.error("Failed to parse Excel: " + err.message);
            }
        };

        reader.readAsArrayBuffer(oFile);
        //  history.go(-1);

    }).catch(err => {
        sap.m.MessageBox.error(err.message);
    });
}

/////////

    });
});