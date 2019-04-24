global class WESLI_OAuth_Service {

    @remoteAction
    global static List<WESLI.WESLIDOC> getRoutines(){
    
      return WESLI.getRoutines();
    }
    
    @RemoteAction
    global static string getloginUrl(){
        oauth2 oauth2 = new oauth2();
        return '/services/oauth2/authorize?response_type=token&client_id=' + oauth2.clientId + '&redirect_uri=' + oauth2.redirectUri;
    }
    @remoteAction
    global static string getLogout(string basehref, string token){
        oauth2 oauth2 = new oauth2();
        HttpRequest req = new HttpRequest();
        req.setEndpoint(basehref + '/services/oauth2/revoke?token=' + token);
        req.setMethod('GET');
        Http http = new Http();
        HTTPResponse res = http.send(req);
        System.debug(res.getBody());
        return res.getBody();
    }

    @remoteAction
    global static settings getSettings(){
        return new settings();
    }

    global class settings{
        public string clientId{get; set;}
        public String redirectUri{get; set;}
        public settings(){
            WESLI_Settings__c settings = WESLI_Settings__c.getInstance();
            this.clientId = settings.Client_Id__c;
            this.redirectUri = settings.Redirect_URL__c;
        }

    }

    global class oauth2{
        public string clientId{get; set;}
        public String clientSecret{get; set;}
        public String redirectUri{get; set;}
        public string loginUrl{Get; set;}

        public oauth2(){
            WESLI_Settings__c settings = WESLI_Settings__c.getInstance();
            this.clientId = settings.Client_Id__c;
            this.clientSecret = settings.Client_Secret__c;
            this.redirectUri = settings.Redirect_URL__c;
            this.loginUrl = settings.Login_URL__c;
        }
    }
}