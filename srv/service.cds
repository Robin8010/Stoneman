using { Stonemen_GMC as StonemanDatabase } from '../db/schema';

service UserMasterServices {
    entity UserMasterT as projection on StonemanDatabase.UserMasterT;
}

service GMCHeaderServices {
    entity GMCHeader as projection on StonemanDatabase.GMCHeader;
}

service UserMappingServices {
    entity UserMapping as projection on StonemanDatabase.UserMapping;
}

service IBPSServices{
    entity IBPC_Head as projection on StonemanDatabase.IBPC_Head;
    entity IBPC_Line as projection on StonemanDatabase.IBPC_Line; 
    entity ProcessperameterHead as projection on StonemanDatabase.ProcessperameterHead; 
        
    
}

@readonly
service FilteredUserMappingService {

    entity UserMapping as
        select from StonemanDatabase.UserMapping as G
        left join StonemanDatabase.UserMasterT as T
            on G.QA1 = T.username
        left join StonemanDatabase.UserMasterT as T3
            on G.Superviser = T3.username
        left join StonemanDatabase.UserMasterT as T4
            on G.QA2 = T4.username
        left join StonemanDatabase.UserMasterT as T5
            on G.Prodteam = T5.username
    {
        key G.ID,
        G.Contractor,
        G.Plant,
        T5.ID as ProdteamID,
        G.Prodteam,
        T.ID as QA1ID,
        G.QA1,
        T4.ID as QA2ID,
        G.QA2,
        G.Shift,
        G.Storage,
        T3.ID as SuperviserID,
        G.Superviser,
        G.ToProcess as Process
    };

}

service OrderService {
  entity Orders as projection on StonemanDatabase.Orders;
  entity OrderItems as projection on StonemanDatabase.OrderItems;
}

service SuperwiserMapping {
        entity SuperwiserMapping as select from StonemanDatabase.UserMapping as M
        inner join StonemanDatabase.UserMasterT as U
            on U.username = M.Superviser
    {
        key M.ID,
        M.Plant,
        M.Storage,
        M.ToProcess,
        M.Contractor,
        M.Shift,
        U.username   as Superviser,
        U.Description       as Superviser_Username,
    };
}

service ContractorMapping {
        entity ContractorMapping as select from StonemanDatabase.UserMapping as M
        inner join StonemanDatabase.UserMasterT as U
            on U.username = M.Contractor
    {
        key M.ID,
        M.Plant,
        M.Storage,
        M.ToProcess,
        M.Shift,
        M.Contractor,
        U.Description       as Contractor_Username,
    };
}


service QA1 {
        entity QA1 as select from StonemanDatabase.UserMapping as M
        inner join StonemanDatabase.UserMasterT as U
            on U.username = M.QA1
    {
        key M.ID,
        M.Plant,
        M.Storage,
        M.ToProcess,
        M.QA1,
        M.Shift,
        U.Description       as QA1_Username,
    };
}

service QA2 {
        entity QA2 as select from StonemanDatabase.UserMapping as M
        inner join StonemanDatabase.UserMasterT as U
            on U.username = M.QA2
    {
        key M.ID,
        M.Plant,
        M.Storage,
        M.ToProcess,
        M.QA2,
        M.Shift,
        U.Description       as QA2_Username,
    };
}


service Prodteam {
        entity Prodteam as select from StonemanDatabase.UserMapping as M
        inner join StonemanDatabase.UserMasterT as U
            on U.username = M.Prodteam
    {
        key M.ID,
        M.Plant,
        M.Storage,
        M.ToProcess,
        M.Prodteam,
        M.Shift,
        U.Description       as Prodteam_Username,
    };
}

service Maxkey {

   entity GMCHeaderMax as select from StonemanDatabase.GMCHeader as G {
      key  COALESCE(MAX(COALESCE(NULLIF(G.GMCNo, 0), NULL)), 0) + 1 AS MaxGMCNo : Int32
       
    }
}
service ReportData{

    entity GMCHeaderReport as select from StonemanDatabase.GMCHeader as G
    left join StonemanDatabase.UserMasterT as T on G.QANM=T.username
    left join StonemanDatabase.UserMasterT as T3 on G.NSuperwiserName=T3.username
    left join StonemanDatabase.UserMasterT as T4 on G.NQAName=T4.username
    left join StonemanDatabase.UserMasterT as T5 on G.ProductionAccountant=T5.username
    {
        key G.ID,
        G.GMCNo,
        G.PlantNM,
        G.createdAt,
        G.QADocumentNum,
        G.InspectionType,
        G.ShiftTime,
        G.PalletNumber,
        G.JobworkPo,
        G.SONO,
        G.CycleTime,
        G.FromProcessNM,
        G.VendorCode,
        G.ContractNM,
        G.SuperwiserNM as Superviser1,
        T.Description as QA1Name,
        G.ToProcessNM,
        G.NContractCode,
        G.NContractName,
        T3.Description as Superviser2,
        G.SKU,
        G.SFGDsc,
        G.GMCQty,
        G.modifiedAt,
        G.Remarks,
        G.FirstLevelStatus,
        G.SuperwiserStatus,
        G.SecondLevelStatus,
        
        T4.Description as QA2,
        T5.Description as ProductionAccountant,
        G.PODescription,
        G.ManualSalesOrderItemCode
    }
    
}



