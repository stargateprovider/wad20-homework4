const UserModel = require('../models/UserModel');
const jwt = require('../library/jwt');

module.exports = (request, response, next) => {

    // This is the place where you will need to implement authorization
    /*
        Pass access token in the Authorization header and verify
        it here using 'jsonwebtoken' dependency. Then set request.currentUser as
        decoded user from access token.
    */

    if (request.headers.authorization) {
        const decodedUser = jwt.verifyAccessToken(request.headers.authorization.split(' ')[1]);
        
        if (decodedUser) {
            request.currentUser = decodedUser;
            next();
            return;
        }
    }

    return response.status(403).json({
        message: 'Invalid token'
    });
};