sap.ui.define([
	  "core/generic/genericentryform",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
],  function (genericentryform, MessageToast, MessageBox, Controller) {
        "use strict";
		let UserType;
		 let globalVarForUserId = "";
		  let globalVarForUserName = "";
		 return genericentryform.extend("modconfcontroller.GoodsMovmentList", {

	
		onInit: function () {
			genericentryform.prototype.onInit.apply(this, arguments); 
			
		},
		 onBeforeShow: function (oEvent) {
                this.isValidUser();
                this.initialize();

            },
		 initialize: async function () {

                this.FillListView();
		},

		FillListView: async function () {
   			 debugger
			// 2️⃣ Clear previous GMC data before fetching new one
			if (this.getView().getModel("GMC")) {
				this.getView().getModel("GMC").setData({ value: [] });
			}

			// 3️⃣ Fetch fresh data from backend
			debugger;

			 let   _LoginInfo = this.getLoginInfo()
                 let usertype = _LoginInfo.UserType;

			

			
		debugger;
			 
			if(usertype=='CR')
			{	 
				var DisEnbModal = { Enable:true};
            	let oEnbModel = new sap.ui.model.json.JSONModel(DisEnbModal)
             	this.getView().setModel(oEnbModel, 'ENBmodel');
            	//oModel.refresh(true);
			}
			else
			{
				var DisEnbModal = { Enable:false};
            	let oEnbModel = new sap.ui.model.json.JSONModel(DisEnbModal)
             	this.getView().setModel(oEnbModel, 'ENBmodel');
            	//oModel.refresh(true);
			}
			if(usertype=="CR")
			{
				debugger;
					await this.createNewModelUsingAPI(
						"GET",`/odata/v4/gmcheader-services/GMCHeader?$filter=Creater eq '${globalVarForUserId}'&$orderby=GMCNo asc&$top=10000 `,"","GMC3" 
						//"GET",`/odata/v4/gmcheader-services/GMCHeader`,"","GMC" 
                         );

						await this.createNewModelUsingAPI(
						"GET",`/odata/v4/gmcheader-services/GMCHeader?$filter=NSuperwiserName eq '${globalVarForUserId}' and FirstLevelStatus eq 'Approve' and SecondLevelStatus eq ''&$orderby=GMCNo asc&$top=10000`,"","GMC4" 
						//"GET",`/odata/v4/gmcheader-services/GMCHeader`,"","GMC" 
					    );
						

						const oGMC1Model = this.getView().getModel("GMC3");
		const oGMC2Model = this.getView().getModel("GMC4");

		// Assuming both models have a `value` property holding the actual array data
			const dataGMC1 = oGMC1Model.getData().value || [];  // Default to empty array if no data
			const dataGMC2 = oGMC2Model.getData().value || [];  // Default to empty array if no data

			// Merge the data from both models
				let mergedData = [...dataGMC1, ...dataGMC2];

				// Sort merged data by GMCNo ascending
				mergedData.sort((a, b) => {
					return Number(a.GMCNo) - Number(b.GMCNo);
				});

				// Create the final model
				const oGMCModel = new sap.ui.model.json.JSONModel();
				oGMCModel.setData({ value: mergedData });

				this.getView().setModel(oGMCModel, "GMC");
					
					
					

			}
			if(usertype=="S")//Not in used
			{
					await this.createNewModelUsingAPI(
						"GET",`/odata/v4/gmcheader-services/GMCHeader?$filter=NSuperwiserName eq '${globalVarForUserId}' and FirstLevelStatus eq 'Approve' and SecondLevelStatus eq ''&$orderby=GMCNo asc&$top=10000`,"","GMC" 
						//"GET",`/odata/v4/gmcheader-services/GMCHeader`,"","GMC" 
					);
					const oGMCModel = this.getView().getModel("GMC");
					oGMCModel.refresh(true);
			}
			else if(usertype=="L1")
			{
					await this.createNewModelUsingAPI(
						"GET",`/odata/v4/gmcheader-services/GMCHeader?$filter=QANM eq '${globalVarForUserId}' and (SuperwiserStatus eq '' or SuperwiserStatus eq null ) and SecondLevelStatus eq ''&$orderby=GMCNo asc&$top=10000`,"","GMC1" 
					);

					await this.createNewModelUsingAPI(
						"GET",`/odata/v4/gmcheader-services/GMCHeader?$filter=NQAName eq '${globalVarForUserId}' and SecondLevelStatus eq '' and SuperwiserStatus eq 'Approve'&$orderby=GMCNo asc&$top=10000`,"","GMC2" 
					);


					const oGMC1Model = this.getView().getModel("GMC1");
		const oGMC2Model = this.getView().getModel("GMC2");

		// Assuming both models have a `value` property holding the actual array data
			const dataGMC1 = oGMC1Model.getData().value || [];  // Default to empty array if no data
			const dataGMC2 = oGMC2Model.getData().value || [];  // Default to empty array if no data

			// Merge the data from both models
			let mergedData = [...dataGMC1, ...dataGMC2];  // Concatenate the data arrays
			//const oGMCModel = this.getView().getModel("GMC");  // Use the model where you want to store merged data
			//oGMCModel.setData({ value: mergedData });

			const oGMCModel = new sap.ui.model.json.JSONModel(); // Create a new JSON model
			oGMCModel.setData({ value: mergedData }); // Set the merged data to this model
			this.getView().setModel(oGMCModel, "GMC"); 
		
			}			
			else if(usertype=="P")
			{
					await this.createNewModelUsingAPI(
						"GET",`/odata/v4/gmcheader-services/GMCHeader?$filter=ProductionAccountant eq '${globalVarForUserId}' and IsDocumentreadyForPosting eq 'true'&$orderby=GMCNo asc&$top=10000`,"","GMC" 
					);
					const oGMCModel = this.getView().getModel("GMC");
					oGMCModel.refresh(true);
			}
			
			// 4️⃣ Get model reference and refresh the UI
			//const oGMCModel = this.getView().getModel("GMC");
			//oGMCModel.refresh(true);

			
			},
			   isValidUser: function () {
				debugger;
             let   _LoginInfo = this.getLoginInfo()
                 let userid = _LoginInfo.UserID;
                  let Usercode = _LoginInfo.Usercode;

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
                   globalVarForUserId= Usercode;
				   globalVarForUserName=Usercode;
                }
            },
		
		onEditPress: function (oEvent) {
			debugger;
				var oButton = oEvent.getSource();
					var oBindingContext = oButton.getBindingContext("GMC");
					let oRowObject = oBindingContext.getProperty("ID");

					const oLoginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));

					if (oLoginInfo) {
						oLoginInfo.FormMode = "2";
						oLoginInfo.RowId=oRowObject;
						sessionStorage.setItem("loginInfo", JSON.stringify(oLoginInfo));
					}

					//this.setRouteData("2",oRowObject);
					var router = sap.ui.core.UIComponent.getRouterFor(this);
                     router.navTo("GoodsMChallanEntry");
					
				
		},
		Addnew: function (oEvent) {
			var ID="";
          const oLoginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));

					if (oLoginInfo) {
						oLoginInfo.FormMode = "3";
						oLoginInfo.RowId=ID;
						sessionStorage.setItem("loginInfo", JSON.stringify(oLoginInfo));
					}
			var router = sap.ui.core.UIComponent.getRouterFor(this);
            router.navTo("GoodsMChallanEntry");
		},

		onSearch111: function (oEvent) {
			var sQuery = oEvent.getParameter("newValue"); // Get search input
			var filters=[];
			if(sQuery)
			{
				var filter1 = new sap.ui.model.Filter({path:"GMCNo",operator:sap.ui.model.FilterOperator.Contains,value1:sQuery});
				var filter2 = new sap.ui.model.Filter({path:"GMCNo",operator:sap.ui.model.FilterOperator.Contains,value1:sQuery});
				filters=[filter1,filter2];
				var finalFilter = new sap.ui.model.Filter({filters:filters, and:false});
		}
		var otable = this.byId("Tbl");
		otable.getBinding("items").filter(finalFilter);
			
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
	onSearchWithName: function (oEvent) {
		var sQuery = oEvent.getParameter("newValue"); // Get search input
		var filters=[];
		if(sQuery)
		{
			var filter1 = new sap.ui.model.Filter({path:"Name",operator:sap.ui.model.FilterOperator.Contains,value1:sQuery});
			filters=[filter1];
			var finalFilter = new sap.ui.model.Filter({filters:filters, and:false});
	}
	var otable = this.byId("Tbl");
	otable.getBinding("items").filter(finalFilter);
		
},
navBack: function() {
		
		  var router = sap.ui.core.UIComponent.getRouterFor(this);
                //MessageToast.show("Redirecting to GMC.....")
                router.navTo("LandingPageIndex");
		},
onSearchWithDate: function (oEvent) {
	var sQuery = oEvent.getParameter("newValue"); // Get search input
	var filters=[];
	if(sQuery)
	{
		var filter1 = new sap.ui.model.Filter({path:"DocDate",operator:sap.ui.model.FilterOperator.Contains,value1:sQuery});
		filters=[filter1];
		var finalFilter = new sap.ui.model.Filter({filters:filters, and:false});
}
var otable = this.byId("Tbl");
otable.getBinding("items").filter(finalFilter);
	
}


	});
});