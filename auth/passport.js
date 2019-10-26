const models = require('../models');
const passport = require('passport');

function setupLocalStrategy() {

    const LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },

        function (email, password, cb) {

            return models.User.findOne({ where: { email } })
                .then(user => {

                    if (!user || !user.verifyPassword(password)) {
                        return cb(null, false, 'Incorrect email or password.');
                    }

                    return cb(null, user.get(), 'Logged In Successfully');

                })
                .catch(err => cb(err));
        }
    ));
}




function setupJWTStrategy() {

    const passportJWT = require("passport-jwt");
    const JWTStrategy = passportJWT.Strategy;
    const ExtractJWT = passportJWT.ExtractJwt;

    passport.use(new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.secret_key
        },

        function (jwtPayload, cb) {

            return models.User.findByPk(jwtPayload.id)
                .then(user => {
                    return cb(null, user.get());
                })
                .catch(err => {
                    return cb(err);
                });
        }
    ));
}



setupLocalStrategy();
setupJWTStrategy();

module.exports = passport;
