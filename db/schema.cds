using {
    cuid,
    managed
} from '@sap/cds/common';

namespace Stonemen_GMC;

entity UserMasterT:cuid,managed {
    username                :String;
    Description             :String;
    password                :String;
    IsAdmin                 :Boolean;
    ManagGMC                :Boolean;
    IsSuperwiser            :Boolean;
    IsProductionAccount     :Boolean;
    L1Approver              :Boolean;
    L2Approver              :Boolean;
    Contractor              :Boolean;
    ExtraFiled              :String;
    ISActive                :Boolean;

}

entity GMCHeader    :cuid,managed {
    GMCNo                       :Int32;
    JobworkPo                   :String;
    SKU                         :String;
    SONO                        :String;
    VendorCode                  :String;
    PODescription               :String;
    ContractNM                  :String;
    SuperwiserNM                :String;
    FromProcess                 :String;
    FromProcessNM               :String;
    ToProcess                   :String;
    ToProcessNM                 :String;
    ProductionAccountant        :String;
    SFGDsc                      :String;
    POQty                       :Decimal;
    PlantNM                     :String;
    FloorNM                     :String;
    QANM                        :String;
    InspectionType              :String;
    GMCQty                      :Decimal;
    PlecesWeight                :Decimal;
    QADocumentNum               :String;
    TotalWeight                 :Decimal;
    Remarks                     :String;
    StatusRemarks               :String;
    NSuperwiserName             :String;
    NQAName                     :String;
    NContractCode               :String;
    NContractName               :String;
    NPlantName                  :String;
    NFloorName                  :String;
    Creater                     :String;
    CycleTime                   :String;
    PalletNumber                :String;
    ShiftTime                   :String;
    ToShiftTime                 :String;
    FirstLevelStatus            :String;
    FirstLeverUser              :String;
    SuperwiserStatus            :String;
    FristLCommitDate            :Date;
    SecondLevelStatus           :String;
    SecondLevelUser             :String;
    SecondLCommitDate           :Date;
    IsDocumentreadyForPosting   :Boolean; 
    DocumentPosted              :Boolean;
    ManualSalesOrderItemCode   :String;
             
}

entity UserMapping:cuid,managed {
    Plant                :String;
    Storage              :String;
    Contractor           :String;
    Superviser           :String;
    QA1                  :String;
    Prodteam             :String;
    QA2                  :String;
    ToProcess            :String;
    Shift                 :String;
    ISActive              :Boolean default true;

}

entity Orders : cuid, managed {
  orderNo     : String(20);
  customer    : String(100);
  totalAmount : Decimal(15,2);

  items : Composition of many OrderItems
            on items.parent = $self;
}

entity OrderItems : cuid, managed {
  parent      : Association to Orders;
  product     : String(100);
  quantity    : Integer;
  price       : Decimal(15,2);
}

entity IBPC_Head:cuid,managed{
    Buyer               :String;
    SalesOrderNo        :String;
    ItemCode            :String;
    ItemName            :String;
    CadNo               :String;
    PkgUnit             :String;
    Date                :String;
    IBPC_LineNo         :Composition of many IBPC_Line on IBPC_LineNo.Parent=$self;

}

entity IBPC_Line:cuid,managed{
    LineNum                 :Int32;
    Parent                  :Association to IBPC_Head;
    INTComponentCode        :String;
    INTDescription          :String;
    INTQuantity             :Decimal(18,6);
    INTUom                  :String;
    INTRemarks              :String;
    SAMComponentCode        :String;
    SAMDescription          :String;
    SAMQuantity             :Decimal(18,6);
    SAMUom                  :String;
    ADMRemarks              :String;
    ALLComponentCode        :String;
    ALLDescription          :String;
    ALLQuantity             :Decimal(18,6);
    ALLUom                  :String;
    ALLRemarks              :String;
    EDIType                 :String;
    EDIComponentCode        :String;
    EDIDescription          :String;
    EDIQuantity             :Decimal(18,6);
    EDIUom                  :String;
    EDIRemarks              :String;
    ProcessDetail           :Composition of many ProcessperameterHead on ProcessDetail.IBPC_Line_parent=$self;
    
}

entity ProcessperameterHead:cuid,managed{
   IBPC_Line_parent                 :Association to IBPC_Line;
   Parent_ID                         :String;
   ChildItemCode                     :String;
   ItemCode                         :String;
   ProcessperameterLines            :Composition of many ProcessperameterLine on ProcessperameterLines.ProcessperameterHeadID=$self;
  
}
entity ProcessperameterLine:cuid,managed
{
   ProcessperameterHeadID         :Association to ProcessperameterHead;
   ProcessId                :String;
   ProcessID_Desc           :String;
   Sample                   :String;
   ProcessTemplate          :String;
   Edition                  :String;
   Processcost              :String; 
}