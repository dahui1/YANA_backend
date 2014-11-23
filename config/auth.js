// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '1573408202879559', // Facebook App ID
        'clientSecret'  : '72daaf9d7fd6226a8969ef0b04a6cafa', // YANA's App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }
};