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
		 return genericentryform.extend("modconfcontroller.GoodsReport", {

	
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
					await this.createNewModelUsingAPI(
						"GET",`/odata/v4/gmcheader-services/GMCHeader?$orderby=GMCNo&$top=100000  `,"","GMCData" 
                         );
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
		
		onEditPress: function (oEvent) {
			debugger;
				var oButton = oEvent.getSource();
					var oBindingContext = oButton.getBindingContext("GMC");
					let oRowObject = oBindingContext.getProperty("ID");

					this.setRouteData("2",oRowObject);
					var router = sap.ui.core.UIComponent.getRouterFor(this);
                     router.navTo("GoodsMChallanEntry");
					
				
		},
		Addnew: function (oEvent) {
			var ID="";
            this.setRouteData("3",ID);
			var router = sap.ui.core.UIComponent.getRouterFor(this);
            router.navTo("GoodsMChallanEntry");
		},
onGo: function () {
    var oView = this.getView();
    var oFromDate = oView.byId("Fromdate").getDateValue();
    var oToDate = oView.byId("Todate").getDateValue();
    var oTable = oView.byId("_GMCReportTbl");
    var oBinding = oTable.getBinding("items");

    var aFilters = [];

    if (oFromDate && oToDate) {
        var iFrom = oFromDate.getTime();

        var oToDateEnd = new Date(oToDate);
        oToDateEnd.setHours(23, 59, 59, 999);
        var iTo = oToDateEnd.getTime();

        aFilters.push(new sap.ui.model.Filter({
            path: "createdAt",
            test: function (sValue) {
                if (!sValue) { return false; }
                var iRecordTime = new Date(sValue).getTime();
                return iRecordTime >= iFrom && iRecordTime <= iTo;
            }
        }));
    }

    oBinding.filter(aFilters);

    console.log("Filtered length:", oBinding.getLength());
},
		onSearch: function (oEvent) {
			var sQuery = oEvent.getParameter("newValue"); // Get search input
			var filters=[];
			if(sQuery)
			{
				var filter1 = new sap.ui.model.Filter({path:"GMCNo",operator:sap.ui.model.FilterOperator.EQ,value1:sQuery});
                var filter2 = new sap.ui.model.Filter({path:"SONO",operator:sap.ui.model.FilterOperator.Contains,value1:sQuery});
                var filter3 = new sap.ui.model.Filter({path:"FromProcessNM",operator:sap.ui.model.FilterOperator.Contains,value1:sQuery});
                var filter4 = new sap.ui.model.Filter({path:"JobworkPo",operator:sap.ui.model.FilterOperator.Contains,value1:sQuery});
                var filter5 = new sap.ui.model.Filter({path:"ToProcessNM",operator:sap.ui.model.FilterOperator.Contains,value1:sQuery});
                var filter6 = new sap.ui.model.Filter({path:"QANM",operator:sap.ui.model.FilterOperator.Contains,value1:sQuery});
                var filter7 = new sap.ui.model.Filter({path:"createdAt",operator:sap.ui.model.FilterOperator.Contains,value1:sQuery});
				filters=[filter1, filter2, filter3, filter4, filter5, filter6,filter7];
				var finalFilter = new sap.ui.model.Filter({filters:filters, and:false});
		}
		var otable = this.byId("_GMCReportTbl");
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
   Todate:function(sDate)
        {
            debugger;
                // Convert string to JS Date
                var oDate = new Date(sDate);

                // Create formatter
                var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "dd/MM/yyyy"
                });

                // Format it
                var sFormattedDate = oFormat.format(oDate);

                return sFormattedDate;
        },
        ToTime: function(sDate) {
            debugger;
    var oDate = new Date(sDate);

    var oFormat = sap.ui.core.format.DateFormat.getTimeInstance({
        pattern: "HH:mm a"
    });

    return oFormat.format(oDate);
},
 OnExport: async function () {
	await this.createNewModelUsingAPI(
						"GET",`/odata/v4/report-data/GMCHeaderReport?$orderby=GMCNo&$top=100000 `,"","_GMCData" 
                         );
    let oModel = this.getView().getModel("_GMCData");
    let aData = oModel.getData().value || [];

    let iSr = 1;
    debugger;
    //let date=this.Todate(aData.createdAt) || "";
    //let Time=this.ToTime(aData.createdAt) || "";
    let aExportData = aData.map( (item)=>  {
        return {
            "Sr No.":                       iSr++,
            "GMC No.":                      item.GMCNo || "",
            "GMC Date":                     this.Todate(item.createdAt) || "",
            "Create Time":                  this.ToTime(item.createdAt) || "",
            "GMC Quantity":                 item.GMCQty || "",
            "Cycle Time":                   item.CycleTime || "",
            "Sale Order Number":            item.SONO || "",
            "Style Number":                 item.ManualSalesOrderItemCode || "",
            "InspectionType":                 item.InspectionType || "",
            "QA Number":                 item.QADocumentNum || "",
            "Purchase Order No.":           item.JobworkPo || "",
            "Vendor Code":                  item.VendorCode || "",
            "Vendor Name":                  item.ContractNM || "",
            "Item Code":                    item.SKU || "",
            "Item Description":             item.SFGDsc || "",
            "Full Item Description":        item.PODescription || "",
            "From Process":                 item.FromProcessNM || "",
            "Supervisor Name":              item.Superviser1 || "",
            "QA Name":                      item.QA1Name || "",
            "To Process":                   item.ToProcessNM || "",
            "To Process Vendor Code":       item.NContractCode || "",
            "To Process Vendor Name":       item.NContractName || "",
            "To Process Supervisor":        item.Superviser2 || "",
            "To Process QA":                item.QA2 || "",
            "Quality-01 Approval Status":   item.FirstLevelStatus || "",
            //"Approved Time":             item.FirstLevelApprovedTime || "",
            "Supervisor-02 Approval Status":item.SuperwiserStatus || "",
            //"Approved Time":             item.SecondLevelApprovedTime || "",
            "Quality-02 Approval Status":   item.SecondLevelStatus || "",
           // "Approved Time":             item.SecondLevelUser || "",
            "Production Accountant":        item.ProductionAccountant || ""
        };
    });

    let worksheet = XLSX.utils.json_to_sheet(aExportData);

    // Auto column width
    let aCols = Object.keys(aExportData[0] || {}).map(function (key) {
        return { wch: Math.max(key.length + 2, 12) };
    });
    worksheet["!cols"] = aCols;

    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GMC Report");
    XLSX.writeFile(workbook, "GMC_Report.xlsx");
},
 onCancel:function()
        {
			 history.go(-1);
           // var router = sap.ui.core.UIComponent.getRouterFor(this);
             //   //MessageToast.show("Redirecting to GMC.....")
            //    router.navTo("GoodsMChallan");
        },
navBack: function() {
		
		//history.go(-1);
			
			var router = sap.ui.core.UIComponent.getRouterFor(this);
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