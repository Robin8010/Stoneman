sap.ui.define([
    "core/generic/genericentryform",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],

    function (genericentryform, MessageToast, MessageBox, Controller) {
        "use strict";
        var _RoleInfo = null, _LoginInfo;
        return genericentryform.extend("modconfcontroller.usermasterentryform", {
            // Define pagination-related variables at the controller level
            _iTop: 1000, // Number of records per page (limit)
            _iSkip: 0,  // Offset (skip) value for pagination
            _bHasMoreData: true, // Flag to check if there are more records to load
            _nextPageUrl: '',    // URL for fetching the next set of data (when more data is available)
            onInit: function () {
                genericentryform.prototype.onInit.apply(this, arguments);

            },

            onBeforeShow: async function (oEvent) {
                debugger;
                this.identifyFormMode(oEvent);
                //check FormMode
                 let loginInfo = this.getLoginInfo();
            let ID=  loginInfo.RowId;
            const formMode = loginInfo.FormMode;

            let userid = loginInfo.Usercode;
            let userName = loginInfo.Username;

               // const formMode = this.getFormMode();
                const _RoutData = this.getRouteData();



              //  let Desc= _LoginInfo.username;
               // let _AppModel=this.getView().getModel('sysModel');
              //  _AppModel.setProperty("/userDetails/UserDsc",userName);
               // _AppModel.refresh(true);

                if (formMode != undefined) {
                   // let ID =ID;// _RoutData.uniqueId
                    this.setEntryFormDataSourceURLToUpdateData("/odata/v4/user-master-services/UserMasterT('" + ID + "')");
                    this.setEntryFormDataSourceURLToAddData("/odata/v4/user-master-services/UserMasterT");
                    let oPathSaveReq = jQuery.sap.getModulePath(
                        "stonemanweb",
                        "/modconf/model/UserMasterEntryFormSaveRequest.json", //Save Request Model
                    );

                    let oModelSaveRequest = new sap.ui.model.json.JSONModel(oPathSaveReq);
                    this.getView().setModel(oModelSaveRequest, "userMasterSaveRequest");

                    debugger;
                    this.setEntryFormDataSourceURLForEditMode("/odata/v4/user-master-services/UserMasterT('" + ID + "')");
                    let oPath = jQuery.sap.getModulePath(
                        "stonemanweb",
                        "/modconf/model/UserMasterEntryForm.json", // Edit Response Model
                    );
                    let oModel = new sap.ui.model.json.JSONModel(oPath);
                    this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
                    await this.showEntryForm();

                }
                this.handleUIOperation();
            },
            	

            navBack: function () {
                history.go(-1);
                //var router = sap.ui.core.UIComponent.getRouterFor(this);
                // router.navTo("RouteIndex");
            },
            onCancel: function () {
                var router = sap.ui.core.UIComponent.getRouterFor(this);
                // MessageToast.show("Redirecting to User Master.....")
                router.navTo("RouteNameUserMasterConfiguration");
            },
            handleUIOperation: async function () {
                //    this._loadData(); 
               // await this.fillUsercombo();
                // this.FillApproverList1();
                //this.FillApproverList2();
                //const formMode = this.getFormMode();
                //if (formMode === "2") {
                //     this.handleFormInEditMode();
                //  }
            },
            handleFormInEditMode: function () {
                // let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                //  oModel.setProperty("/disableUsername", false);
            },

fillUsercombo:async function () {
            try {
                debugger;
                await this.createNewModelUsingAPI(
                    'GET',
                    `/sap/opu/odata4/sap/zune_sb_employee_master/srvd_a2x/sap/zune_sd_employee_master/0001/Zune_CDS_EMPLOYEE_MASTER?$top=3000&$format=json`,
                    '',
                    "UserListModel"
                );
                const userListData = this.getView().getModel("UserListModel").getData();
                const userList = userListData && userListData.value ? userListData.value : [];
                let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                  oModel.setProperty("/usernameList", userList);

                //this.setUserComboBox("UserList", "UserListModel", "WorkforcePersonExternalID", "FullName");
            }
            catch (error) {
                MessageBox.show("fillUsercombo -: " + error.message);
            }
        },
           

             cflForUser: async function () {
            try {
              
               debugger;
           
                await this.createNewModelUsingAPI(
                    'GET',
                    //`/sap/opu/odata4/sap/zune_sb_porreport_api/srvd_a2x/sap/zune_sd_zune_dd_po_prodord/0001/ZUne_DD_PO_ProdOrd?$filter=Quantity gt 0 and UOM eq 'PC' &format=json`,
                    `/sap/opu/odata4/sap/zune_sb_employee_master/srvd_a2x/sap/zune_sd_employee_master/0001/Zune_CDS_EMPLOYEE_MASTER?$top=3000&$format=json`,
                    '',
                    this.getCflListViewDataSourceModelName()
                );
                this.setCflDisplayColumns(["WorkforcePersonExternalID","FullName"]);
                this.setCflDataColumns(["WorkforcePersonExternalID","FullName"]);
                this.setCflValueAndDisplay("WorkforcePersonExternalID", "FullName", "", "");

                MessageToast.show("Data loading please wait...");

                this.showCfl(
                    "CflJob",
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
            viewModel.setProperty(`/username`, x.WorkforcePersonExternalID);
            viewModel.setProperty(`/Description`, x.FullName);
           

            viewModel.refresh(true);

        
          
          
        },

            onAccept: async function () {
                try {
                    debugger;
                     const oModelData = this.getView().getModel(this.getEntryFormDataSourceModelName());
                        var username = oModelData.getProperty("/username");
                        var password = oModelData.getProperty("/password");
                        if(username!="" && password!="")
                        {
                    let PassWord="";
                    let UserName="";
                    let isRecordAdded = false;
                  let loginInfo = this.getLoginInfo();
                    const formMode = loginInfo.FormMode;
                    if (formMode === "3") {
                       
                        await this.createNewModelUsingAPI(
                            'GET',
                            `/odata/v4/user-master-services/UserMasterT?$filter=username eq '${username}'`,
                            '',
                            'UserMasterData'
                        );
                        const userMasterData = this.getView().getModel('UserMasterData').getData();
                        if (userMasterData && userMasterData.value && userMasterData.value.length > 0) {
                            MessageToast.show("Record already added for this username");
                            isRecordAdded = true;
                        }
                    }
                    if (!isRecordAdded) {
                        let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                        let oData = oModel.getData();
                        debugger;
                        const modelData = this.getView().getModel(this.getEntryFormDataSourceModelName()).getData();
                        let trgObject = this.getView().getModel("userMasterSaveRequest").getData();
                        console.log("Target Object:", trgObject);
                        debugger;
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
                else
                {
                    MessageToast.show("UserName and password can not blank..."); 
                }
                }
                catch (error) {
                    MessageBox.show(error.message);
                }
            },
            onDeleteuser: function (oEvent) {
                // Step 1: Get the source of the event (e.g., the button)
                var oButton = oEvent.getSource();

                // Step 2: Get the binding context of the row containing the button
                var oBindingContext = oButton.getBindingContext(this.getEntryFormDataSourceModelName());

                if (!oBindingContext) {
                    console.error("Binding context not found");
                    return;
                }

                // Step 3: Extract the full data path and calculate the index
                var sPath = oBindingContext.getPath(); // e.g., "/Role/1"
                console.log("Binding Path:", sPath);

                var iIndex = parseInt(sPath.split("/").pop(), 10); // Extract the last part of the path
                console.log("Calculated Index:", iIndex);

                // Step 4: Access the data model and retrieve data
                var oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                var aData = oModel.getProperty("/Role");

                // Step 5: Confirm deletion
                MessageBox.show("Are you sure you want to delete record?", {
                    title: "Confirm",
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this.updateuserRoleModel(iIndex);
                        }
                    }.bind(this)
                });
            },
            updateuserRoleModel: function (iIndex) {
                // Access the model
                const modelName = this.getEntryFormDataSourceModelName();

                //const iIndex = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
                this.deleteRow(modelName, 'Role', iIndex);
                // var oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                // var aData = oModel.getProperty("/Role");

                // // Remove the item from the model
                // if (iIndex >= 0 && iIndex < aData.length) {
                //     aData.splice(iIndex, 1);
                // }

                // // Recalculate RowNumber
                // aData = aData.map((item, i) => ({
                //     ...item,
                //     RowNumber: i + 1
                // }));

                // // Update the model
                // oModel.setProperty("/Role", aData);

                // // // Refresh the binding to update the UI
                // var oTable = this.getView().byId("smuserRoleTable");
                // if (oTable) {
                //     var oBinding = oTable.getBinding("items");
                //     if (oBinding) {
                //         oBinding.refresh();
                //     } else {
                //         console.warn("No binding found for the table items.");
                //     }
                // }

                console.log("Updated Role Data:", aData);
            },
            _GetFormMode: function () {
                debugger;
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var oRoute = oRouter.getRoute("RouteNameUserMasterConfiguration");

                if (oRoute) {
                    var_FormMode = oRoute.attachPatternMatched(this._onRouteMatched, this);
                    return _FormMode
                }
            },
            onCheckBoxSelect: function (oEvent) {
                debugger;
                let oSelected = oEvent.getSource();  // the checkbox that was clicked
                let oVBox = this.byId("checkboxContainer");
                let aItems = oVBox.getItems();

                aItems.forEach(oItem => {
                    // Uncheck all other checkboxes
                    if (oItem.sId !== oSelected.sId && oItem instanceof sap.m.CheckBox) {
                        oItem.setSelected(false);
                    }
                });
            },
            _onRouteMatched: function (oEvent) {
                debugger;
                let _FormMode = ";"
                var oArgs = oEvent.getParameter("arguments");
                var sParam = oArgs.ID;
                if (sParam == "0") {
                    _FormMode = "Add";
                    ID = "";
                }
                else {
                    _FormMode = "Edit";
                    ID = sParam;
                }
                //  this.setFormMode(_FormMode);

                // Get the parameter passed from Page1
                //  update the model
                const loginModel = this.getOwnerComponent().getModel("UserModel");
                loginModel.setProperty("/FormMode", _FormMode);
                loginModel.setProperty("/ID", sParam);
                return _Mode;
                // MessageToast.show(sParam);

            },

            onSelectProcess: function (oEvent) {
                debugger;
                const selected = oEvent.getSource().getSelectedItem();
                const key = selected.getKey();     // BusinessPartner
                const text = selected.getText();
                let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());


                oModel.setProperty("/Description", text);
                oModel.refresh();
            }

        });
    });