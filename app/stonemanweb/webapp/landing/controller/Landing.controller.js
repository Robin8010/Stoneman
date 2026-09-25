sap.ui.define([
    "core/generic/genericentryform",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/base/Log"
],
(
    genericentryform,
    MessageToast,
    JSONModel,
    Log
) => {

    "use strict";

//console.log("Landing controller loaded");

    return genericentryform.extend("landing.Landing", {


        onInit: function () {

            debugger;

debugger;
           // this.isValidUser();

          

            Log.info(
                this.getView().getControllerName(),
                "onInit"
            );


            let oTitlesModel = new JSONModel();

            this.getView()
                .setModel(oTitlesModel, "titleModel");


        },
        onBeforeRendering: function () {

            debugger;

            this.CheckTilesAccess();

        },

        /*
        ==============================
        TILE AUTHORIZATION
        ==============================
        */

        CheckTilesAccess: function () {


            debugger;


            // Always reset tiles first
            this.hideAllTiles();

            let loginInfo = this.getLoginInfo();
            let isAdmin=  loginInfo.IsAdmin;

            let Desc= loginInfo.Username;
            let _AppModel=this.getView().getModel('sysModel');
            _AppModel.setProperty("/userDetails/UserDsc",Desc);
            _AppModel.refresh(true);

          


            if(isAdmin === true){



                // ADMIN USER

                this.byId("gt1")
                    .setVisible(true);


                this.byId("gt4")
                    .setVisible(true);


                this.byId("gt6")
                    .setVisible(true);



            }
            else {



                // NORMAL USER


                this.byId("gt3")
                    .setVisible(true);


                this.byId("gt5")
                    .setVisible(true);

                this.byId("gt6")
                    .setVisible(true);



            }



        },



        /*
        ==============================
        HIDE ALL TILES
        ==============================
        */

        hideAllTiles:function(){


            let tiles = [
                "gt1",
                "gt3",
                "gt4",
                "gt5",
                "gt6"
            ];



            tiles.forEach(
                function(id){


                    let tile =
                        this.byId(id);



                    if(tile){

                        tile.setVisible(false);

                    }



                }.bind(this)
            );



        },



        /*
        ==============================
        USER MASTER
        ==============================
        */

        ClickMe:function(){


            let loginInfo = this.getLoginInfo();
            let isAdmin=  loginInfo.IsAdmin;
               
                if(isAdmin === true){


                    let router =
                    sap.ui.core.UIComponent
                    .getRouterFor(this);



                    router.navTo(
                        "RouteNameUserMasterConfiguration"
                    );


                }
                else{


                    MessageToast.show(
                        "Not authorized"
                    );


                }

        },



        /*
        ==============================
        GMC
        ==============================
        */

        ShowGMC:function(){



            let router =
            sap.ui.core.UIComponent
            .getRouterFor(this);



            router.navTo(
                "GoodsMChallan"
            );


        },



        /*
        ==============================
        GMC REPORT
        ==============================
        */


        ShowGMCReport:function(){


            let router =
            sap.ui.core.UIComponent
            .getRouterFor(this);



            router.navTo(
                "GMCReport"
            );


        },


         /*
        ==============================
        Show IBPC
        ==============================
        */


        ShowIBPC:function(){


            let router =
            sap.ui.core.UIComponent
            .getRouterFor(this);



            router.navTo(
                "IBPCList"
            );


        },

        /*
        ==============================
        DEBIT NOTE
        ==============================
        */


        ShowDebitNote:function(){


         



                if(isAdmin === true){


                    let router =
                    sap.ui.core.UIComponent
                    .getRouterFor(this);



                    router.navTo(
                        "DebitNoteLayout"
                    );



                }
                else{


                    MessageToast.show(
                        "Not authorized"
                    );


                }

        },



        /*
        ==============================
        USER MAPPING
        ==============================
        */

        Showmapping:function(){



           let loginInfo = this.getLoginInfo();
            let isAdmin=  loginInfo.IsAdmin;



                if(isAdmin === true){



                    let router =
                    sap.ui.core.UIComponent
                    .getRouterFor(this);



                    router.navTo(
                        "PlantVsApproverMap"
                    );



                }
                else{


                    MessageToast.show(
                        "Not authorized"
                    );


                }


        },



        /*
        ==============================
        LOGIN CHECK
        ==============================
        */

        isValidUser:function(){


debugger
            const loginModel =
            this.getOwnerComponent()
            .getModel("UserModel");

              
               // console.log("USER DATA:", loginModel.value);
                //console.log("IS ADMIN:", loginModel.value[0].IsAdmin);

            if(!loginModel){



                let router =
                sap.ui.core.UIComponent
                .getRouterFor(this);



                router.navTo(
                    "RouteIndex"
                );



                MessageToast.show(
                    "Please login again"
                );


            }


        }



    });


});