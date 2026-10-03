sap.ui.define(
  ['core/base/baseproperties', 'sap/ui/core/BusyIndicator', 'sap/ui/core/mvc/Controller', 'sap/m/MessageBox'],
  function (baseproperties, BusyIndicator, Controller, MessageBox) {
    'use strict';
    var oBusyIndicator;
    return baseproperties.extend('corebase.basefunctions', {
      onInit: function () {
        baseproperties.prototype.onInit.apply(this, arguments);
        //alert("Base functions ");
        this.router = sap.ui.core.UIComponent.getRouterFor(this);
        oBusyIndicator = BusyIndicator;
      },

      getFormTitle: function () {
        return this.pFormTitle;
      },

      setFormTitle: function (value) {
        this.pFormTitle = value;
      },

      getFormSubTitle: function () {
        return this.pFormSubTitle;
      },

      setFormSubTitle: function (value) {
        this.pFormSubTitle = value;
      },

      getFormMode: function () {
        return this.pFormMode;
      },

      setFormMode: function (value) {
        this.pFormMode = value;
      },
         getResponseHeaderDataList: function () {
        return this.pResponseHeaderData;
      },

      setResponseHeaderDataList: function (aHeaderKey, aHeaderValue) {
        this.pResponseHeaderObj = {
          pHeaderKey: aHeaderKey,
          pHeaderValue: aHeaderValue
        };

        this.pResponseHeaderData.push(this.pResponseHeaderObj);
      },

callApiUsingFetch: async function (type, url, reqData, headerData, dataType) {
        try {
          BusyIndicator.show(0);
          const apiHandler = this;
          return new Promise(async function (resolve, reject) {
            var requestOptions = "";
            if (type === "POST" || type === "PATCH") {
              requestOptions = {
                method: type,
                headers: headerData,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                body: JSON.stringify(reqData),
                redirect: 'follow',
                credentials: 'include'
              };
            }
            else {
              requestOptions = {
                method: type,
                headers: headerData,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                //redirect: 'follow'
                credentials: 'include'
              };
            }
            fetch(url, requestOptions)
              .then(response => {
                if (response.ok) {
                  for (const [key, value] of response.headers) {
                    apiHandler.setResponseHeaderDataList(key, value);
                  }
                  if (dataType == "xml") {
                    const data = response.text();
                    apiHandler.setApiResponseObject(true, data);
                    oBusyIndicator.hide();
                    resolve(data);
                  }
                  else {
                    const data = response.json();
                    apiHandler.setApiResponseObject(true, data);
                    oBusyIndicator.hide();
                    resolve(data);
                  }
                } else {
                  BusyIndicator.hide();
                  if (dataType == "xml") {
                    const data = response.text();
                    console.log(data);
                    apiHandler.setApiResponseObject(false, data);
                    reject(data);
                  }
                  else {
                    const data = response.json();
                    console.log(data);
                    apiHandler.setApiResponseObject(false, data);
                    reject(data);
                  }
                  //throw new Error("API error :-" + response.status);
                }
              }).then((result) => {
                console.log("Result - " + result);
              })
              .then(error => {
                oBusyIndicator.hide();
                if (error != undefined) {
                  console.log(error);
                  apiHandler.setApiResponseObject(false, error);
                  reject(error);
                }
              })
              .catch(error => console.error('There was a problem with the fetch operation:', error));
          });
        }
        catch (error) {
          oBusyIndicator.hide();
          throw error;
        } 
      },
      callApi: function (type, url, reqData) {
    // debugger
        BusyIndicator.show(0);
        let oRequestData = '';

        if (typeof reqData === 'undefined') {
          oRequestData = '';
        }

        if (typeof reqData !== 'undefined') {
          if (reqData !== '') {
            oRequestData = JSON.stringify(reqData);
          }
        }

        const apiHandler = this;
        return new Promise(function (resolve, reject) {
          $.ajax({
            url: url,
            method: type,
            data: oRequestData,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            crossDomain: true,
            async: true,
            /*headers: {
                            "Content-Type": "application/json",
                            "Cookie": "B1SESSION=fc34c65a-4da1-11ef-8000-00155d025317"
                        },*/
            xhrFields: {
              withCredentials: true
            },
            cors: [
              {
                enabled: false
              }
            ],
debugger
            success: function (data) {
              // Check if setApiResponseObject is available in the current scope
              console.log(data);
              apiHandler.setApiResponseObject(true, data);
              BusyIndicator.hide();
              resolve(data);
            }.bind(this),

            error: function (error) {
              // Handle error
              console.error(error);
              BusyIndicator.hide();
              debugger
              apiHandler.setApiResponseObject(false, error);
              reject(error);
            }.bind(this)
          });
        });
      },

      getListViewEditProperty: function () {
        return this.pEditProperty;
      },

      setListViewEditProperty: function (value) {
        this.pEditProperty = value;
      },

      getListViewEditPropertyValue: function () {
        return this.pEditPropertyValue;
      },

      setListViewEditPropertyValue: function (value) {
        this.pEditPropertyValue = value;
      },

      getListViewEditPropertyObject: function () {
        return this.pEditPropertyObject;
      },

      setListViewEditPropertyObject: function (value) {
        this.pEditPropertyObject = value;
        this.setListViewEditPropertyValue(this.pEditPropertyObject[this.getListViewEditProperty()]);
      },

      getCflTitle: function () {
        return this.pCflTitle;
      },

      setCflTitle: function (value) {
        this.pCflTitle = value;
      },

      getCflValueId: function () {
        return this.pCflValueId;
      },

      getCflValueIdFor: function () {
        return this.pCflValueIdFor;
      },

      setCflValueId: function (valuex, valuey) {
        this.pCflValueIdFor = valuex;
        this.pCflValueId = valuey;
      },

      getCflValueDisplay: function () {
        return this.pCflValueDisplay;
      },

      getCflValueDisplayFor: function () {
        return this.pCflValueDisplayFor;
      },

      getCflValueFor: function () {
        return this.pCflValueFor;
      },

      getCflValueFrom: function () {
        return this.pCflValueFrom;
      },

      getCflDisplayFor: function () {
        return this.pCflDisplayFor;
      },

      getCflDisplayFrom: function () {
        return this.pCflDisplayFrom;
      },
      getCflDisplayHidden: function () {
        return this.pCflDisplayHidden;
      },

      setCflValueAndDisplay: function (valueFor, valueFrom, displayFor, displayFrom, displayHidden) {
        this.pCflValueFor = valueFor;
        this.pCflValueFrom = valueFrom;
        this.pCflDisplayFor = displayFor;
        this.pCflDisplayFrom = displayFrom;
        this.pCflDisplayHidden = displayHidden;
      },

      getListViewDataSourceModelName: function () {
        return this.pListViewDataSourceModelName;
      },

      /*
            setListViewDataSourceModelName: function (value) {
                this.pListViewDataSourceModelName = value;
            },
            */

      getEntryFormDataSourceModelName: function () {
        return this.pEntryFormDataSourceModelName;
      },

      /*
            setEntryFormDataSourceModelName: function (value) {
                this.pEntryFormDataSourceModelName = value;
            },
            */

      getCflListViewDataSourceModelName: function () {
        return this.pCflListViewDataSourceModelName;
      },

      setCflListViewDataSourceModelName: function (value) {
        this.createNewModel(value);
      },

      getCflSearchProperty: function () {
        return this.pCflSearchProperty;
      },

      setCflSearchProperty: function (value) {
        this.pCflSearchProperty = value;
      },

      getCflValue: function () {
        return this.pCflValue;
      },

      setCflValue: function (value) {
        this.pCflValue = value;
      },

      getCflObject: function () {
        return this.pCflObject;
      },

      setCflObject: function (value) {
        this.pCflObject = value;
      },

      getCflObjectList: function () {
        return this.pCflObjectList;
      },

      setCflObjectList: function (value) {
        this.pCflObjectList = value;
      },

      getCflDisplayColumns: function () {
        return this.pCflDisplayColumnList;
      },

      setCflDisplayColumns: function (value) {
        this.pCflDisplayColumnList = value;
      },

      getCflDataColumnList: function () {
        return this.pCflColumnList;
      },

      setCflDataColumns: function (value) {
        this.pCflColumnList = value;
      },

      getCflObjectList: function () {
        return this.pCflObjectList;
      },

      setCflConfig: function (value) {
        this.pCflConfig = value;
      },

      setCflSingleSelect: function (value) {
        this.pCflConfig = value;
      },

      setCflMultiSelect: function (value) {
        this.pCflConfig = value;
      },

      getListViewFilterColumnList: function () {
        return this.pFilterColumnList;
      },

      setListViewFilterColumn: function (aControlId, aCaption, aType, aOperator, aDataType, aAttributeName, aMethodName) {
        this.pFilterObj = {
          pControlId: aControlId,
          pCaption: aCaption,
          pType: aType,
          pOperator: aOperator,
          pDataType: aDataType,
          pAttributeName: aAttributeName,
          pMethodName: aMethodName
        };

        this.pFilterColumnList.push(this.pFilterObj);
      },

      prepareData: function (aUrl, oResponse) {
        let iValue = this.identifySystem(aUrl);

        if (iValue == 1) {
          return oResponse;
        } else if (iValue == 2) {
          return oResponse.d;
        } else {
          return '';
        }
      },

      identifySystem: function (value) {
        let sValue = value.substring(0, 6);

        if (sValue == '/odata') {
          return 1;
        } else if (sValue == '/sap/o') {
          return 2;
        } else {
          return 3;
        }
      },

      onPressOfFormBackButton: function () {
        this.router.navTo(this.getBackwardRoute());
      },

      getPageId: function () {
        return this.pPageId;
      },

      setPageId: function (value) {
        this.pPageId = value;
      },

      clearBase: function () {
        this.pFilterColumnList = [];

        // to clear all properties of Base form
        // Function to destroy all controls in the page

        //this.destroyAllControls(this.getPageId());
      },

      destroyAllControls: function (sPage) {
        let oPage = this.getView().byId(sPage);
        var aContent = oPage.getContent();
        aContent.forEach(function (oControl) {
          oControl.destroy();
        });
      },

      validateAccess: function () {
        let oSecurityDetails = this.getSecurityDetails();

        if (oSecurityDetails === 'undefined') {
          this.router.navTo('RouteLogin');
        } else {
          if (oSecurityDetails.accessToken.length == 0) {
            this.router.navTo('RouteLogin');
          }
        }
      },

      getLoginUserDetails: function () {
        let sUserDetails = sessionStorage.getItem('userDetails');

        if (sUserDetails) {
          const decryptedData = this.decryptData(sUserDetails, this.getSecretKey());
          return JSON.parse(decryptedData);
        }

        return null;
      },

      setLoginUserDetails: function (sUserId, sUserName) {
        const oModel = this.getView().getModel('sysModel');

        const userDetails = {
          userId: sUserId,
          userName: sUserName
        };

        const encryptedUserDetails = this.encryptData(JSON.stringify(userDetails), this.getSecretKey());

        oModel.setProperty('/userDetails', userDetails);
        sessionStorage.setItem('userDetails', encryptedUserDetails);
        this.getView().setModel(oModel, 'sysModel');
      },

      ClearUserType: function () {
        debugger;
             const loginModel = this.getOwnerComponent().getModel("UserModel");
              //alert(JSON.stringify(oModel));
             loginModel.setData({});
            },


      deleteLoginUserDetails: function () {
        sessionStorage.removeItem('userDetails');
      },

      getSecurityDetails: function () {
        let sSecurityDetails = sessionStorage.getItem('security');

        if (sSecurityDetails) {
          const decryptedData = this.decryptData(sSecurityDetails, this.getSecretKey());
          return JSON.parse(decryptedData);
        }

        return null;
      },

      setSecurityDetails: function (sSessionId, sAccessToken) {
        const oModel = this.getView().getModel('sysModel');

        const securityDetails = {
          sessionId: sSessionId,
          accessToken: sAccessToken
        };

        const encryptedSecurityDetails = this.encryptData(JSON.stringify(securityDetails), this.getSecretKey());

        oModel.setProperty('/security', securityDetails);
        sessionStorage.setItem('security', encryptedSecurityDetails);

        this.getView().setModel(oModel, 'sysModel');
      },

      deleteSecurityDetails: function () {
        sessionStorage.removeItem('security');
      },

      getUserType: function () {
        let oModel;
        let oUsertype;
        oModel = this.getView().getModel('sysModel');

        oUsertype = oModel.getProperty('/userDetails');

        return oUsertype;
      },
       getRouteData: function () {
        let oModel;
        let oRouteData;
        oModel = this.getView().getModel('sysModel');

        oRouteData = oModel.getProperty('/route/routeData');

        return oRouteData;
      },

      setRouteData: function (sFormMode, sUniqueId) {
        let oModel;

        oModel = this.getView().getModel('sysModel');
        //alert(JSON.stringify(oModel));
        oModel.setProperty('/route/routeData/formMode', sFormMode);
        oModel.setProperty('/route/routeData/uniqueId', sUniqueId);

        this.getView().setModel(oModel, 'sysModel');
      },
      setUserType: function (susertype,_userName) {
        let oModel;

        oModel = this.getView().getModel('sysModel');
        //alert(JSON.stringify(oModel));
        oModel.setProperty('/userDetails/Usertype', susertype);
        oModel.setProperty('/loginInfo/UserID', _userName);
        this.getView().setModel(oModel, 'sysModel');
      },

      getCustomData: function () {
        let oModel;
        let oRouteData;
        oModel = this.getView().getModel('sysModel');

        oRouteData = oModel.getProperty('/customData');

        return oRouteData;
      },

      setCustomData: function (oCustomData) {
        let oModel;

        oModel = this.getView().getModel('sysModel');
        //alert(JSON.stringify(oModel));
        oModel.setProperty('/customData', oCustomData);

        this.getView().setModel(oModel, 'sysModel');
      },

      setPropertyValue: function (obj, propertyName, value) {
        if (obj.hasOwnProperty(propertyName)) {
          obj[propertyName] = value;
        } else {
          console.log('Property not found in the object.');
        }
      },

      isObjectEmpty: function (obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
      },

     getLoginInfo: function () {
    const sStoredDetails = sessionStorage.getItem("loginInfo");

    if (sStoredDetails) {
        return JSON.parse(sStoredDetails);
    }

    return null;
},

     setLoginInfo: function (
    sUserId,
    sUsercode,
    sUsername,
    IsProductionAccount,
    IsQCCheckUser,
    IsSuperwiser,
    L1Approver,
    L2Approver,
    IsAdmin,
    UserType,
     ParentID,
      RowId,
      FormMode
) {
    const oModel = this.getView().getModel("sysModel");

    const oLoginInfo = {
        UserID: sUserId,
        Usercode: sUsercode,
        Username: sUsername,
        IsProductionAccount: IsProductionAccount,
        IsQCCheckUser: IsQCCheckUser,
        IsSuperwiser: IsSuperwiser,
        L1Approver: L1Approver,
        L2Approver: L2Approver,
        IsAdmin:IsAdmin,
        UserType: UserType,
         ParentID:"",
         RowId:"",
         FormMode:""
    };

    // Store as JSON string
    sessionStorage.setItem("loginInfo", JSON.stringify(oLoginInfo));

    // Optional: keep it in the UI5 model as well
    oModel.setProperty("/loginInfo", oLoginInfo);
    this.getView().setModel(oModel, "sysModel");
},

      deleteLoginInfo: function () {
        sessionStorage.removeItem('loginInfo');
      },

      getRoleDetails: function () {
        let roleDetails = sessionStorage.getItem('roleDetails');

        if (roleDetails) {
          const decryptedData = this.decryptData(roleDetails, this.getSecretKey());
          return JSON.parse(decryptedData);
        }

        return null;
      },

      setRoleDetails: function (sRoleCode, sRoleName, sUserID) {
        const oModel = this.getView().getModel('sysModel');

        const roleDetails = {
          RoleCode: sRoleCode,
          RoleName: sRoleName,
          UserID: sUserID
        };

        const encryptedRoleDetails = this.encryptData(JSON.stringify(roleDetails), this.getSecretKey());

        oModel.setProperty('/roleDetails', roleDetails);
        sessionStorage.setItem('roleDetails', encryptedRoleDetails);

        this.getView().setModel(oModel, 'sysModel');
      },

      deleteRoleDetails: function () {
        sessionStorage.removeItem('roleDetails');
      },

      getEntryFormModel: function () {
        return this.getView().getModel(this.getEntryFormDataSourceModelName());
      },

      encryptData: function (data, secretKey) {
        const dataString = JSON.stringify(data);
        const encryptedData = CryptoJS.AES.encrypt(dataString, secretKey).toString();
        return encryptedData;
      },

      decryptData: function (encryptedData, secretKey) {
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedData);
      },

      getSecretKey: function () {
        const secretKey = 'd9b8c7d1e2f89b7a2e39d4d3e1a5c6b2d3e4f5a6b8d9e1f2c3a1b2e3f4c5d6e7';
        return secretKey;
      },

      setUserDetails: function (loginInfo) {
        const oSysModel = this.getView().getModel('sysModel');
        oSysModel.setProperty('/loginInfo', loginInfo);
        this.getView().setModel(oSysModel, 'sysModel');
      },

      transferObjectValues: function (sourceObj, targetObj) {
        for (let key in sourceObj) {
          if (sourceObj.hasOwnProperty(key)) {
            if (typeof sourceObj[key] === 'object' && !Array.isArray(sourceObj[key])) {
              // If the property is an object, recursively transfer its values
              //if (!targetObj[key]) {

              if (typeof targetObj !== 'undefined') {
                if (targetObj.hasOwnProperty(key)) {
                  targetObj[key] = sourceObj[key];
                }
                this.transferObjectValues(sourceObj[key], targetObj[key]);
              }
            } else if (Array.isArray(sourceObj[key])) {
              // If the property is an array, match each attribute of the objects inside the array
              let sourceObjlength = sourceObj[key].length;

              if (targetObj.hasOwnProperty(key)) {
                let targetObjlength = targetObj[key].length;

                if (sourceObjlength > targetObjlength) {
                  let srcObjectItem = targetObj[key][0];
                  let tarObjectItem = this.createEmptyReplica(srcObjectItem);
                  let ivalue = sourceObjlength - targetObjlength;

                  for (let i = 0; i < ivalue; i++) {
                    let temptarObjectItem = JSON.parse(JSON.stringify(tarObjectItem));
                    targetObj[key].push(temptarObjectItem);
                  }
                }

                targetObj[key] = sourceObj[key].map((sourceItem, index) => {
                  if (typeof sourceItem === 'object') {
                    let targetItem = targetObj[key][index] || {};
                    this.transferObjectValues(sourceItem, targetItem);
                    return targetItem;
                  }
                  return sourceItem;
                });
              }
            } else {
              // Directly assign the value for non-object properties
              if (typeof targetObj !== 'undefined') {
                if (targetObj.hasOwnProperty(key)) {
                  targetObj[key] = sourceObj[key];
                }
              }
            }
          }
        }
      },

      formatDate: function (sDate) {
        if (sDate) {
          let numDate = parseInt(sDate.replace(/[^0-9]/g, ''));
          let oDate = new Date(numDate);
          let oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
            pattern: 'dd-MM-yyyy' // Define the date format pattern here
          });
          return oDateFormat.format(oDate);
          //return oDate.toLocaleDateString(); // Format the date as needed
        }
        return null;
      },

      createEmptyReplica: function (sourceObj) {
        let targetObj = Array.isArray(sourceObj) ? [] : {};

        for (let key in sourceObj) {
          if (sourceObj.hasOwnProperty(key)) {
            if (typeof sourceObj[key] === 'object' && sourceObj[key] !== null) {
              targetObj[key] = this.createEmptyReplica(sourceObj[key]);
            } else {
              targetObj[key] = Array.isArray(sourceObj[key]) ? [] : '';
            }
          }
        }

        return targetObj;
      },

      getEntryFormResponseDataSourceModelName: function () {
        return this.pEntryFormResponseDataSourceModelName;
      },

      addRowInObj: function (sPath, oNewObj, sPropName) {
        let model = this.getEntryFormModel();

        let data = model.getData();

        let x = data[sPath].length;

        oNewObj[sPropName] = x + 1;
        if (sPath === 'Material') {
          oNewObj["MaterialAutoCode"] = data.MCatName;
        }

        data[sPath].push(oNewObj);

        model.setData(data);

        this.getView().setModel(this.getEntryFormDataSourceModelName(), model);
      },

      deleteRow: function (modelName, arrayName, index) {
        // Get the model using the model name
        var oModel = this.getView().getModel(modelName);
        if (!oModel) {
          console.error('Model not found: ' + modelName);
          return;
        }

        // Get the data from the model
        var aData = oModel.getProperty('/' + arrayName);
        if (!aData || !Array.isArray(aData)) {
          console.error('Array not found or is not an array: ' + arrayName);
          return;
        }

        // Check if the index is valid
        if (index < 0 || index >= aData.length) {
          console.error('Invalid index: ' + index);
          return;
        }

        // Remove the item at the specified index
        MessageBox.show('Are you sure you want to delete record?', {
          title: 'Confirm',
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          onClose: function (oAction) {
            if (oAction == 'YES') {
              aData.splice(index, 1);
              aData = aData.map((item, i) => ({ ...item, RowNumber: i + 1 }));
              oModel.setProperty('/' + arrayName, aData);
            }
          }
        });
      },

      clearUserModel: function () {
        const oModel = this.getEntryFormModel();
        oModel.setProperty('/username', '');
        oModel.setProperty('/password', '');
      },

      returnDateFormat: function () {
        return 'dd-MM-YYYY';
      },

      returnNormalDateFormat: function (sDate) {
        if (sDate) {
          let oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: 'dd-MM-yyyy' });
          var date = oDateFormat.parse(sDate);
          return oDateFormat.format(date);
        }
        return null;
      },

      getUserModel: function () {
        const loginInfo = this.getLoginInfo();
        const oModel = new sap.ui.model.json.JSONModel({
          username: loginInfo?.Username
        });
        this.getView().setModel(oModel, 'userModel');
      },

      setApiResponseObject: function (isSuccess, value) {
        this.pApiResponseObject.success = isSuccess;
        this.pApiResponseObject.object = value;
      },

       getdate:function()
        {
            // Get the current date
            var currentDate = new Date();

            // Extract the date components (year, month, day)
            var year = currentDate.getFullYear();
            var month = String(currentDate.getMonth() + 1).padStart(2, '0');  // Months are zero-based
            var day = String(currentDate.getDate()).padStart(2, '0');

            // Create the date string in YYYY-MM-DD format
            var formattedDate = `${year}-${month}-${day}`;

            // Append 'T00:00:00' to set the time to midnight
            var dateWithTime = `${formattedDate}T00:00:00`;

            console.log(dateWithTime);  // Output: "2025-11-13T00:00:00"
        },

       // Utility function to convert XML to JSON
