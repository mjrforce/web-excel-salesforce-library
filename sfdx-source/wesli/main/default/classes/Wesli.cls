global class Wesli{  

    
    global static List<WESLIDOC> getRoutines(){
      List<WESLIDOC> routines = new List<WESLIDOC>();
      List<WESLI_Document__mdt> docs = [select id, DeveloperName, Label, (SELECT Id, Query__c from WESLI_Query__r Order by Order__c) from WESLI_Document__mdt];
      for(WESLI_Document__mdt doc: docs){
         routines.add(New WESLIDOC(doc));
      }
      return routines;
    }
    
    global class WESLIDOC{      
        public string uniqueId{Get; set;}
        public string label{get; set;}
        public List<String> queries {get; set;}
    
       
        public WESLIDOC(WESLI_Document__mdt doc){
           this.queries = new List<String>();
           this.uniqueId = doc.Id;
           this.label = doc.Label;
           for(WESLI_Query__mdt q:doc.WESLI_Query__r){
              this.queries.add(q.Query__c);
           }
        }
    }
}