sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("stonemanweb.controller.Index", {
        onInit() {
             var router = sap.ui.core.UIComponent.getRouterFor(this);
            router.navTo("LoginPage");
        },
        onMove : function(){
            var router = sap.ui.core.UIComponent.getRouterFor(this);
            router.navTo("LoginPage");
        }
    });
});