global class WESLI_Mock implements HttpCalloutMock{
    //new comment
    global HTTPResponse respond(HTTPRequest req) {
        httpResponse res = new HttpResponse();
        res.setStatusCode(200);
        return res;
    }
}