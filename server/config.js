exports.PORT = process.env.PORT || 3001; // use heroku's dynamic port or 3001 if localhost
exports.DEBUG = process.env.DEBUG || true;
exports.REPLAY_ID = process.env.REPLAY_ID || -1;

exports.OAUTH_SETTINGS = {
    loginUrl: process.env.LOGIN_URL || 'https://login.salesforce.com',
    clientId: process.env.CLIENT_ID || "3MVG9KsVczVNcM8wT1kgTkpvDQpHvy4E.Fl_SoORbyNjZJqA29huXyh.c4fAwSFiRto4nKIVuQO.RsJ6K5yWz",
    clientSecret: process.env.CLIENT_SECRET || "6027416036373724024",
    redirectUri: process.env.CALLBACK_URL || 'http://localhost:3001/oauth2/callback'
};
