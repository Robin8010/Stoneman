sap.ui.define([
    "sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel"
], (Controller) => {
    "use strict";

    return Controller.extend("modconfcontroller.SalesOrder", {
        onInit() {

			/*
			 var oPage1Controller = sap.ui.getCore().byId("app").getController(); // Assuming you use an app container

			 var oControl = oPage1Controller.byId("sideNavigation"); // Control ID in Page 1
			 if (oControl) {
			   oControl.setVisible("true");
			 }
			
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Sales").attachPatternMatched(this._onRouteMatched, this);
			*/
			
			//

			this.localModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.localModel, "localModel");

			this._sValidPath = sap.ui.require.toUrl("sap/m/sample/PDFViewerMultiple/sample.pdf");
			this._sInvalidPath = sap.ui.require.toUrl("sap/m/sample/PDFViewerMultiple/sample_nonexisting.pdf");
			
			this._oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this._oModel, "_oModel");
			this._oModel.setData({
				Source: this._sValidPath,
				Title1: "My Title 1",
				Title2: "My Title 2",
				Height: "600px"
			});
			this.getView().setModel(this._oModel);
			this._oModel.refresh(true);
			
        },
		_onRouteMatched: function(oEvent) {
			var oArgs = oEvent.getParameter("arguments");
			var sParam = oArgs.someParam;  // Get the parameter passed from Page1
			// Do something with sParam, e.g., update the model
			//this.getView().getModel().setProperty("/someParam", sParam);
			
			this._oModelRourt = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this._oModelRourt, "_oModelRourt");
			this._oModelRourt.setData({
				someParam: sParam
				
			});
			this.getView().setModel(this._oModelRourt);
			this._oModelRourt.refresh(true);
		  },
		onCorrectPathClick: function() {
			this._oModel.setProperty("/Source", this._sValidPath);
		},
		navBack: function() {
		//	var BPText = this.getView().byId('sideNavigation');
		//	BPText.setVisible(true);
		history.go(-1);
			
			//var router = sap.ui.core.UIComponent.getRouterFor(this);
           // router.navTo("RouteIndex");
		},

		onIncorrectPathClick: function() {
			this._oModel.setProperty("/Source", this._sInvalidPath);
		},
        onAddControlDetail : function(){

            var oItem = new sap.m.ColumnListItem({
				cells: [  new sap.m.Input(), new sap.m.Input({
					showValueHelp: true

				}),
                
                new sap.m.Button({
					icon: "sap-icon://Add",
					 type: "Reject",
					 press: [this.remove, this]
				}),
                new sap.m.Button({
					icon: "sap-icon://remove",
					 type: "Reject",
					 press: [this.remove, this]
				}),
             ]
			});
            var oTable = this.getView().byId("DetailTable");
			oTable.addItem(oItem);
        },
        onDeleteControlDetail: function (oEvent) {
			var oTable = this.getView().byId("DetailTable");
			oTable.removeItem(oEvent.getSource().getParent());
		},
		onClick: function (oEvent) {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
            router.navTo("Child");
		},
		onFileDeleted: function(oEvent) {
			MessageToast.show("Event fileDeleted triggered");
		},

		onFilenameLengthExceed: function(oEvent) {
			MessageToast.show("Event filenameLengthExceed triggered");
		},

		onFileSizeExceed: function(oEvent) {
			MessageToast.show("Event fileSizeExceed triggered");
		},

		onTypeMissmatch: function(oEvent) {
			MessageToast.show("Event typeMissmatch triggered");
		},
		onStartUpload: function(oEvent) {
			var oUploadCollection = this.byId("UploadCollection");
			var oTextArea = this.byId("TextArea");
			var cFiles = oUploadCollection.getItems().length;
			var uploadInfo = cFiles + " file(s)";

			if (cFiles > 0) {
				oUploadCollection.upload;

			//	if (oTextArea.getValue().length === 0) {
				//	uploadInfo = uploadInfo + " without notes";
			//	} else {
				//	uploadInfo = uploadInfo + " with notes";
				//}

				MessageToast.show("Method Upload is called (" + uploadInfo + ")");
				MessageBox.information("Uploaded " + uploadInfo);
				//oTextArea.setValue("");
			}
		},
		onUploadComplete: function(oEvent) {
			var sUploadedFileName = oEvent.getParameter("files")[0].fileName;
			setTimeout(function() {
				var oUploadCollection = this.byId("UploadCollection");

				for (var i = 0; i < oUploadCollection.getItems().length; i++) {
					if (oUploadCollection.getItems()[i].getFileName() === sUploadedFileName) {
						oUploadCollection.removeItem(oUploadCollection.getItems()[i]);
						break;
					}
				}

				// delay the success message in order to see other messages before
				MessageToast.show("Event uploadComplete triggered");
			}.bind(this), 8000);
		},

		////Excell upload process
		onUpload: function (e) {
			this._import(e.getParameter("files") && e.getParameter("files")[0]);
		},
		onExportToPDF: function () {
			window.print();
			//// Create a new jsPDF instance
			//const { jsPDF } = window.jspdf;
			//const doc = new jsPDF();
	
			//// Get the table data from the UI5 table
			//var oTable = this.getView().byId("tbl12");
			//var oBinding = oTable.getBinding("items");
			//var aItems = oBinding.getContexts();
			
			//var aTableData = aItems.map(function (item) {
			//	return item.getObject();
			//});
	
			//// Add the table data to PDF
			//var startY = 10;  // Starting position on Y-axis for the table
		//	var rowHeight = 10; // Height of each row
		//	var columnWidths = [50, 50]; // Column width for two columns (example)
	
			// Add table headers
		//	doc.text("Column 1", 10, startY);
			//doc.text("Column 2", 60, startY);
			
	
			//startY += rowHeight;
	
			//// Loop through each row of data
			//aTableData.forEach(function (row, index) {
			//	//doc.text(row.column1, 10, startY);
				////doc.text(row.column2, 60, startY);
			//	//startY += rowHeight;
			//});
	
			//// Save the generated PDF
			//doc.save("Report.pdf");
		},

		_import: function (file) {
			var that = this;
			var excelData = {};
			if (file && window.FileReader) {
				var reader = new FileReader();
				reader.onload = function (e) {
					var data = e.target.result;
					var workbook = XLSX.read(data, {
						type: 'binary'
					});
					workbook.SheetNames.forEach(function (sheetName) {
						// Here is your object for every sheet in workbook
						excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

					});
					// Setting the data to the local model 
					that.localModel.setData({
						items: excelData
					});
					that.localModel.refresh(true);
					
				};
				reader.onerror = function (ex) {
					console.log(ex);
				};
				
				reader.readAsBinaryString(file);
			}
		}
    });
});