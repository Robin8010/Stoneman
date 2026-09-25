sap.ui.define([
	  "core/generic/genericentryform",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], 
 function (genericentryform, MessageToast, MessageBox, Controller) {
	"use strict";
let ReportHeader_Y;
let PageHeader_Y;
let Line_Y;
let Footer_Y;
let Total=0;
let Quantity=0;
let Sgst=0;
let cgst=0;
let Igst=0;
let _LineTotal=0;
let globalVarForUserId="";
let globalVarForUserName="";
        return genericentryform.extend("modconfcontroller.DebitNoteListForm", {

            onInit: function () {
                genericentryform.prototype.onInit.apply(this, arguments);
                debugger;
            },
            onBeforeShow: async function (oEvent) {
                this.isValidUser();
                await  this.FillListView();
                debugger;
                this.initialize();

            },
            initialize: async function () {
                debugger;
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
            Go:function(oEvent)
            {
                debugger;
                var oInput = this.byId("inputId");
                var sQuery = oEvent.getParameter("newValue");
                this. FillListView(oInput.getValue());
            },
            FillListView: async function (sQuery) {
                debugger;
                            // 2️⃣ Clear previous User data before fetching new one
                            if (this.getView().getModel("Debit")) {
                                this.getView().getModel("Debit").setData({ value: [] });
                            }

                            if(sQuery!=undefined && sQuery!="")
                            {
                                sQuery=`&$filter=contains(SupplierID,'${sQuery}')`;
                            }
                            else
                            {
                                sQuery="";
                            }
                            // 3️⃣ Fetch fresh data from backend
                            await this.createNewModelUsingAPI(
                                "GET",
                                `/sap/opu/odata4/sap/zune_sb_supplierinv_head/srvd_a2x/sap/zune_sd_supplierinv_head/0001/Zune_CDS_SupplierInv_Header?$top=200000${sQuery}`,
                                
                                "",
                                "Debit" // keep model name same as your table binding
                            );

                            // 4️⃣ Get model reference and refresh the UI
                            const oGMCModel = this.getView().getModel("Debit");
                            oGMCModel.refresh(true);

			},
            onSearchWithName: function (oEvent) {
                    debugger;
			var sQuery = oEvent.getParameter("newValue"); // Get search input
			var filters=[];
			if(sQuery)
			{
				var filter1 = new sap.ui.model.Filter({path:"SupplierInvoice",operator:sap.ui.model.FilterOperator.Contains,value1:sQuery});
                var filter2 = new sap.ui.model.Filter({path:"SupplierID",operator:sap.ui.model.FilterOperator.Contains,value1:sQuery});
				filters=[filter1, filter2];
				var finalFilter = new sap.ui.model.Filter({filters:filters, and:false});
		}
		var otable = this.byId("_DebitTbl");
		otable.getBinding("items").filter(finalFilter);
    },

            onEditPress: function (oEvent) {
                debugger;
           
					var oButton = oEvent.getSource();
					var oBindingContext = oButton.getBindingContext("Debit");
					let oRowObject = oBindingContext.getProperty("ID");

					this.setRouteData("2",oRowObject);
					var router = sap.ui.core.UIComponent.getRouterFor(this);
                     router.navTo("RouterNameUserMasterEntryForm");
                     
				
           
		},
		Addnew: function (oEvent) {
debugger;
              var ID="10";
            this.setRouteData("3", ID);
			var router = sap.ui.core.UIComponent.getRouterFor(this);
            router.navTo("RouterNameUserMasterEntryForm");

			var router = sap.ui.core.UIComponent.getRouterFor(this);
            router.navTo("RouterNameUserMasterEntryForm");
		},
        navBack: function() {
            debugger;
		//	var BPText = this.getView().byId('sideNavigation');
		//	BPText.setVisible(true);
		history.go(-1);
			
			//var router = sap.ui.core.UIComponent.getRouterFor(this);
           // router.navTo("RouteIndex");
		},
		
           
            onClosecflForStage: function () {
                let x = this.getCflObject();
            },
        async OnPrint(oEvent)
        {
             debugger;
            const viewModel = this.getView().getModel('Debit')
            var oButton = oEvent.getSource();
					var oBindingContext = oButton.getBindingContext("Debit");
					let SupplierInvoice = oBindingContext.getProperty("SupplierInvoice");
           // let SupplierInvoice=viewModel.getProperty("/SupplierInvoice").getData();
           await this.createNewModelUsingAPI(
                'GET',
                  //`/sap/opu/odata4/sap/zune_sb_supplierinv_headitem/srvd_a2x/sap/zune_sd_supplierinv_headanitem/0001/ZUNE_CDS_SupplierInv_Item_F?$filter=SupplierInvoice eq '${SupplierInvoice}'`,
                 `/sap/opu/odata4/sap/zune_sb_si_union_all3/srvd_a2x/sap/zune_sd_si_union_all3/0001/Zune_CDS_2_SI_Union?$filter=SupplierInvoice eq '${SupplierInvoice}'`,
                '',
                'reportdata'
            );
           debugger;  
          const reportData=this.getView().getModel('reportdata').getData();
          const { value = [] } = reportData || {};
          debugger;
            // Use jsPDF
                const { jsPDF } = window.jspdf;
              const doc = new jsPDF({
              orientation: "landscape", // 👈 change from portrait
              unit: "mm",
              format: "a4"
            });


              const reportHeaderY = this.ReportHeader(doc, value);
            const lineStartY    = this.PageHeader(doc, value, reportHeaderY);

            // ===== LINE ITEMS (AUTO PAGE BREAK) =====
           const Footer= this.LineSection(doc, value, lineStartY);

            /*
            this.ReportHeader(doc,value);
            this.PageHeader(doc,value);
            this.LineSection(doc,value);
            */
            this.foooter(doc,value,Footer);
   
    doc.setFontSize(10);
    //doc.text(`Generated on: ${new Date().toLocaleString()}`, 150, doc.internal.pageSize.height-20);

    // Save/download PDF
    doc.save("SimpleReport.pdf");
        },
       ReportHeader: function (doc, value) {

        /////////
        
        ////////

    let y = 10;

    doc.setFont("Arial", "bold");
    doc.setFontSize(10);
    doc.text(`${value[0].CompanyName}`, 60, y);

    doc.setFontSize(14);
    doc.text("DebitNote", 194, y + 2);

    doc.setFont("Arial", "normal");

    doc.line(5, y + 20, doc.internal.pageSize.getWidth() - 5, y + 20);

    ///////
     doc.setFont("Arial", "normal");
            doc.line(150, y+10, 150, y+20); //Line vartival
            doc.line(185, y+10, 185, y+20); //vartical section
            doc.line(220, y+10, 220, y+20); //vartical section
            doc.line(150, y+10, doc.internal.pageSize.getWidth()-5, y+10); // horijontal line     Right Section
            doc.line(5, y+20, doc.internal.pageSize.getWidth() - 5, y+20);  // horijontal line for Report Header

            //#region StaticText for DebitNote
             doc.setFontSize(7);
              doc.text("DebitNote Number", 154, y+14);
               doc.text(`${value[0].SupplierInvoice}`, 154, y+18);
               doc.text("DebitNote Date", 190, y+14);
               doc.text(`${value[0].Deliverydate}`, 190, y+18);
               doc.text("Vendor ref No.", 230, y+14);
               doc.text(`${value[0].SupplierInvoiceIDByInvcgParty}`, 230, y+18);
            //#endregion
            
             y+=5;

            doc.setFontSize(7);
            doc.text(`${value[0].Plant_Full_Address}`, 45, y);
                
            y+=7;
            doc.setFontSize(7);
            doc.text("GSTIN No:-", 50, y);
            doc.text(`${value[0].Plant_GSTIN}`, 65, y );
            y+=3;
            doc.text("GSTIN Type:-", 50, y);
            doc.text(`${value[0].GSTN_Type}`, 65, y );
            y+=3;
        //  doc.line(80, y, 135, y); // horizontal line
            y+=2;
            //ReportHeader_Y=y;

    ///////

   // y += 25;

    // ✅ RETURN WHERE NEXT SECTION SHOULD START
    return y;
   // this.PageHeader(doc, value, y)
},


       PageHeader: function (doc, value, startY) {

    const pageWidth = doc.internal.pageSize.getWidth();

    let Py = startY;

    // Page border
    doc.rect(5, 5, pageWidth - 10, doc.internal.pageSize.getHeight() - 10);

    doc.line(5, Py, pageWidth - 5, Py);

    doc.line(75, Py, 75, Py + 50);
    doc.line(150, Py, 150, Py + 50);
    doc.line(220, Py, 220, Py + 50);

    doc.line(220, Py + 25, pageWidth - 5, Py + 25);

    // ---- Billing section ----
     //#region  BIll&Ship address  Static
         doc.text("Billing Address:-", 7, Py+5);
         doc.text(`${value[0].OrganizationName2}`, 7, Py+10);
         doc.text(`${value[0].CareOfName}`, 7, Py+13);
         doc.text(`${value[0].StreetPrefixName1}`, 7, Py+16)
         doc.text(`${value[0].StreetSuffixName1}`, 7, Py+18)
         doc.text(`${value[0].StreetSuffixName2}`, 7, Py+22)
         doc.text(`${value[0].Addressline6}`, 7, Py+25)
         doc.text(`${value[0].Addressline3}`, 7, Py+28)
         doc.text("Ship Address:-", 77, Py+5);
         doc.text("Vender Code:-", 152, Py+5);
         doc.text(`${value[0].SupplierID}`, 170, Py+5);
         doc.text("Vender Name:-", 152, Py+10);
         doc.text(`${value[0].OrganizationName2}`, 170, Py+10);
         doc.text("GST Registration Number:-", 152, Py+30);
         doc.text(`${value[0].Supplier_GSTIN}`, 185, Py+30);
         doc.text("GST Registration Type:-", 152, Py+35);
         doc.text(`${value[0].GSTN_Type}`, 185, Py+35);
         doc.text("Bill of Supply/State Code:-", 152, Py+40);
         doc.text(`${value[0].PlaceofSupply}`, 185, Py+40);
         doc.text("Delivery Date:-", 222, Py+5);
           doc.text(`${value[0].Deliverydate}`, 260, Py+5);
         doc.text("Shipping Terms:-", 222, Py+10);
          // doc.text(`${value[0].PlaceofSupply}`, 260, Py+10);
         doc.text("Contact Details:-", 222, Py+30);
         doc.text("Name:-", 222, Py+35);
     //    doc.text(`${value[0].PlaceofSupply}`, 260, Py+35);
         doc.text("Contact No:-", 222, Py+40);
        //   doc.text(`${value[0].PlaceofSupply}`, 260, Py+40);
         doc.text("Email:-", 222, Py+45);
         //  doc.text(`${value[0].PlaceofSupply}`, 260, Py+45);

        //#endregion

        ////

    // ---- Table Header ----
    Py += 50;
    doc.line(5, Py, pageWidth - 5, Py);

    Py += 4;
    doc.text("Sr No.", 8, Py);
                doc.text("Item Code/Product Description", 18, Py);
                doc.text("HSN / SAC", 92, Py);
                doc.text(" Code", 92, Py+3);
                doc.text("Quantity", 108, Py);
                doc.text("UOM", 127, Py);
                doc.text("Unit Price [INR]", 145, Py);
             
                doc.text("Total[INR]", 174, Py);
                doc.text("CGST[INR]", 198, Py);
                doc.text("Rate", 189, Py+5);
                doc.text("Amount", 199, Py+5);
                doc.text("SGST[INR]", 222, Py);
                doc.text("Rate", 215, Py+5);
                doc.text("Amount", 224, Py+5);
                doc.text("IGST[INR]", 251, Py);
                doc.text("Rate", 241, Py+5);
                doc.text("Amount", 250, Py+5);
                doc.text("Line Total[INR]", 273, Py);

                  doc.line(17, Py-4, 17, Py-5 +  12); // Vertical line between "Material" and "Quantity"
            doc.line(90, Py-4 , 90, Py-5 +  12 ); // Vertical line between "Quantity" and "UOM"
            doc.line(107, Py-4 , 107, Py-5 +  12);
            doc.line(125, Py-4 , 125, Py-5 +  12 );
            doc.line(140, Py-4 , 140, Py-5 +  12 );
          //  doc.line(157, Py-4 , 157, Py-5 +  12 );
            //doc.line(175, Py-4 , 175, Py-5 +  12 );
            doc.line(162, Py-4 , 162, Py-5 +  12 );
            doc.line(188, Py-4 , 188, Py-5 +  12 );
                        doc.line(198, Py+2 , 198, Py-5 +  12 );//Small sepration b/Wrate an dAmount
            doc.line(214, Py-4 , 214, Py-5 +  12 );
                        doc.line(223, Py+2 , 223, Py-5 +  12 );
            doc.line(240, Py-4 , 240, Py-5 +  12 );
                        doc.line(249, Py+2 , 249, Py-5 +  12 );
            doc.line(266, Py-4 , 266, Py-5 +  12 );
             doc.line(188, Py+2, 266, Py+2); // horizontal line

    Py += 7;
    doc.line(5, Py, pageWidth - 5, Py);

    // ✅ RETURN START Y FOR LINE ITEMS
    return Py + 3;
},

     

 
        LineSection: function (doc, value, startY) {

    let LineY = startY;

    const pageHeight = doc.internal.pageSize.getHeight();
    const bottomMargin = 30;
    const textLineHeight = 3;
    const minRowHeight = 4;

    for (let i = 0; i < value.length; i++) {//ItemCode
        
        const descLines = doc.splitTextToSize(
            (value[i].ItemCode || "") + " / " + (value[i].Item_Product_Desc || ""),
            60
        );

        const rowHeight = Math.max(
            descLines.length * textLineHeight,
            minRowHeight
        );

        // ===== PAGE BREAK (CORRECT WAY) =====
        if (LineY + rowHeight > pageHeight - bottomMargin) {
            doc.addPage();

            const reportY = this.ReportHeader(doc, value);
            LineY = this.PageHeader(doc, value, reportY);
        }

        const rowStartY = LineY;

        descLines.forEach((line, idx) => {
            doc.text(line, 21, rowStartY + idx * textLineHeight);
        });

        doc.text((i + 1).toString(), 8, rowStartY);
        doc.text(`${value[i].HSNCode}`, 92, rowStartY);
       // doc.text(`${value[i].HSNCode || ""}`, 92, rowStartY);
        doc.text(Number(value[i].Quantity || 0.00).toFixed(2), 122, rowStartY,{ align: "right" });
        doc.text(`${value[i].UOM || ""}`, 127, rowStartY);
        doc.text(Number(value[i].C_UnitPrice || 0.00).toFixed(2), 160, rowStartY,{ align: "right" });
        doc.text(Number(value[i].Total || 0.00).toFixed(2), 185, rowStartY,{ align: "right" });
        doc.text(`${Number(value[i].CgstRate || 0.00).toFixed(2)}`, 195, rowStartY,{ align: "right" });
        doc.text(`${Number(value[i].CGSTAmount || 0.00).toFixed(2)}`, 212, rowStartY,{ align: "right" });
        doc.text(`${Number(value[i].SgstRate || 0.00).toFixed(2)}`, 220, rowStartY,{ align: "right" });
        doc.text(`${Number(value[i].SGSTAmount || 0.00).toFixed(2)}`, 237, rowStartY,{ align: "right" });
        doc.text(`${Number(value[i].IgstRate || 0.00).toFixed(2)}`, 248, rowStartY,{ align: "right" });
        doc.text(`${Number(value[i].IgstAmount || 0.00).toFixed(2)}`, 264, rowStartY,{ align: "right" });
        
        let LineTotal=(Number(value[i].Total))+Number(value[i].CGSTAmount)+Number(value[i].SGSTAmount)+Number(value[i].IgstAmount);
         doc.text(`${Number(LineTotal || 0.00).toFixed(2)}`, 288, rowStartY,{ align: "right" });

        doc.line(5, rowStartY + rowHeight + 2,
                 doc.internal.pageSize.getWidth() - 5,
                 rowStartY + rowHeight + 2);


                  // Vertical lines (grow with row)
        // -----------------------------
        [
            17, 90, 107, 125, 140,
            162, 188,198,223,249, 214, 240, 266
        ].forEach(x => {
            doc.line(
                x,
                rowStartY - 4,
                x,
                rowStartY + rowHeight + 2
            );
        });


        LineY += rowHeight + 6;
    }

    return LineY;
},


        
       

         splitBySize:function(str, size = 10) {
            //debugger;
                const result = [];
                for (let i = 0; i < str.length; i += size) {
                    result.push(str.slice(i, i + size));
                }
                return result;
                },

               
        foooter:function(doc,value,Footer_Y)
        {
            debugger;
            let FooterY=Footer_Y;

             [
            17, 90, 107, 125, 140,
            162, 188,198,223,249, 214, 240, 266
        ].forEach(x => {
            doc.line(
                x,
                Footer_Y - 4,
                x,
                Footer_Y  + 12
            );
        });

         [
              107, 125, 162,214,266,
            188
        ].forEach(x => {
            doc.line(
                x,
                Footer_Y - 4,
                x,
                Footer_Y  + 18
            );
        });

         [
            188,240
        ].forEach(x => {
            doc.line(
                x,
                Footer_Y - 4,
                x,
                Footer_Y  + 32
            );
        });

            //doc.line(5, FooterY + 6, doc.internal.pageSize.getWidth() - 5, FooterY + 6);
            doc.line(5, FooterY + 12, doc.internal.pageSize.getWidth() - 5, FooterY + 12);
            doc.line(5, FooterY + 18, doc.internal.pageSize.getWidth() - 5, FooterY + 18);
            doc.line(5, FooterY + 24, doc.internal.pageSize.getWidth() - 5, FooterY + 24);
            doc.line(5, FooterY + 28, doc.internal.pageSize.getWidth() - 5, FooterY + 28);
            doc.line(5, FooterY + 32, doc.internal.pageSize.getWidth() - 5, FooterY + 32);
             doc.line(5, FooterY + 60, doc.internal.pageSize.getWidth() - 5, FooterY + 60);
            
               // doc.text("Freight[INR]", 20, FooterY );
                //doc.text("Insurance[INR]", 20, FooterY + 5);
               // doc.text("Packing and Forwarding Expenses [INR]", 20, FooterY + 10);

                //FreightAmt
                //let FreightAmt=value[0].FreightAmt;
                debugger;
                let TDS_Amount=value[0].TDS_Amount;
               // doc.text(`${Number(FreightAmt).toFixed(2)}`, 288, FooterY ,{ align: "right" });
               // doc.text("0.00", 288, FooterY + 5,{ align: "right" });
               // doc.text("0.00", 288, FooterY + 10,{ align: "right" });


                doc.setFont("Arial", "bold");
              doc.text("Total Amount[INR]", 140, FooterY + 15);
                        
               doc.text("Remarks", 10, FooterY + 27);
                doc.text("TDS", 200, FooterY + 27);
               doc.text("Amount In words: (INR)", 10, FooterY + 31);
                 
                 doc.text("Total: (INR)", 200, FooterY + 31);

               doc.text("Stoneman craft India Pvt Ltd.", 240, FooterY + 38);
                doc.setFont("Arial", "normal");
                 doc.text("Signature of the Authorized Representative", 240, FooterY + 50);
                 doc.setFont("Arial", "bold");
                 doc.text("This is a computer generated document and does not require Signature", 10, FooterY + 65);

                    this.calculateLineTotalSum(value);
                    //let DocTotal=_LineTotal+value[0].FreightAmt;
                    let DocTotal=_LineTotal;//+value[0].TDS_Amount;
                 let _words=   this.getAmountSummary(Number(DocTotal));
                  doc.setFont("Arial", "normal");
                  doc.text(`${value[0].InvoiceNarration}`, 30, FooterY + 27);
                   doc.setFont("Arial", "bold");
                 doc.text(`${_words}`, 40, FooterY + 31);

                   doc.setFont("Arial", "bold");
                 
                 doc.text(`${Number(Quantity).toFixed(2)}`, 122, FooterY + 15,{ align: "right" });
                 doc.text(`${Number(Total).toFixed(2)}`, 185, FooterY + 15,{ align: "right" });
                 doc.text(`${Number(Sgst).toFixed(2)}`, 238, FooterY + 15,{ align: "right" });
                 doc.text(`${Number(cgst).toFixed(2)}`, 213, FooterY + 15,{ align: "right" });
                 doc.text(`${Number(Igst).toFixed(2)}`, 264, FooterY + 15,{ align: "right" });
                  doc.text(`${Number(DocTotal).toFixed(2)}`, 288, FooterY + 15,{ align: "right" });
                  debugger;
                   doc.text(`${Number(value[0].TDS_Amount).toFixed(2)}`, 288, FooterY + 27,{ align: "right" });
                   doc.text(`${Number(DocTotal-value[0].TDS_Amount).toFixed(2)}`, 288, FooterY + 31,{ align: "right" });
                    doc.setFont("Arial", "normal");
        },
         calculateLineTotalSum:function(value)
                 {
                    debugger;
                     Total=0;
                     Quantity=0;
                     Sgst=0;
                     cgst=0;
                     Igst=0;
                     _LineTotal=0;
                    for(let j=0;j<value.length; j++)
                    {
                      Quantity=Quantity+  Number(value[j].Quantity)
                      Total=Total+  Number(value[j].Total)
                      Sgst=Sgst+  Number(value[j].SGSTAmount)
                      cgst=cgst+  Number(value[j].CGSTAmount)
                      Igst=Igst+  Number(value[j].IgstAmount)
                       _LineTotal=_LineTotal+(Number(value[j].Total))+Number(value[j].CGSTAmount)+Number(value[j].SGSTAmount)+Number(value[j].IgstAmount);
                    }

                    
      
                },

                getAmountSummary: function (iNum) {

    // ---- SAFETY CHECK ----
    if (iNum === null || iNum === undefined || isNaN(iNum)) {
        return "";
    }

    iNum = Math.floor(Number(iNum));

    const aOnes = [
        "", "One", "Two", "Three", "Four", "Five",
        "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen",
        "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];

    const aTens = [
        "", "", "Twenty", "Thirty", "Forty",
        "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    ];

    const fnConvert = function (num) {
        if (num < 20) return aOnes[num];

        if (num < 100) {
            return aTens[Math.floor(num / 10)] +
                (num % 10 ? " " + aOnes[num % 10] : "");
        }

        if (num < 1000) {
            return aOnes[Math.floor(num / 100)] + " Hundred" +
                (num % 100 ? " " + fnConvert(num % 100) : "");
        }

        if (num < 100000) {
            return fnConvert(Math.floor(num / 1000)) + " Thousand" +
                (num % 1000 ? " " + fnConvert(num % 1000) : "");
        }

        if (num < 10000000) {
            return fnConvert(Math.floor(num / 100000)) + " Lakh" +
                (num % 100000 ? " " + fnConvert(num % 100000) : "");
        }

        return fnConvert(Math.floor(num / 10000000)) + " Crore" +
            (num % 10000000 ? " " + fnConvert(num % 10000000) : "");
    };

    return fnConvert(iNum) || "Zero";
}





        });
    });
