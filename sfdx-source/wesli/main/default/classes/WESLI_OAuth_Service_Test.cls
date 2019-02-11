@IsTest public with sharing class WESLI_OAuth_Service_Test {
    @IsTest(SeeAllData=true) public static void testOAuthService() {

         WESLI_OAuth_Service service = new WESLI_OAuth_Service();
         Test.setMock(HttpCalloutMock.class, new WESLI_Mock());
         WESLI_OAuth_Service.getLoginUrl();
         WESLI_OAuth_Service.getLogout('https://test.salesforce.com','FAKETOKEN');
         WESLI_OAuth_Service.getSettings();

    }
}
