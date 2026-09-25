sap.ui.define([
    "core/generic/genericentryformproperties",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller"
],
    function (genericentryformproperties, JSONModel) {
        "use strict";

        return genericentryformproperties.extend("coregeneric.genericentryformfunctions", {

            onInit: function () {

                genericentryformproperties.prototype.onInit.apply(this, arguments);

                this.router = sap.ui.core.UIComponent.getRouterFor(this);


            },


            identifyFormMode: function (oEvent) {
                //var oArguments = oEvent.getParameter('arguments');
                //0 - Find
                //1 - Ok
                //2- Edit/Update
                //3 - Add / New
                //4 - View
                //5 - Print
                //7 - Archive
                let obj, routeData;

                routeData = this.getRouteData();
                let sText = "";
                if (routeData !== "undefined") {

                    this.setFormMode(routeData.formMode);

                    //obj = JSON.parse(oEvent.data.data);

                    if (routeData.formMode == 1) {
                        // OK Mode
                        sText = "Okay";
                    }
                    else if (routeData.formMode == 2) {
                        // Edit Mode
                        this.setListViewEditPropertyValue(routeData.uniqueId);
                        sText = "Update";
                    }
                    else if (routeData.formMode == 3) {
                        //Add Mode
                        sText = "Add";
                    }

                    //var oButton = this.byId("EntryFormSaveButton");
                    //oButton.setText(sText);
                } else {
                    alert('FormMode');
                }

            },

            showEntryFormForSpetialForm: async function (pageId) {

                if (this.getFormMode() == "2") {
                   await this.populateEntryFormForSpatilForm("GET", this.getEntryFormDataSourceURLForEditMode(), "");
                    await this.populateEntryFormForSpatilForm("GET", this.getEntryFormDataSourceURLForEditMode(), "");
                }
                else if (this.getFormMode() == "3") {
                    if (this.getEntryFormDataSourceURLForNewMode().length > 0) {
                    await    this.populateEntryFormForSpatilForm("GET", this.getEntryFormDataSourceURLForNewMode(), "");
                    }
                }

            },

           showEntryForm: async function (formMode) {

    try {

        if (formMode === "2") {

            await this.populateEntryForm(
                "GET",
                this.getEntryFormDataSourceURLForEditMode(),
                ""
            );

        } else if (formMode === "3") {

            var sUrl = this.getEntryFormDataSourceURLForNewMode();

            if (sUrl && sUrl.length > 0) {

                await this.populateEntryForm(
                    "GET",
                    sUrl,
                    ""
                );
            }
        }

        // यहाँ आने का मतलब है कि populateEntryForm पूरा हो चुका है
        console.log("Entry form model is ready");

    } catch (error) {

        console.error("showEntryForm Error:", error);
    }
},

           populateEntryForm: async function (oRequestType, aUrl, oRequestData) {

    try {

        // API response आने तक wait करेगा
        const data = await this.callApi(
            oRequestType,
            aUrl,
            oRequestData
        );

        console.log("Success:", data);

        var sModelName =
            this.getEntryFormDataSourceModelName();

        var oModel =
            this.getView().getModel(sModelName);

        // अगर model नहीं है तो नया model create करें
        if (!oModel) {

            oModel = new JSONModel();

            this.getView().setModel(
                oModel,
                sModelName
            );
        }

        // API response model में डालें
        oModel.setData(data);

        // Binding update
        oModel.updateBindings(true);

        console.log("Entry Form Model Updated");

        // बहुत important
        return data;

    } catch (error) {

        console.error("populateEntryForm Error:", error);

        // Error को ऊपर showEntryForm तक भेजें
        throw error;
    }
},
            populateEntryFormForSpatilForm: async function (oRequestType, aUrl, oRequestData) {
                            // IF condition to be done to set getURLForFormModeNew or getURLForFormModeEdit
                        await this.callApi(oRequestType, aUrl, oRequestData)
                                .then((data) => {
                                    debugger;
                                    // writing like this .then ((data) => {}) gives the parent context, in this case the controller.
                                    console.log('Success:', data);
                                    debugger;
                                    var oModel = new JSONModel();
                                    oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());

                                    //Add New Row
                                
                               // if (!Array.isArray(data.value)) {
                                 //       data.value = [];  // If not, initialize as an empty array
                                   // }
                                    // New row to insert
                                    const newMapping = {
                                        "Plant": "",
                                        "Storage": "",
                                        "Contractor": "",
                                        "Superviser": "",
                                        "QA1": "",
                                        "Prodteam": "",
                                        "QA2": "",
                                        "IPTM": "",
                                        "ExtraField": "New",
                                        "ISActive": true
                                    };
                                    // Insert the new row into the model's data (push to array)
                                   // data.value.push(newMapping); now not in use

                                      oModel.setData(data); // 'data' is the response from your API call
                                    this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
                                    
                                })
                                .catch(function (error) {
                                    console.error('Error:', error);
                                });

                        },
            saveEntryForm: async function (oRequestType, aUrl, oRequestData) {
                // IF condition to be done to set getURLForFormModeNew or getURLForFormModeEdit
                await this.callApi(oRequestType, aUrl, oRequestData)
                    .then((data) => {
                        // writing like this .then ((data) => {}) gives the parent context, in this case the controller.
                        console.log('Success:', data);
                        var oModel = new JSONModel();
                        oModel.setData(data); // 'data' is the response from your API call
                        this.getView().setModel(oModel, this.getEntryFormResponseDataSourceModelName());

                    })
                    .catch(function (error) {
                        console.error('Error:', error);
                    });

            },

            clearGenericEntryForm: function () {
                // to clear all properties of generic entry form
                this.clearGenericListViewForm();
                this.createNewModel(this.getEntryFormDataSourceModelName());
            },




        });
    });
