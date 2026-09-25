sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("modconfcontroller.ChildScreen.controller", {
        onInit() {
        },
        onOpenDialog: function () {
            var oDialog = this.byId("myDialog");
            oDialog.open();  // Open the dialog
        },

        // Function to close the dialog
        onCloseDialog: function () {
            var oDialog = this.byId("myDialog");
            oDialog.close();  // Close the dialog
        }
    });
});