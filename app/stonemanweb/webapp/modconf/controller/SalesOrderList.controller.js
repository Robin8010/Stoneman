sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], (Controller) => {
	"use strict";

	return Controller.extend("modconfcontroller.SalesOrderList", {
		onInit: function () {
			// Sample data
			//this.oData = new sap.ui.model.json.JSONModel();
			var oData = {
				items: [
					{ DocNum: "1", Code: "BK001",Name:"Burger king CP" ,Ref:"Bk-5002",DocDate: "10/02/2024" },
					{ DocNum: "2", Code: "BK002",Name:"Burger king Gurugram" ,Ref:"Bk-5002",DocDate: "11/03/2025" },
					{ DocNum: "3", Code: "BK003",Name:"Burger king Delhi",Ref:"Bk-5002" ,DocDate: "12/02/2025" },
					{ DocNum: "4", Code: "BK004",Name:"Burger king ghaziabad" ,Ref:"Bk-5002",DocDate: "12/01/2025" }
				]
			};

			// Create a JSONModel with the sample data
			const oModel = new sap.ui.model.json.JSONModel(oData);
			this.getView().setModel(oModel, "Robin");
			
		},


		onEditPress: function (oEvent) {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
            router.navTo("Sales",{
               someParam: "1"

             });
		},
		Addnew: function (oEvent) {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
            router.navTo("Sales",{ someParam: "1"});
		},

		onSearch: function (oEvent) {
			var sQuery = oEvent.getParameter("newValue"); // Get search input
			var filters=[];
			if(sQuery)
			{
				var filter1 = new sap.ui.model.Filter({path:"DocNum",operator:sap.ui.model.FilterOperator.Contains,value1:sQuery});
				filters=[filter1];
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