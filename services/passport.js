const passport = require('passport');
const Member = require('../models/member');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    // Verify this email and password, call done with the member
    // if it is the correct email and password
    // otherwise, call done with false
    Member.findOne({ email: email }, (err, member) => {
        if (err) { return done(err); }
        if (!member) { return done(null, false); }

        // compare passwords - is `password` equal to member.password?
        member.comparePassword(password, (err, isMatch) => {
            if (err) { return done(err); }
            if (!isMatch) { return done(null, false); }

            return done(null, member);
        });
    });
});

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    Member.findById(payload.sub, (err, member) => {
        if (err) { return done(err, false); }

        if (member) {
            done(null, member);
        } else {
            done(null, false);
        }
    });
});

passport.use(jwtLogin);
passport.use(localLogin);