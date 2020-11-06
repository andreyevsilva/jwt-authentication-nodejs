const User = require('../model/user');
const jwt = require('jsonwebtoken');
require('dotenv/config');


class AuthService {

    async registration(data) {
        try {

            const user = await User.create(data);

            user.passwrod = undefined;

            return user
        } catch (error) {
            throw new Error('Registration failed: ' + error);
        }
    }


    generateToken(params = {}) {
        const token = jwt.sign(params, process.env.SECRET_API, {
            expiresIn: 86400
        });

        return token;
    }
}

module.exports = AuthService;