xmlToJson: function (xml) {
    // Create a new DOMParser instance
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xml, "text/xml");

    // Function to convert XML to JSON
    function xmlNodeToJson(node) {
        var obj = {};

        // If the node is an element
        if (node.nodeType === 1) {
            // If it has attributes, add them to the JSON object
            if (node.attributes.length > 0) {
                for (var i = 0; i < node.attributes.length; i++) {
                    var attribute = node.attributes.item(i);
                    obj[attribute.nodeName] = attribute.nodeValue;
                }
            }
        }

        // If the node has child nodes, process each one
        if (node.hasChildNodes()) {
            for (var i = 0; i < node.childNodes.length; i++) {
                var item = node.childNodes.item(i);
                var nodeName = item.nodeName;

                // If the same node name appears more than once, make it an array
                if (typeof obj[nodeName] === "undefined") {
                    obj[nodeName] = xmlNodeToJson(item);
                } else {
                    if (typeof obj[nodeName].push === "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlNodeToJson(item));
                }
            }
        }
        return obj;
    }

    // Call the recursive function to parse the XML document
    return xmlNodeToJson(xmlDoc);
},

      getApiResponseObject: function () {
        return this.pApiResponseObject;
      }
      /*
      setEntryFormResponseDataSourceModelName: function (value) {
          this.pEntryFormResponseDataSourceModelName = value;
      },
      */
    });
  }
);
