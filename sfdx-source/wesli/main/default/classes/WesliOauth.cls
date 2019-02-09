public class WesliOauth{  

    @remoteAction
    public static oauthsettings getOauthSettings(){
      return new oauthsettings();
    }
    
    public class oauthsettings{      
       public string clientId{get; set;}
       public String clientSecret{get; set;}
       public String redirectUri{get; set;}
       public string loginUrl{Get; set;}
            
        public oauthsettings(){
           WESLI_Settings__c settings = WESLI_Settings__c.getInstance();
           this.clientId = settings.Client_Id__c;
           this.clientSecret = settings.Client_Secret__c;
           this.redirectUri = settings.Redirect_URL__c;
           this.loginUrl = settings.Login_URL__c;
        }
    }
}