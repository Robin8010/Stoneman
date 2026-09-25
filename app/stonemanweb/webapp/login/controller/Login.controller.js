sap.ui.define([
    //"core/generic/genericlistview",
    "core/generic/genericentryform",
     "sap/m/MessageToast",
    "sap/m/MessageBox"
    
],


    function (genericentryform,MessageToast,MessageBox) {
        "use strict";
        let UserType;

    return genericentryform.extend("logincontroller.Login", {
        onInit() {
            
          
            var loginModel = { username: "", password: ""};

            let oModel = new sap.ui.model.json.JSONModel(loginModel)
            this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
        },
        onUserNameChanged: function (oEvent) {
            // Get the selected state of the CheckBox
            //var bSelected = oEvent.getParameter("selected");
            var userNameValue = oEvent.getParameter("value");
            // Update the model property based on the CheckBox selection
            let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            //let oModel = cgetModel(this.getEntryFormDataSourceModelName());
            oModel.setProperty("/UserName", userNameValue);
            oModel.refresh(true);
        },
        onPasswordChanged: function (oEvent) {
            // Get the selected state of the CheckBox
            //var bSelected = oEvent.getParameter("selected");
            var passwordValue = oEvent.getParameter("value");
            // Update the model property based on the CheckBox selection
            let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            //let oModel = cgetModel(this.getEntryFormDataSourceModelName());
            oModel.setProperty("/password", passwordValue);
            oModel.refresh(true);
        },
        onEnterPress: function (oEvent) {
            this.onPressLogin(); // Trigger the same logic as button press
        },
        onPressLogin1: async function () {
            //Login Button disable
            debugger;
            let oModelL = this.getView().getModel(this.getEntryFormDataSourceModelName());
           
           // oModelL.refresh(true);
           debugger;
            MessageToast.show("Validating user.....")
            if (this.validateFields()) {
                const modelName = this.getEntryFormDataSourceModelName();
                const model = this.getView().getModel(modelName);
                var userName = model.getProperty("/username");
                var password = model.getProperty("/password");
                debugger;
                await this.createNewModelUsingAPI(
                    'GET',
                    `/odata/v4/user-master-services/UserMasterT?$filter=username eq '${userName}' and password eq '${password}'`,
                    '',
                    'UserModel'
                );
               
                const loginData = this.getView().getModel('UserModel').getData();
                 debugger;
                var login = false;
                if (loginData && loginData.value && loginData.value.length > 0) {
                    login = true;

                     const userData = loginData.value;
                        this.setLoginInfo(
                            userData.ID,
                            userData.username,
                            userData.username,
                            userData.IsProductionAccount,
                            userData.ManagGMC,
                            userData.IsSuperwiser,
                            userData.L1Approver,
                            userData.L2Approver)

                             
          this.setRoleDetails(userData.UserRoleCode, userData.UserRoleCode, userData.UserGuid);

          this.setLoginUserDetails(username, password);
          this.setSecurityDetails(userData.sessionId, userData.accessToken);
                }
                else {
                     login = false;
                }
                   
                  //for temp only
                    var FormMode = { FormMode: "",ID:"",Creater:"ROB01",L1User:"ROB_1",L2user:"ROB0",QAUser:"Sachin"};
                     let _oModel = new sap.ui.model.json.JSONModel(FormMode)
                    this.getOwnerComponent().setModel(_oModel, "UserModel");

                  var login=true;
                if (login) {
                    //Login Button enable
                   // let oModelL = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    
                    //this.getOwnerComponent().setModel(loginData, "UserModel")
                    var router = sap.ui.core.UIComponent.getRouterFor(this);
                    let Control=this.byId("productName");

                   debugger;

                    //App Controll Enable
                    /*
                    let oModelApp = this.getView().getModel('oAppModel');
                    oModelApp.setProperty("/enableToolHeader", true);
                    //Login Button enable
                    oModelL.setProperty("/buttonEnabled", true);
                    oModelApp.refresh(true);
                    //App Controll Enable
                    */
                    MessageToast.show("Redirecting to home.....");
                    
                    router.navTo("LandingPageIndex");
                }
                else {
                    MessageToast.show("Invalid credential....");
                }
            }
        },
         onPressLogin: async function () {
              //this.ClearUserType();
            
            MessageToast.show("Validating user.....")
            if (this.validateFields()) {
                const modelName = this.getEntryFormDataSourceModelName();
                const model = this.getView().getModel(modelName);
                var userName = model.getProperty("/username");
                var password = model.getProperty("/password");
               await this.createNewModelUsingAPI(
                    'GET',
                    `/odata/v4/user-master-services/UserMasterT?$filter=username eq '${userName}' and password eq '${password}'`,
                    '',
                    'UserModel'
                );
                const loginData = this.getView().getModel('UserModel').getData();
                var login = false;
                debugger;
                if (loginData && loginData.value && loginData.value.length > 0) {
                    login = true;
                 
                }
                else {
                    login = false;
                }
                if (login) {
                    debugger;
                

                        let Control=this.byId("productName");
                    if(loginData.value[0].IsProductionAccount==true)
					{
						UserType="P";
					}
                     if(loginData.value[0].IsSuperwiser==true)
					{
						UserType="S";
					}
					if(loginData.value[0].ManagGMC==true)
					{
						UserType="CR";
					}
					if(loginData.value[0].L1Approver==true)
					{
						UserType="L1";
					}
					if(loginData.value[0].L2Approver==true)
					{
						UserType="L2";
					}
                    if(loginData.value[0].IsAdmin==true)
					{
						UserType="Admin";
					}

                    const userData = loginData.value;
                        this.setLoginInfo(
                            loginData.value[0].ID,
                            loginData.value[0].username,
                            loginData.value[0].Description,
                            loginData.value[0].IsProductionAccount,
                            loginData.value[0].ManagGMC,
                            loginData.value[0].IsSuperwiser,
                            loginData.value[0].L1Approver,
                            loginData.value[0].L2Approver,
                            loginData.value[0].IsAdmin,
                            UserType,
                            "",
                            "",
                            ""
                          )


                              let Desc= loginData.value[0].Description;
                    let _AppModel=this.getView().getModel('sysModel');
                    _AppModel.setProperty("/userDetails/UserDsc",Desc);
                    _AppModel.refresh(true);

                    this.getOwnerComponent().setModel(loginData, "UserModel")
                    var router = sap.ui.core.UIComponent.getRouterFor(this);
                    debugger;   

                    var isAdmin = false;
                    if (userName === "Admin") {
                        isAdmin = true;
                    }
                    else {
                        isAdmin = false;
                    }
                   this.setUserType(UserType,loginData.value[0].ID);

                    //App Controll Enable
                   // let oModelApp = this.getView().getModel('oAppModel');
                   // oModelApp.setProperty("/enableToolHeader", true);
                    //Login Button enable
                   // oModelApp.refresh(true);
                    //App Controll Enable
                    MessageToast.show("Redirecting to home.....");

                   // oModelL.refresh(true);
                    router.navTo("LandingPageIndex");
                }
                else {
                    MessageToast.show("Invalid credential....");
                }
            }
        },

        setLoginUserDetails: function (sUserId,userName, Profile) {
        const oModel = this.getView().getModel('sysModel');

        const userDetails = {
          username: sUserId,
          username: sUserName,
          profile:Profile
        };

        const encryptedUserDetails = this.encryptData(JSON.stringify(userDetails), this.getSecretKey());

        oModel.setProperty('/userDetails', userDetails);
    
        this.getView().setModel(oModel, 'sysModel');
      },
        validateFields: function () {
            let isValid = true;

            const oModel = this.getEntryFormModel();
            const username = oModel.getProperty('/username');
            const password = oModel.getProperty('/password');

            if (!username || username.trim() === '') {
                isValid = false;
                sap.m.MessageToast.show('Please enter username');
            } else if (!password || password.trim() === '') {
                isValid = false;
                sap.m.MessageToast.show('Please enter password');
            }
            return isValid;
        },
        
    });
});